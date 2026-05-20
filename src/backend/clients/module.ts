import { Agent } from 'http';

import { httpConfig } from '../../config/http';
import { Sdk as OpenApiSdkClass } from './generated/OpenApiSdk';

export const OPEN_API_BACKEND_URL = 'https://api-boros.pendle.finance/apis';

let openApiBackendUrl: string | undefined;

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface OpenApiSdk extends OpenApiSdkClass<unknown> {}
/* eslint-enable @typescript-eslint/no-empty-interface */

let cachedOpenApiSdk: OpenApiSdk | undefined;

export function setOpenApiBackendUrl(url: string) {
  openApiBackendUrl = url;
  cachedOpenApiSdk = undefined;
}

export function createOpenApiSdk(baseURL: string): OpenApiSdk {
  return new OpenApiSdkClass<unknown>({
    baseURL,
    httpAgent: httpConfig.isKeepAliveDisabled() ? new Agent({ keepAlive: false }) : undefined,
    httpsAgent: httpConfig.isKeepAliveDisabled() ? new Agent({ keepAlive: false }) : undefined,
  });
}

export function getOpenApiSdk(): OpenApiSdk {
  const url = openApiBackendUrl ?? OPEN_API_BACKEND_URL;
  if (cachedOpenApiSdk === undefined) {
    cachedOpenApiSdk = createOpenApiSdk(url);
  }
  return cachedOpenApiSdk;
}
