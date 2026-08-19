import { Address, Hex, WalletClient } from 'viem';
import { OpenApiSdk } from '../../backend/clients/module';

/** A raw private key or a viem `WalletClient`. */
export type ApiKeySigner = Hex | WalletClient;

export interface ApiKeysOptions {
  /** Defaults to the SDK's router. Pass it when talking to a non-default deployment. */
  routerAddress?: Address;
  openApiSdk?: OpenApiSdk;
}

export interface ApiKeysConfig extends ApiKeysOptions {
  /**
   * Wallet that owns the keys. Required even when `signer` is the root itself — prefer
   * `ApiKeys.asRoot()` / `ApiKeys.asAgent()`, which make the relationship explicit.
   */
  root: Address;
  /** The root wallet, or an agent approved on its sub-account 0. */
  signer: ApiKeySigner;
}

export interface WaitUntilUsableOptions {
  /** Default 20_000. */
  timeoutMs?: number;
  /** Default 3_000. */
  intervalMs?: number;
}

export interface CreateApiKeyParams {
  /** 1-32 characters of `A-Z a-z 0-9 space _ . -`, unique among your live keys. */
  name: string;
  /** Omit for a key that never expires. */
  expiresInDays?: number;
  /**
   * Wait for the key to actually authenticate before returning. On by default — a fresh key 401s
   * for a few seconds. Pass `false` to skip, or options to tune the wait.
   */
  waitUntilUsable?: boolean | WaitUntilUsableOptions;
}
