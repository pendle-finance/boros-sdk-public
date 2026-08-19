# Changelog

## 0.3.1

### Patch Changes

- cbeffcf: Remove references to internal repository paths from the published source: a comment naming the
  verifier's file inside a private repo, and a commented-out import of an internal metrics module.

## 0.3.0

### Minor Changes

- c6044c4: Manage API signing keys from the SDK, signing as the root **or as an approved agent**.

  `ApiKeys` covers the whole lifecycle — `create`, `list`, `rename`, `revoke`, plus `waitUntilUsable`
  for the few seconds a fresh key still 401s while the gateway reloads, and `ApiKeys.activate()` to
  install stored credentials on restart. Build it with `ApiKeys.asRoot(signer)` or
  `ApiKeys.asAgent(root, signer)`; the signer is a private key or a `WalletClient`. An agent approved
  on the root's sub-account 0 has the same rights over API keys as the root, so a bot can rotate its
  own keys without the root key in its environment.

  `signApiKeyAction` is the lower-level escape hatch for anyone driving the generated client directly.

  The open-api client is regenerated from prod: `agent` on the key-management request DTOs,
  `createdByAgent` on the responses. `apiKeys.apiKeysControllerList` now takes a required `query` —
  its four envelope fields were optional only because that route used to accept the dashboard's
  session cookie, which has moved to a separate route that the client does not expose.

## 0.2.0

### Minor Changes

- 5d3a43d: Support stop orders (take-profit / stop-loss) on open-api.

  - `ApiSigningKey` + `setOpenApiSigningKey()` sign every request with a short-lived Ed25519 JWT in
    `x-pendle-auth`, the credential the new `/v1/stop-orders` endpoints require.
    Key ids are `pdk_`-prefixed and validated on construction.
  - New `StopOrders` entity: `list`, `get`, `prepare`, `place`, `cancel`. `place` runs the whole
    prepare -> agent-sign -> submit sequence. It takes no `accountId` — every route packs the account
    from the key's root plus sub-account 0, so one passed here would be dropped and read as 0.
  - Regenerated the open-api client, which also picks up already-live changes the committed copy had
    drifted past (`LimitOrderResponseV2.orderType` is now `0 | 1`, `status` is `0..4`).

### Patch Changes

- 4136b0c: Bump `axios` to `^1.18.1` (resolves 1.19.0) and `viem` to `2.55.10`, clearing every advisory in the
  SDK's own dependency path — 18 axios ones, `form-data` CVE-2026-12143, and the `ws` DoS
  CVE-2026-48779 that reached us through viem.

  `viem` is a direct dependency rather than a peer one, so consumers share the version pinned here.
  `2.44.4 -> 2.55.10` is a minor bump with no API change on the surface this SDK uses.

  The remaining findings all trace to `@pendle/boros-core`, which declares Solidity-source packages
  (`@openzeppelin/contracts`, `@layerzerolabs/*`) as runtime dependencies; `@layerzerolabs/oapp-evm`
  pulls in `ethers@5`, and with it `ws@8.18.0` and `bn.js`. The SDK imports one JSON ABI artifact from
  that package and executes none of it. Fixing it belongs in `boros-core`.

## 0.1.0 — Initial public release

- First public release of the Boros SDK targeting open-api-v2.
- `Exchange` class wrapping placeOrder / bulkPlaceOrders / cancelOrders / deposit / withdraw / payTreasury / cashTransfer.
- Cursor-paginated reads: `getOrdersPage`, `getMarkets`, `getMarketsByIds`, plus `getAllMarkets` (cached).
- Contract-side reads: `getActiveOrdersFromContract`, `getUserPositions`.
- Agent lifecycle: `Agent.create`, `Exchange.approveAgent`, `Exchange.getAgentExpiryTime`.
- Escape hatch: `getOpenApiSdk()` returns the codegen client for raw open-api-v2 access.
