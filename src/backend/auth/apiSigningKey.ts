import { KeyObject, createPrivateKey, randomBytes, sign } from 'crypto';
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/** Fixed by the credential's verifier — changing either value invalidates every token. */
const JWT_ISSUER = 'pendle';
const JWT_AUDIENCE = 'pendle-open-api';
const JWT_MAX_LIFETIME_s = 120;
const DEFAULT_LIFETIME_s = 60;

/** Rejected by the gateway before a key is even looked up, so check it here where the error can say why. */
const KEY_ID_REGEX = /^pdk_[0-9a-f]{16}$/;

export const API_KEY_AUTH_HEADER = 'x-pendle-auth';

export interface ApiSigningKeyCredentials {
  /** Key id shown when the key was created, e.g. `pdk_45ba7df73b742992`. */
  keyId: string;
  /** PKCS#8 PEM secret returned once at creation. Never recoverable afterwards. */
  privateKey: string;
}

function base64url(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

/**
 * An Ed25519 API signing key. Proves a root wallet and nothing more — placing or cancelling
 * additionally needs an agent signature, so a leaked key cannot move a position.
 */
export class ApiSigningKey {
  readonly keyId: string;
  private readonly key: KeyObject;

  constructor({ keyId, privateKey }: ApiSigningKeyCredentials) {
    if (!KEY_ID_REGEX.test(keyId)) {
      throw new Error(`Malformed API signing key id "${keyId}": expected \`pdk_\` followed by 16 hex characters`);
    }
    this.keyId = keyId;
    this.key = createPrivateKey(privateKey);
    if (this.key.asymmetricKeyType !== 'ed25519') {
      throw new Error(`Boros API signing keys are Ed25519, got ${this.key.asymmetricKeyType ?? 'an unknown key type'}`);
    }
  }

  /**
   * Self-signed JWT for one request. `path` must be the public path you called, `/apis` prefix
   * included. Query strings are not part of the claim, so one token covers every query on it.
   */
  token(method: string, path: string, lifetimeSeconds: number = DEFAULT_LIFETIME_s): string {
    if (lifetimeSeconds < 1 || lifetimeSeconds > JWT_MAX_LIFETIME_s) {
      throw new Error(`Token lifetime must be between 1 and ${JWT_MAX_LIFETIME_s} seconds`);
    }
    const now = Math.floor(Date.now() / 1000);
    const header = base64url({ alg: 'EdDSA', typ: 'JWT', kid: this.keyId });
    const payload = base64url({
      sub: this.keyId,
      iss: JWT_ISSUER,
      // Plain string, never RFC 7519's array form: the gateway rejects the array outright.
      aud: JWT_AUDIENCE,
      jti: randomBytes(16).toString('hex'),
      uri: `${method.toUpperCase()} ${path}`,
      iat: now,
      nbf: now,
      exp: now + lifetimeSeconds,
    });
    const signature = sign(null, Buffer.from(`${header}.${payload}`), this.key).toString('base64url');
    return `${header}.${payload}.${signature}`;
  }
}

/** Only ever supplies an origin for relative `baseURL`s; the pathname is all we read back. */
const RELATIVE_PATH_ORIGIN = 'http://x.invalid';

/** Resolves the path axios will actually request, so the `uri` claim matches what the server sees. */
function resolveRequestPath(config: InternalAxiosRequestConfig): string {
  const url = config.url ?? '';
  const base = (config.baseURL ?? '').replace(/\/+$/, '');
  const joined = /^https?:\/\//i.test(url) ? url : `${base}/${url.replace(/^\/+/, '')}`;
  // Parsed, never hand-sliced, so the claim is the exact pathname axios requests. The gateway
  // unescapes both sides before comparing, so the encoding need not match byte for byte.
  return new URL(joined, RELATIVE_PATH_ORIGIN).pathname;
}

/** Signs every outgoing request on `instance`. Returns the interceptor id, so callers can eject it to swap keys. */
export function attachApiSigningKey(instance: AxiosInstance, key: ApiSigningKey): number {
  return instance.interceptors.request.use((config) => {
    config.headers.set(API_KEY_AUTH_HEADER, key.token(config.method ?? 'GET', resolveRequestPath(config)));
    return config;
  });
}
