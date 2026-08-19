# @pendle/boros-sdk-public

TypeScript SDK for [Pendle Boros](https://boros.pendle.finance) — wraps calldata generation, EIP-712 signing, and Send Txs Bot dispatch on top of the Boros Open API.

📖 **Full documentation**: https://docs.pendle.finance/boros-dev

| Page | Link |
|------|------|
| Backend overview (REST + SDK + WebSocket) | https://docs.pendle.finance/boros-dev/Backend/overview |
| **SDK** (this package) | https://docs.pendle.finance/boros-dev/Backend/sdk |
| Agent trading model | https://docs.pendle.finance/boros-dev/Backend/agent |
| HTTP API reference | https://docs.pendle.finance/boros-dev/Backend/api |
| Bot quickstart (end-to-end grid bot) | https://docs.pendle.finance/boros-dev/Backend/bot-quickstart |

---

## Install

```bash
npm install @pendle/boros-sdk-public viem
# math helpers (tick/rate conversion):
npm install @pendle/boros-offchain-math
```

`viem` is a direct dependency pinned to an exact version (currently `2.55.10`), not a peer one. Install
a range that covers it, or your package manager resolves a second copy and the `WalletClient` you pass
in won't match the type the SDK declares.

## Quickstart

```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum } from 'viem/chains';
import { Agent, Exchange, Side, TimeInForce, MarketAccLib, CROSS_MARKET_ID } from '@pendle/boros-sdk-public';
import { estimateTickForRate, FixedX18 } from '@pendle/boros-offchain-math';

const rootAccount = privateKeyToAccount(process.env.ROOT_PK as `0x${string}`);
const walletClient = createWalletClient({
  account: rootAccount,
  transport: http(process.env.RPC_URL),
  chain: arbitrum,
});

const agent = Agent.createFromPrivateKey(process.env.AGENT_PK as `0x${string}`);

const exchange = new Exchange(
  walletClient,
  rootAccount.address,
  /* accountId */ 0,
  [process.env.RPC_URL!],
  agent,
);

// Place a 5% APR limit order on the first whitelisted market.
const market = (await exchange.getAllMarkets({ isUiWhitelisted: true }))[0];
const marketAcc = MarketAccLib.pack(rootAccount.address, 0, market.tokenId, CROSS_MARKET_ID);
const limitTick = Number(
  estimateTickForRate(FixedX18.fromNumber(0.05), BigInt(market.imData.tickStep), true),
);

await exchange.placeOrder({
  marketAcc,
  marketId: market.marketId,
  side: Side.LONG,
  size: 10n ** 18n,
  limitTick,
  tif: TimeInForce.GOOD_TIL_CANCELLED,
});
```

## Stop orders (API signing key)

Take-profit / stop-loss orders live behind a second credential: an **Ed25519 API signing key**. Every
request carries a short-lived self-signed JWT, so there is no static token to paste into `curl` —
install the key once and the SDK signs each call for you.

Mint one from the [Boros dashboard](https://api-boros.pendle.finance/dashboard), or from a script
with `ApiKeys`. That tree is not covered by `setOpenApiSigningKey()` — it takes an EIP-712 envelope
signed by a wallet, not the request JWT.

```typescript
import { ApiKeys } from '@pendle/boros-sdk-public';

// The root wallet, or an agent approved on its sub-account 0 — an approved agent has the same
// rights over API keys, so the root key can stay out of your bot's environment.
const apiKeys = ApiKeys.asAgent(ROOT_ADDRESS, AGENT_PRIVATE_KEY);

const key = await apiKeys.create({ name: 'prod-mm-bot-01', expiresInDays: 90 });
console.log(key.keyId, key.privateKey); // the PEM is returned once — persist it now

ApiKeys.activate(key); // every later open-api read uses it
```

On restart, skip the mint and install what you stored:

```typescript
ApiKeys.activate({ keyId: process.env.BOROS_API_KEY_ID!, privateKey: process.env.BOROS_API_KEY_PEM! });
```

`list()`, `rename(keyId, name)` and `revoke(keyId)` round it out; a root may hold at most 6 live
keys. `create()` waits for the key to authenticate before returning, because the gateway reloads
keys on a refresh tick and a brand-new one 401s until it does.

```typescript
import {
  ApiSigningKey,
  Agent,
  setInternalAgent,
  setOpenApiSigningKey,
  Side,
  StopOrders,
  StopAprOrderType,
} from '@pendle/boros-sdk-public';

setOpenApiSigningKey(
  new ApiSigningKey({
    keyId: process.env.BOROS_API_KEY_ID!,          // pdk_...
    privateKey: process.env.BOROS_API_KEY_PEM!,    // the PKCS#8 PEM, shown once at creation
  }),
);

// No accountId: every route packs the account from the key's root plus sub-account 0.
const stopOrders = new StopOrders();

// Reads need only the key.
const live = await stopOrders.list({ isActive: true });

// Writes additionally need an agent approved on the account.
setInternalAgent(Agent.createFromPrivateKey(process.env.AGENT_PK as `0x${string}`));

const orderId = await stopOrders.place({
  marketId: live.results[0].marketId,
  isCross: true,
  side: Side.SHORT,
  type: StopAprOrderType.STOP_LOSS_MARKET,
  stopApr: 0.12,
  closePosition: true,
});

await stopOrders.cancel([orderId]);
```

The API key proves a **root wallet** and nothing more. The backend derives the account from the key
rather than reading it from the payload, so a leaked key can read your orders but cannot place or
cancel one without the agent key.

Full method reference, common flows, escape-hatch (`getOpenApiSdk()`), and the end-to-end bot quickstart all live at https://docs.pendle.finance/boros-dev/Backend/sdk.

## License

MIT
