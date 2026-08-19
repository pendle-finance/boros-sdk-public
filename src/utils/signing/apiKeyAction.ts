import { Address, Hex, WalletClient, toHex } from 'viem';
import { getUserAddressFromWalletClient } from '..';
import { EIP712_DOMAIN_TYPES, createPendleBorosRouterDomain, getSecureRandomValues } from './common';

export const API_KEY_ACTIONS = ['create', 'list', 'update', 'revoke'] as const;
export type ApiKeyAction = (typeof API_KEY_ACTIONS)[number];

export const API_KEY_ACTION_TYPES = {
  ApiKeyAction: [
    { name: 'root', type: 'address' },
    { name: 'action', type: 'string' },
    { name: 'keyId', type: 'string' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'nonce', type: 'bytes32' },
  ],
} as const;

/** Ready to send: request body for create / update / revoke, query string for list. */
export interface ApiKeyActionEnvelope {
  root: Address;
  action: ApiKeyAction;
  keyId: string;
  timestamp: number;
  nonce: Hex;
  agent?: Address;
  signature: Hex;
}

export interface SignApiKeyActionParams {
  /** Wallet that owns the keys. */
  root: Address;
  action: ApiKeyAction;
  /** Key to act on. Omit for create and list. */
  keyId?: string;
  /** Defaults to the SDK's router. Pass it when signing against a non-default deployment. */
  routerAddress?: Address;
}

/**
 * Signs the envelope every `/v1/api-keys` route takes. `wallet` is either the root itself or an
 * agent approved on its sub-account 0 — an approved agent has the same rights over API keys as
 * the root, so a bot can rotate its own keys.
 *
 * The envelope timestamp is in MILLISECONDS and lasts 5 minutes, unlike the per-request JWT that
 * `ApiSigningKey` mints in seconds.
 */
export async function signApiKeyAction(
  wallet: WalletClient,
  { root, action, keyId = '', routerAddress }: SignApiKeyActionParams
): Promise<ApiKeyActionEnvelope> {
  const signer = (wallet.account?.address ?? (await getUserAddressFromWalletClient(wallet))) as Address | undefined;
  if (!signer) {
    throw new Error('signApiKeyAction: the wallet has no connected account to sign with');
  }
  const signedRoot = root.toLowerCase() as Address;
  // Rides unsigned beside the payload; the server verifies the signature against it.
  const agent = signer.toLowerCase() === signedRoot ? undefined : signer;

  const timestamp = Date.now();
  const nonce = toHex(getSecureRandomValues(32));

  const signature = await wallet.signTypedData({
    account: wallet.account ?? signer,
    domain: createPendleBorosRouterDomain(routerAddress),
    types: { EIP712Domain: EIP712_DOMAIN_TYPES, ...API_KEY_ACTION_TYPES },
    primaryType: 'ApiKeyAction',
    message: { root: signedRoot, action, keyId, timestamp: BigInt(timestamp), nonce },
  });

  return { root: signedRoot, action, keyId, timestamp, nonce, agent, signature };
}
