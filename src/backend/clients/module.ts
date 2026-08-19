import { Agent } from 'http';

import { httpConfig } from '../../config/http';
import { ApiSigningKey, attachApiSigningKey } from '../auth';
import { Sdk as OpenApiSdkClass } from './generated/OpenApiSdk';

export const OPEN_API_BACKEND_URL = 'https://api-boros.pendle.finance/apis';

let openApiBackendUrl: string | undefined;
let openApiSigningKey: ApiSigningKey | undefined;

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface OpenApiSdk extends OpenApiSdkClass<unknown> {}
/* eslint-enable @typescript-eslint/no-empty-interface */

let cachedOpenApiSdk: OpenApiSdk | undefined;

export function setOpenApiBackendUrl(url: string) {
  openApiBackendUrl = url;
  cachedOpenApiSdk = undefined;
}

/** Installs the API signing key for the `/v1/stop-orders` tree. `/v1/api-keys` takes an EIP-712 envelope from the root or an approved agent instead. */
export function setOpenApiSigningKey(key: ApiSigningKey | undefined) {
  openApiSigningKey = key;
  cachedOpenApiSdk = undefined;
}

export function createOpenApiSdk(baseURL: string, signingKey?: ApiSigningKey): OpenApiSdk {
  const sdk = new OpenApiSdkClass<unknown>({
    baseURL,
    httpAgent: httpConfig.isKeepAliveDisabled() ? new Agent({ keepAlive: false }) : undefined,
    httpsAgent: httpConfig.isKeepAliveDisabled() ? new Agent({ keepAlive: false }) : undefined,
  });
  if (signingKey) {
    attachApiSigningKey(sdk.instance, signingKey);
  }
  return sdk;
}

export function getOpenApiBackendUrl(): string {
  return openApiBackendUrl ?? OPEN_API_BACKEND_URL;
}

export function getOpenApiSdk(): OpenApiSdk {
  const url = getOpenApiBackendUrl();
  if (cachedOpenApiSdk === undefined) {
    cachedOpenApiSdk = createOpenApiSdk(url, openApiSigningKey);
  }
  return cachedOpenApiSdk;
}
