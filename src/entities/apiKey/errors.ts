import { ApiSigningKeyCredentials } from '../../backend/auth';

/**
 * The key was minted but did not start authenticating in time. **`key` carries the only copy of
 * the PKCS#8 PEM that will ever exist** — persist it, then retry `waitUntilUsable` or revoke.
 */
export class ApiKeyNotUsableError extends Error {
  readonly key: ApiSigningKeyCredentials;

  constructor(key: ApiSigningKeyCredentials, options?: { cause?: unknown }) {
    super(`API signing key ${key.keyId} was created but is not usable yet. The secret is on \`error.key\`.`, options);
    this.name = 'ApiKeyNotUsableError';
    this.key = key;
  }
}

/** An open-api error with the server's own message, which axios otherwise reduces to a status code. */
export class ApiKeyRequestError extends Error {
  readonly status?: number;
  readonly errorCode?: string;

  constructor(message: string, status?: number, errorCode?: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ApiKeyRequestError';
    this.status = status;
    this.errorCode = errorCode;
  }
}

/** open-api replies `{ statusCode, message, errorCode }`; class-validator makes `message` an array. */
export function toApiKeyRequestError(cause: unknown): unknown {
  const response = (cause as { response?: { status?: number; data?: Record<string, unknown> } })?.response;
  if (!response?.data) return cause;

  const { message, errorCode } = response.data as { message?: string | string[]; errorCode?: string };
  const text = Array.isArray(message) ? message.join('; ') : message;
  if (!text) return cause;

  return new ApiKeyRequestError(text, response.status, errorCode, { cause });
}
