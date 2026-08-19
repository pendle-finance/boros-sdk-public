import { http, Address, WalletClient, createWalletClient, isHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum } from 'viem/chains';
import { ApiSigningKey, ApiSigningKeyCredentials } from '../../backend/auth';
import { SigningKeyDto, SigningKeySecretDto } from '../../backend/clients/generated/OpenApiSdk';
import {
  OpenApiSdk,
  createOpenApiSdk,
  getOpenApiBackendUrl,
  getOpenApiSdk,
  setOpenApiSigningKey,
} from '../../backend/clients/module';
import { ApiKeyAction, ApiKeyActionEnvelope, signApiKeyAction } from '../../utils/signing/apiKeyAction';
import { ApiKeyNotUsableError, toApiKeyRequestError } from './errors';
import { ApiKeySigner, ApiKeysConfig, ApiKeysOptions, CreateApiKeyParams, WaitUntilUsableOptions } from './types';

const PRIVATE_KEY_LENGTH = 66;
const DEFAULT_WAIT_TIMEOUT_ms = 20_000;
const DEFAULT_WAIT_INTERVAL_ms = 3_000;

/**
 * Ed25519 API signing keys on `open-api`. These routes are authenticated by an EIP-712 envelope
 * from a wallet rather than by an API key — chicken and egg otherwise.
 *
 * The signer is the root, or an agent approved on its sub-account 0; an approved agent has the
 * same rights as the root over every key of that root, so a bot can rotate its own keys.
 * Build one with {@link ApiKeys.asRoot} or {@link ApiKeys.asAgent} — they make which wallet is
 * signing explicit, and an agent cannot be mistaken for a root.
 */
export class ApiKeys {
  private readonly wallet: WalletClient;
  private readonly root: Address;
  private readonly routerAddress?: Address;
  private readonly injectedSdk?: OpenApiSdk;

  constructor(config: ApiKeysConfig) {
    if (!config.root) {
      throw new Error('ApiKeys: `root` is required. Use ApiKeys.asRoot(signer) if the signer is the root itself.');
    }
    this.wallet = toWalletClient(config.signer);
    this.root = config.root.toLowerCase() as Address;
    this.routerAddress = config.routerAddress;
    this.injectedSdk = config.openApiSdk;
  }

  /** The signing wallet owns the keys. */
  static asRoot(signer: ApiKeySigner, options: ApiKeysOptions = {}): ApiKeys {
    const wallet = toWalletClient(signer);
    const root = wallet.account?.address;
    if (!root) {
      throw new Error('ApiKeys.asRoot: the wallet has no connected account. Pass a private key, or use `new ApiKeys`.');
    }
    return new ApiKeys({ ...options, root, signer: wallet });
  }

  /** The signing wallet is an agent approved on `root`'s sub-account 0. */
  static asAgent(root: Address, signer: ApiKeySigner, options: ApiKeysOptions = {}): ApiKeys {
    return new ApiKeys({ ...options, root, signer });
  }

  // Read per call: setOpenApiSigningKey() works by invalidating the module cache.
  private get openApiSdk(): OpenApiSdk {
    return this.injectedSdk ?? getOpenApiSdk();
  }

  private envelope(action: ApiKeyAction, keyId?: string) {
    return signApiKeyAction(this.wallet, { root: this.root, action, keyId, routerAddress: this.routerAddress });
  }

  /**
   * Mints a key and returns its PKCS#8 PEM **once** — persist it before anything else. A root may
   * hold at most 6 live keys; revoke one first, or `create` rejects with 422.
   *
   * Waits for the key to authenticate by default. If that wait times out the key still exists, so
   * the failure is an {@link ApiKeyNotUsableError} carrying the secret on `.key` rather than a
   * plain throw that would strand it.
   */
  async create(params: CreateApiKeyParams): Promise<SigningKeySecretDto> {
    const { waitUntilUsable = true, ...rest } = params;
    const envelope = await this.envelope('create');
    const { data } = await request(() =>
      this.openApiSdk.apiKeys.apiKeysControllerCreate({ ...body(envelope), ...rest })
    );

    if (waitUntilUsable !== false) {
      try {
        await this.waitUntilUsable(data, waitUntilUsable === true ? {} : waitUntilUsable);
      } catch (cause) {
        throw new ApiKeyNotUsableError(data, { cause });
      }
    }
    return data;
  }

  /** Every live key of the root, secrets excluded — including ones other agents minted. */
  async list(): Promise<SigningKeyDto[]> {
    const envelope = await this.envelope('list');
    const { data } = await request(() => this.openApiSdk.apiKeys.apiKeysControllerList(body(envelope)));
    return data;
  }

  /** Never touches key material, so anything already signing with this key keeps working. */
  async rename(keyId: string, name: string): Promise<SigningKeyDto> {
    const envelope = await this.envelope('update', keyId);
    const { data } = await request(() =>
      this.openApiSdk.apiKeys.apiKeysControllerUpdate({ ...body(envelope), keyId, name })
    );
    return data;
  }

  /** Frees both its name and a key slot. */
  async revoke(keyId: string): Promise<void> {
    const envelope = await this.envelope('revoke', keyId);
    await request(() => this.openApiSdk.apiKeys.apiKeysControllerRevoke({ ...body(envelope), keyId }));
  }

  /**
   * Blocks until a key authenticates. The gateway loads keys on a refresh tick, so for a few
   * seconds a valid key still 401s — without this the first call after `create` looks like a
   * broken PEM. Probes with a throwaway client, leaving any installed key alone.
   */
  async waitUntilUsable(key: ApiSigningKeyCredentials, options: WaitUntilUsableOptions = {}): Promise<void> {
    const { timeoutMs = DEFAULT_WAIT_TIMEOUT_ms, intervalMs = DEFAULT_WAIT_INTERVAL_ms } = options;
    // Same host the key was minted on, which is not always the module-global one.
    const baseURL = this.injectedSdk?.instance.defaults.baseURL ?? getOpenApiBackendUrl();
    const probe = createOpenApiSdk(baseURL, new ApiSigningKey(key));
    const deadline = Date.now() + timeoutMs;

    for (;;) {
      try {
        await probe.stopOrders.stopOrdersControllerGetStopOrders({ limit: 1 });
        return;
      } catch (error) {
        // Anything but a 401 is retried too: a transient 5xx or a dropped socket says nothing
        // about the key, and giving up on one would strand a secret that is only returned once.
        if (Date.now() > deadline) throw error;
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    }
  }

  /**
   * Installs a key as the credential every later open-api read uses. Takes `{ keyId, privateKey }`,
   * so it works on restart from stored credentials, not only with a freshly created key.
   */
  static activate(key: ApiSigningKeyCredentials): ApiSigningKey {
    const signingKey = new ApiSigningKey(key);
    setOpenApiSigningKey(signingKey);
    return signingKey;
  }
}

/**
 * The wire fields. `action` is derived from the route server-side and `keyId` belongs only to
 * routes that declare it — sending either is silently dropped today and a 400 the day open-api
 * turns on `forbidNonWhitelisted`.
 */
function body(envelope: ApiKeyActionEnvelope) {
  const { root, timestamp, nonce, agent, signature } = envelope;
  return { root, timestamp, nonce, agent, signature };
}

/** Replaces axios's bare "Request failed with status code 422" with what the server actually said. */
async function request<T>(send: () => Promise<T>): Promise<T> {
  try {
    return await send();
  } catch (cause) {
    throw toApiKeyRequestError(cause);
  }
}

/** A local account signs typed data offline, so the transport here is never used. */
function toWalletClient(signer: ApiKeySigner): WalletClient {
  if (typeof signer !== 'string') return signer;
  if (!isHex(signer) || signer.length !== PRIVATE_KEY_LENGTH) {
    throw new Error('ApiKeys: `signer` must be a 0x-prefixed 32-byte private key, or a WalletClient');
  }
  return createWalletClient({ account: privateKeyToAccount(signer), chain: arbitrum, transport: http() });
}
