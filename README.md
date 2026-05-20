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

`viem@2.x` is a peer dependency.

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

Full method reference, common flows, escape-hatch (`getOpenApiSdk()`), and the end-to-end bot quickstart all live at https://docs.pendle.finance/boros-dev/Backend/sdk.

## License

MIT
