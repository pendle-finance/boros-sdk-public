/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Coarse classification of the order. `Limit`/`Market` carry a bigint-string `orderId`; `Conditional` carries a `Hex` `orderId` (the on-chain `orderHash`). */
export enum LightEventOrderType {
  Limit = "Limit",
  Market = "Market",
  Conditional = "Conditional",
}

export interface AMMStateResponse {
  totalFloatAmount: string;
  normFixedAmount: string;
  totalLp: string;
  latestFTime: string;
  maturity: string;
  seedTime: string;
  minAbsRate: string;
  maxAbsRate: string;
  cutOffTimestamp: string;
  isCutOffReached: boolean;
  disabled: boolean;
  disabledAt?: number;
  disabledReason?: string;
}

export interface GetAMMStateResponse {
  /** Numeric market identifier (1-based). */
  marketId: number;
  /**
   * Numeric `tokenId` of the collateral asset.
   * @example 1
   */
  tokenId: number;
  /** AMM identifier for this `(marketId, tokenId)` vault. */
  ammId: number;
  /** Raw on-chain AMM contract state, used to combine with the order book. */
  state: AMMStateResponse;
  /** AMM directional bias: `true` = long-biased, `false` = short-biased. */
  isPositive: boolean;
  /**
   * AMM swap fee rate as a bigint string in 18-decimal fixed-point.
   * @example "1000000000000000"
   */
  feeRate: string;
  /**
   * Current AMM implied APR (unitless decimal, `0.085` = 8.5%) derived from `state` and `isPositive`.
   * @example 0.083
   */
  impliedRate: number;
  /** Total LP supply as a bigint string in 18-decimal LP-token units. */
  totalLp: string;
  /** TVL of the AMM as a bigint string in 18-decimal collateral units. */
  totalValue: string;
  /** Hard cap on LP supply (bigint string, 18 decimals). Further LP minting is rejected once `totalLp` reaches this value. */
  totalSupplyCap: string;
  /**
   * Annualised LP yield as a unitless decimal (`0.12` = 12% APY).
   * @example 0.12
   */
  lpApy: number;
  /**
   * Value of 1 LP token denominated in collateral units. Sourced from the latest periodic AMM snapshot — `0` until the first snapshot lands.
   * @example 1.0023
   */
  lpPrice: number;
}

export interface GetAMMStatesResponse {
  /** AMM states in the order of the requested marketIds */
  results: GetAMMStateResponse[];
}

export interface AssetMetadataResponse {
  /**
   * Asset name used in the pro trading interface
   * @example "stETH"
   */
  proSymbol: string;
}

export interface AssetItemResponse {
  /**
   * Internal asset identifier (string). Stable across redeploys; not the same as `tokenId`.
   * @example "ETH"
   */
  id: string;
  /**
   * On-chain ERC-20 contract address (lowercased hex).
   * @example "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
   */
  address: string;
  /**
   * Numeric token identifier used together with `marketId` to pack a `marketAcc` (see [Glossary](https://docs.pendle.finance/boros-dev/Backend/glossary)).
   * @example 2
   */
  tokenId: number;
  /**
   * Human-readable asset name.
   * @example "Wrapped Ether"
   */
  name: string;
  /**
   * On-chain token symbol.
   * @example "WETH"
   */
  symbol: string;
  /**
   * On-chain ERC-20 decimals. Use to scale raw amounts (e.g. `amount` on calldata endpoints) to/from human units.
   * @example 18
   */
  decimals: number;
  /**
   * Latest USD spot price as a decimal string. Updated on the backend every few seconds.
   * @example "3500.25"
   */
  usdPrice: string;
  /** Whether the asset can be used as collateral to back margin positions. */
  isCollateral: boolean;
  /** Display metadata used by the Boros UI. */
  metadata: AssetMetadataResponse;
}

export interface ListAssetsResponse {
  results: AssetItemResponse[];
}

export interface MarketListItemIMDataResponse {
  /**
   * Market name
   * @example "stETH 26DEC2025"
   */
  name: string;
  /**
   * Market symbol
   * @example "stETH-26DEC2025"
   */
  symbol: string;
  /** Whether the market is isolated-only */
  isIsolatedOnly: boolean;
  /**
   * Market maturity as unix timestamp
   * @example 1735689600
   */
  maturity: number;
  /** Tick step used to convert ticks to rates */
  tickStep: number;
  /** Isolated-tick threshold */
  iTickThresh: number;
  /** Margin floor of the market */
  marginFloor: number;
}

export interface LiqSettingsResponse {
  /** Base liquidation incentive factor (bigint string, 18 decimals). See docs: https://docs.pendle.finance/boros-dev/Contracts/CustomTypes#liqsettings */
  base: string;
  /** Slope factor that scales liquidation incentive as health ratio decreases (bigint string, 18 decimals) */
  slope: string;
  /** Liquidation fee rate charged to the liquidated account and collected by protocol treasury (bigint string, 18 decimals) */
  feeRate: string;
}

export interface MarketListItemConfigResponse {
  /**
   * Maximum number of open orders allowed per account on this market
   * @example 80
   */
  maxOpenOrders: number;
  /** @example "0x0000000000000000000000000000000000000000" */
  markRateOracle: string;
  /** @example "0xcd1f910d5b2a8b56805b50a06303feb7831ce08c" */
  fIndexOracle: string;
  /**
   * Hard open interest cap (bigint string) — new position-increasing orders are rejected.
   * @example "20000000000000000000000"
   */
  hardOICap: string;
  /**
   * Taker fee (bigint string, 18 decimals)
   * @example "500000000000000"
   */
  takerFee: string;
  /**
   * OTC trade fee rate (bigint string)
   * @example "500000000000000"
   */
  otcFee: string;
  liqSettings: LiqSettingsResponse;
  /**
   * Initial margin factor (bigint string, 18 decimals). Higher values require more margin.
   * @example "476190476190476190"
   */
  kIM: string;
  /**
   * Maintenance margin factor (bigint string, 18 decimals). Account is liquidated below this threshold.
   * @example "333333333333333333"
   */
  kMM: string;
  /** @example 604800 */
  tThresh: number;
  /**
   * Maximum rate deviation factor in basis points (base 1e4)
   * @example 1500
   */
  maxRateDeviationFactorBase1e4: number;
  /**
   * Closing order bound in basis points (base 1e4)
   * @example 1000
   */
  closingOrderBoundBase1e4: number;
  /**
   * Limit order upper constant bound in basis points (base 1e4)
   * @example 40
   */
  loUpperConstBase1e4: number;
  /**
   * Limit order upper slope bound in basis points (base 1e4)
   * @example 10667
   */
  loUpperSlopeBase1e4: number;
  /**
   * Limit order lower constant bound in basis points (base 1e4)
   * @example -40
   */
  loLowerConstBase1e4: number;
  /**
   * Limit order lower slope bound in basis points (base 1e4)
   * @example 9333
   */
  loLowerSlopeBase1e4: number;
  /**
   * Market status (numeric): `0` = PAUSED (no trading), `1` = CLOSE_ONLY (position-reducing only), `2` = GOOD (normal).
   * @example 2
   */
  status: 0 | 1 | 2;
  /** Whether to use implied rate as the mark rate instead of oracle rate */
  useImpliedAsMarkRate: boolean;
  /**
   * Soft open interest cap — triggers close-only mode when exceeded.
   * @example 9500
   */
  softOICap?: number;
  /** @example 9300 */
  cloLowerThresh?: number;
  /** @example 9500 */
  cloUpperThresh?: number;
}

export interface MarketListItemExtConfigResponse {
  ammAddress?: string;
  /** @example 740 */
  ammId?: number;
  isPositiveAMM?: boolean;
  /** @example "1000000000000000" */
  settleFeeRate: string;
  /** @example 3600 */
  paymentPeriod: number;
  /** @example 900 */
  maxUpdateDelay: number;
}

export interface MarketListItemMetadataResponse {
  /**
   * Underlying asset symbol
   * @example "stETH"
   */
  underlyingSymbol?: string;
  /**
   * Funding rate symbol
   * @example "STETHUSDT"
   */
  fundingRateSymbol?: string;
  /**
   * Maximum leverage of the market
   * @example 20
   */
  maxLeverage: number;
  /**
   * Maximum perp leverage of the market
   * @example 10
   */
  maxPerpLeverage?: number;
  /**
   * Whether the market is UI-whitelisted (i.e. not flagged as a dev/test market)
   * @example true
   */
  isUiWhitelisted: boolean;
}

export interface MarketListItemDataResponse {
  /**
   * 24-hour trading volume in YU (yield units, sum of |trade.size| over the rolling 24h window). Multiply by the collateral asset USD price for approximate USD notional.
   * @example 15000000
   */
  volume24h: number;
  /**
   * Current one-sided notional open interest in YU (yield units; raw on-chain `getOI()` value halved to one side).
   * @example 85000000
   */
  notionalOI: number;
  /**
   * Mark APR (fair value rate). `0.085` = 8.5%
   * @example 0.085
   */
  markApr: number;
  /**
   * APR of the most recent executed trade
   * @example 0.084
   */
  lastTradedApr: number;
  /**
   * Mid-point of best bid and best ask
   * @example 0.0845
   */
  midApr: number;
  /**
   * Best bid APR
   * @example 0.081
   */
  bestBid?: number;
  /**
   * Best ask APR
   * @example 0.088
   */
  bestAsk?: number;
  /**
   * AMM implied APR
   * @example 0.083
   */
  ammImpliedApr?: number;
  /**
   * Current floating/oracle APR
   * @example 0.075
   */
  floatingApr: number;
  /**
   * Long yield APR (mark APR minus floating APR)
   * @example 0.09
   */
  longYieldApr?: number;
  /**
   * Next settlement time (unix seconds)
   * @example 1709164800
   */
  nextSettlementTime?: number;
  /**
   * Seconds remaining until maturity
   * @example 86400
   */
  timeToMaturity?: number;
  /**
   * Current mark price of the underlying asset in USD
   * @example 3500.25
   */
  assetMarkPrice: number;
  /**
   * PnL per 1 YU per 1% rate move (0 when matured)
   * @example 0.0049
   */
  rateSensitivity: number;
  /**
   * Number of remaining settlements until maturity (0 when matured)
   * @example 30
   */
  settlementsToMaturity: number;
  /**
   * 7-day moving average of daily implied-rate range; partial average while calibrating (<7 days); null only when state is new
   * @example 0.0012
   */
  dailyVolatility: number | null;
  /**
   * new: no history; calibrating: <7 days; ready: 7DMA available
   * @example "ready"
   */
  dailyVolatilityState: "new" | "calibrating" | "ready";
}

export interface MarketPlatformResponse {
  /**
   * Platform display name
   * @example "Binance"
   */
  name: string;
  /**
   * Platform identifier
   * @example "Binance"
   */
  platformId: string;
}

export interface MarketListItemResponse {
  /**
   * Numeric market identifier (1-based).
   * @example 1
   */
  marketId: number;
  /** Market contract address */
  address: string;
  /**
   * Collateral token ID for this market
   * @example 1
   */
  tokenId: number;
  imData: MarketListItemIMDataResponse;
  config: MarketListItemConfigResponse;
  extConfig: MarketListItemExtConfigResponse;
  metadata: MarketListItemMetadataResponse;
  data: MarketListItemDataResponse;
  /** Underlying platform metadata */
  platform: MarketPlatformResponse;
}

export interface MarketsSyncStatusResponse {
  /** Latest block number at the time of the query */
  blockNumber: number;
  /** Timestamp of the latest block */
  timestamp: number;
}

export interface ListMarketsResponse {
  results: MarketListItemResponse[];
  /** Resume token for the next page. `null` when no more results. */
  resumeToken?: string | null;
  /** Current sync status */
  syncStatus: MarketsSyncStatusResponse;
}

export interface MarketTradeResponse {
  /**
   * Signed trade notional size in **YU** (yield units). Positive for long (buy), negative for short (sell). Multiply by the collateral asset USD price for approximate USD notional.
   * @example 50000
   */
  size: number;
  /**
   * Executed implied APR as a unitless decimal (`0.085` = 8.5%).
   * @example 0.0845
   */
  rate: number;
  /**
   * Hash of the on-chain transaction that produced this trade.
   * @example "0x1234abcd..."
   */
  txHash: string;
  /**
   * Block timestamp of the trade (Unix seconds). Multiple trades from the same transaction share this value; ordering within a block follows on-chain event order.
   * @example 1709164800
   */
  blockTimestamp: number;
}

export interface MarketTradesV2Response {
  /** Trades ordered newest-first by internal `eventIndex` (strictly monotone, not by `blockTimestamp`). */
  results: MarketTradeResponse[];
  /** Cursor for the next page. Pass back as `resumeToken` to continue. `null` when no more results. */
  resumeToken?: string | null;
}

export interface SideTickResponse {
  /**
   * Implied APR at each aggregated tick level (unitless decimal, `0.085` = 8.5%). For the long side, sorted **descending** (best bid first). For the short side, sorted **ascending** (best ask first). `ia[i]` corresponds 1:1 with `sz[i]`.
   * @example [0.085,0.086,0.087]
   */
  ia: number[];
  /**
   * Total resting notional at the matching `ia[i]` level as a **bigint string** in 18-decimal YU (yield units). Includes AMM contribution at this level when the request used `includeAmm=true`.
   * @example ["1000000000000000000","2000000000000000000","500000000000000000"]
   */
  sz: string[];
}

export interface SyncStatusResponse {
  /** Latest fully processed block number */
  blockNumber: number;
  /** Timestamp of the latest fully processed block */
  timestamp: number;
}

export interface OrderBooksResponse {
  /** Bid side — orders to go long on rates. Best bid first. */
  long: SideTickResponse;
  /** Ask side — orders to go short on rates. Best ask first. */
  short: SideTickResponse;
  /** Current sync status of the order book */
  syncStatus: SyncStatusResponse;
}

export interface OhlcvCandleResponse {
  /**
   * Bucket start (Unix seconds), aligned to `timeFrame`. Candle covers the half-open interval `[ts, ts + timeFrame)`.
   * @example 1709164800
   */
  ts: number;
  /**
   * Open APR value for the candlestick period
   * @example 0.085
   */
  o: number;
  /**
   * Highest APR value during the candlestick period
   * @example 0.092
   */
  h: number;
  /**
   * Lowest APR value during the candlestick period
   * @example 0.078
   */
  l: number;
  /**
   * Close APR value for the candlestick period
   * @example 0.088
   */
  c: number;
  /**
   * Trading volume in YU (yield units, sum of |trade.size| in the bucket) during the candlestick period
   * @example 150000.5
   */
  v: number;
}

export interface OhlcvChartResponse {
  /** Array of OHLCV candlestick data points for the requested market and time range */
  results: OhlcvCandleResponse[];
}

export interface IndicatorsMetadata {
  /** The `select` array as requested by the caller (echoed back). */
  requested: string[];
  /** Subset of `requested` for which the backend actually returned at least one value within the response window. May be smaller than `requested` for newly-launched markets. */
  available: string[];
  /**
   * Earliest Unix-seconds timestamp at which each indicator has data (regardless of the response window). Useful for "no data before X" UI hints.
   * @example {"u":1700000000,"fp":1700003600,"udma":1700604800}
   */
  firstDataTimestamp?: object;
  /**
   * Last bucket (Unix seconds) where underlying rate `u` is sourced from settled on-chain historical data. Buckets after this point use real-time funding rates and may revise once settled.
   * @example 1711152000
   */
  uLastSettledTimestamp?: number;
}

export interface FGIData {
  /**
   * Fear & Greed Index numeric value (`0`..`100`).
   * @example 65
   */
  v: number;
  /**
   * Human-readable classification of `v` (e.g. `"Fear"`, `"Neutral"`, `"Greed"`).
   * @example "Greed"
   */
  vc: string;
}

export interface IndicatorDataPoint {
  /**
   * Bucket start (Unix seconds), aligned to the requested `timeFrame`.
   * @example 1709164800
   */
  ts: number;
  /**
   * Underlying APR (unitless decimal, `0.085` = 8.5%).
   * @example 0.075
   */
  u?: number;
  /**
   * Future premium (mark APR minus underlying APR), unitless decimal.
   * @example 0.01
   */
  fp?: number;
  /** Fear & Greed Index snapshot for this bucket. */
  fgi?: FGIData;
  /**
   * Underlying-rate moving averages keyed by period (in days). Only the periods requested via `udma:<periods>` appear; values are unitless decimals.
   * @example {"7":0.14,"30":0.13}
   */
  udma?: object;
  /**
   * Underlying asset spot price (USD).
   * @example 3500.25
   */
  ap?: number;
}

export interface IndicatorsResponse {
  /** Response metadata */
  metadata: IndicatorsMetadata;
  /** Indicator data points */
  results: IndicatorDataPoint[];
}

export interface EncodeMarketAccResponse {
  /**
   * Fully-packed 54-character `marketAcc` (`0x` + 26 bytes). Layout: `root` (20B) · `accountId` (1B) · `tokenId` (2B) · `marketId` (3B). The `marketId` segment is `0xFFFFFF` for a **cross** account, or the actual `marketId` for an **isolated** account.
   * @example "0xabcdef0123456789abcdef0123456789abcdef01000001ffffff"
   */
  marketAcc: string;
}

export interface DecodeMarketAccResponse {
  /** User wallet address — the `root` of the margin account. */
  root: string;
  /** Sub-account index under `root` (0–255). `0` is the main sub-account. */
  accountId: number;
  /** Numeric `tokenId` of the collateral asset. */
  tokenId: number;
  /** Market identifier. Decimal equivalent of `0xFFFFFF` (16777215) signals the cross account; any other value is an isolated-market id. */
  marketId: number;
  /** Convenience flag — `true` when `marketId === 0xFFFFFF` (cross account), `false` when isolated. */
  isCross: boolean;
}

export interface LimitOrderMetadataResponse {
  /**
   * `true` if at least one fill executed at a strictly better rate than the order's limit (rate improvement).
   * @example true
   */
  isRateImproved: boolean;
  /**
   * Set only for conditional / stop orders — `true` if the order was placed with the intent to close an existing position (TP/SL). Undefined for plain limit orders.
   * @example false
   */
  isClosePosition?: boolean;
}

export interface LimitOrderResponseV2 {
  /** Side { LONG : 0, SHORT : 1 } */
  side: 0 | 1;
  /** Original notional size at placement (18-decimal bigint string). */
  placedSize: string;
  /** Remaining unfilled notional size (18-decimal bigint string). Always 0 for filled, cancelled, or expired orders. */
  unfilledSize: string;
  /**
   * Fixed APR derived from `tick` (decimal, e.g. `0.05` = 5%). **Deprecated** — convert `tick` yourself for full precision.
   * @deprecated
   * @example 0.05
   */
  impliedApr: number;
  /** Integer tick on the discrete rate ladder. `rate = 1.00005^(tick × tickStep) - 1` where `tickStep` is per-market. See [glossary](https://docs.pendle.finance/boros-dev/Backend/glossary#tick). */
  tick: number;
  /** Initial margin currently locked behind the unfilled portion of this order, with leverage applied (18-decimal bigint string). 0 once the order is no longer active. */
  marginRequired: string;
  orderId: string;
  root: string;
  marketId: number;
  accountId: number;
  /** Whether the order uses cross-margin mode */
  isCross: boolean;
  /** Lifecycle status. { Cancelled : 1, FullyFilled : 2, Expired : 3, Purged : 4, Filling : 0, Pending : 5, Executing : 6, Retrying : 7, Failed : 8 } */
  status: 1 | 2 | 3 | 4 | 0 | 5 | 6 | 7 | 8;
  /** Order kind (LIMIT / MARKET / TP / SL). Time-In-Force is a separate concept set at order placement. { LIMIT : 0, MARKET : 1, TAKE_PROFIT_MARKET : 2, STOP_LOSS_MARKET : 3 } */
  orderType: 0 | 1 | 2 | 3;
  /** Block timestamp of the **last** order update in **Unix seconds (UTC)**. */
  blockTimestamp: number;
  /** Composite cursor of the **last update** to this order — packs block number and intra-block log index. Used as the cursor by `/v1/accounts/orders`. Mutates whenever the order is filled, cancelled, etc. */
  eventIndex: number;
  /** Composite cursor of the **placement** event — immutable. Used as the cursor by `/v1/accounts/orders-by-placed-time`. */
  placedEventIndex: number;
  /** Block timestamp of the placement event in **Unix seconds (UTC)**. */
  placedTimestamp: number;
  /** Transaction hash of the original placement event */
  placedTxHash: string;
  /**
   * Order owner `marketAcc` (54-char hex). Cross orders embed `0xFFFFFF`; isolated orders embed the actual `marketId`. Decode via `/v1/market-acc/decode`.
   * @example "0x9dcf85824e024fea9e3ef583dccbea68edbc37b8000002ffffff"
   */
  marketAcc: string;
  metadata?: LimitOrderMetadataResponse;
}

export interface OrdersByTxHashResponse {
  results: LimitOrderResponseV2[];
}

export interface DepositBodyDto {
  /** Target account identifier (54-char hex). Packs `root + accountId + tokenId + marketId`, where `root` is the user wallet address. For a cross deposit, the embedded `marketId` segment is `0xFFFFFF`; for an isolated deposit, it is the actual market id. See [Glossary](https://docs.pendle.finance/boros-dev/Backend/glossary). */
  marketAcc: string;
  /** BigInt string of the deposit amount, **in the depositing token's native decimals** (e.g. `"1000000"` is `1 USDC` for a 6-decimals token). Use `/open-api-v2/v1/assets` to look up each token's `decimals`. */
  amount: string;
}

export interface CalldataBuilderUserResponse {
  /**
   * ABI-encoded transaction calldata to be included in the transaction data field.
   * @example "0xa9059cbb000000000000000000000000..."
   */
  calldata: string;
  /** The sender address that should sign and submit this transaction (echoes the request's user address). */
  from: string;
  /** The target contract address to send this transaction to. */
  to: string;
  /** Estimated gas limit for the transaction as a decimal string. Omitted if the backend could not estimate gas (e.g. the user has not yet granted the ERC20 allowance the tx needs); clients should re-estimate in that case. */
  gas?: string;
}

export interface RequestWithdrawalBodyDto {
  /** Withdrawer wallet address (42-char hex). Aliased as `root` elsewhere in the API — this is the user's wallet. */
  root: string;
  /**
   * Collateral token ID to withdraw.
   * @min 1
   */
  tokenId: number;
  /** BigInt string of the requested withdrawal amount, **in the withdrawing token's native decimals** (e.g. `"1000000"` is `1 USDC` for a 6-decimals token). Look up `decimals` from `/open-api-v2/v1/assets`. Withdrawals are only ever made from the **cross** account — isolated balances must be moved via `cash-transfer` first. */
  amount: string;
}

export interface CancelWithdrawalBodyDto {
  /** Withdrawer wallet address (42-char hex) — the `root`. */
  root: string;
  /**
   * Token ID whose pending withdrawal request should be cancelled.
   * @min 1
   */
  tokenId: number;
}

export interface ApproveAgentBodyDto {
  /** User wallet address (42-char hex). This is the `root` of the margin account being delegated. */
  root: string;
  /**
   * Sub-account index (0-255) whose trading the agent may sign for. Defaults to 0 (the main account).
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /** Address the agent will sign from. */
  agentAddress: string;
  /**
   * Unix seconds — approval auto-expires at this time. Must be in the future.
   * @example 1735689600
   */
  expiry: number;
}

export interface RevokeAgentBodyDto {
  /** User wallet address (42-char hex) — the `root`. */
  root: string;
  /**
   * Sub-account index (0-255). Defaults to 0 (the main account).
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /** Address of the agent whose approval is being revoked. */
  agentAddress: string;
}

export interface VaultPayTreasuryBodyDto {
  /** User (or vault) wallet address (42-char hex) — the `root`. */
  root: string;
  /**
   * Collateral token ID.
   * @min 1
   */
  tokenId: number;
  /** BigInt string of the treasury payment amount, **in the paying token's native decimals** (e.g. `"1000000"` is `1 USDC` for a 6-decimals token). Look up `decimals` from `/open-api-v2/v1/assets`. */
  amount: string;
}

export interface PlaceOrderSimpleBodyDto {
  /** Fully-packed 54-character `marketAcc` (`0x` + 26 bytes). Layout: `root` (20B) · `accountId` (1B) · `tokenId` (2B) · `marketId` (3B). The `marketId` segment is `0xFFFFFF` for a **cross** account, or the actual `marketId` for an **isolated** account. */
  marketAcc: string;
  /**
   * Market ID. Must match the `marketId` segment of `marketAcc` (or equal `0xFFFFFF` for cross).
   * @min 1
   */
  marketId: number;
  /** Order side. `0` = LONG, `1` = SHORT. */
  side: 0 | 1;
  /** BigInt string of the notional size, scaled by 10^18. */
  size: string;
  /** Time-in-force (numeric). `0` = GTC, `1` = IOC, `2` = FOK, `3` = ALO, `4` = SOFT_ALO. `GTC` / `ALO` / `SOFT_ALO` → limit (rests unmatched remainder); `IOC` / `FOK` → market (no resting). */
  tif: 0 | 1 | 2 | 3 | 4;
  /** Human-readable rate (e.g. `0.085` = 8.5%). Required for `GTC` / `ALO` / `SOFT_ALO` and for `IOC`; optional only for `FOK` (then matches at the side's extreme tick). Backend rounds to the nearest tick: LONG rounds **down**, SHORT rounds **up** (always safer for the user). */
  rate?: number;
  /** Relative tolerance from current mid-rate (e.g. `0.005` = 0.5%). Backend computes the execution guard as `desiredRate = midRate ± slippage`. For limit orders this is a safety net; for `FOK` market orders it is strongly recommended. */
  slippage?: number;
  /**
   * AMM routing. `0` → orderbook-only (disables AMM matching); a specific AMM id → also route through that AMM. Optional — if omitted, the builder uses the market's active `ammId` from `/v1/markets`.
   * @min 0
   */
  ammId?: number;
  /**
   * Optional. Order id of an existing resting order to atomically cancel before this order is matched. See POST /place-orders for the full semantics.
   * @example "12345"
   */
  preCancelOrderId?: string;
}

export interface PlaceOrderResolved {
  /** Order side (numeric): `0` = LONG, `1` = SHORT. Makes the tick-rounding direction explicit. */
  side: 0 | 1;
  /** Tick actually encoded into the calldata. `null` for unguarded `FOK` market orders. */
  limitTick: number | null;
  /** Rate corresponding to `limitTick`. May differ from `requestedRate` by a few bp due to tick snapping. `null` when `limitTick` is `null`. */
  actualRate: number | null;
  /** Only present when the client sent `rate` instead of `limitTick` — echoes the requested rate. */
  requestedRate?: number;
  /** Only present when the client sent `desiredRate` / `slippage` (or the backend auto-set one). Mirrors what the contract will use as the execution ceiling. */
  desiredRate?: number;
}

export interface PlaceOrderCall {
  /** ABI-encoded calldata for the agent to execute on the target contract. */
  calldata: string;
  /** The account ID this calldata targets. The agent uses this to route the call to the correct margin account. */
  accountId: number;
  /** Present for every entry that accepts user-friendly alternatives (`rate`/`slippage`). Echoes what the backend actually encoded so the UI can show the user before they sign. */
  resolved?: PlaceOrderResolved;
}

export interface PlaceOrdersResponse {
  /** One entry per order in the request. Submit them via `POST /agent/send-transactions`. */
  calls: PlaceOrderCall[];
}

export interface PlaceSingleOrderBodyDto {
  /** Fully-packed 54-character `marketAcc` (`0x` + 26 bytes). Layout: `root` (20B) · `accountId` (1B) · `tokenId` (2B) · `marketId` (3B). The `marketId` segment is `0xFFFFFF` for a **cross** account, or the actual `marketId` for an **isolated** account. */
  marketAcc: string;
  /**
   * Market ID. Must match the `marketId` segment of `marketAcc` (or equal `0xFFFFFF` for cross).
   * @min 1
   */
  marketId: number;
  /** Order side. `0` = LONG, `1` = SHORT. */
  side: 0 | 1;
  /** BigInt string of the notional size, scaled by 10^18. */
  size: string;
  /** Time-in-force (numeric). `0` = GTC, `1` = IOC, `2` = FOK, `3` = ALO, `4` = SOFT_ALO. `GTC` / `ALO` / `SOFT_ALO` → resting limit; `IOC` and `FOK` do not rest. `GTC` / `ALO` / `SOFT_ALO` and `IOC` require one of `rate` / `limitTick`; only `FOK` may omit both (then matches at the side's extreme tick). */
  tif: 0 | 1 | 2 | 3 | 4;
  /**
   * Raw contract tick index (market-specific `tickStep`). Mutually exclusive with `rate`. For `GTC` / `ALO` / `SOFT_ALO` and `IOC`, one of `limitTick` / `rate` is required; for `FOK` both are optional (acts as a per-tick guard if set, otherwise the contract uses the side's extreme tick). See [Order Book mechanics](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook) for tick ↔ rate conversion.
   * @min -32768
   * @max 32767
   */
  limitTick?: number;
  /** Human-readable rate (e.g. `0.085` = 8.5%). Backend converts to the nearest tick: LONG rounds **down**, SHORT rounds **up** (always safer for the user). Mutually exclusive with `limitTick`. */
  rate?: number;
  /**
   * Absolute average-execution ceiling. The contract reverts with `TradeUndesiredRate` if `signedCost > signedSize * desiredRate`. Mutually exclusive with `slippage` — exactly one of the two must be supplied.
   * @min -1000
   * @max 1000
   */
  desiredRate?: number;
  /** Relative tolerance from current mid-rate (e.g. `0.005` = 0.5%). Backend computes `desiredRate = midRate ± slippage`. Mutually exclusive with `desiredRate` — exactly one of the two must be supplied. */
  slippage?: number;
  /**
   * AMM routing. `0` → orderbook-only (disables AMM matching); a specific AMM id → also route through that AMM. Optional — if omitted, the builder uses the market's active `ammId` from `/v1/markets`.
   * @min 0
   */
  ammId?: number;
  /**
   * Optional. Order id of an existing resting order to **atomically cancel before this order is matched/placed**. Runs as Phase 2 of the contract's place-and-match sequence, so the two actions land in a single transaction with no race window.
   *
   * **Strict mode only.** The entire transaction reverts if the cancel cannot be honored (unknown / already cancelled / already filled). Intended for "cancel-this-specific-resting-order-and-place-a-replacement" flows.
   * @example "12345"
   */
  preCancelOrderId?: string;
}

export interface BulkOrdersCancelDataDto {
  /** Order ids to cancel as BigInt strings. Ignored when `isAll` is `true`. */
  ids: string[];
  /** If `true`, cancel every resting order on this market for this account; `ids` is ignored. */
  isAll: boolean;
  /** If `true`, the **entire `bulkOrders` transaction reverts** when any cancel id cannot be honored (unknown / already cancelled / already filled). If `false`, unhonorable ids are skipped silently and the placement still proceeds. Use `true` for cancel-and-replace flows where placing without the cancel would be unsafe. */
  isStrict: boolean;
}

export interface BulkOrdersLongShortDataDto {
  /** BigInt strings of notional sizes, scaled by 10^18. One per sub-order. */
  sizes: string[];
  /** Raw contract tick indices (signed int16), one per sub-order. Must be the same length as `sizes`. See [Order Book mechanics](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook) for tick ↔ rate conversion. */
  limitTicks: number[];
  /** Time-in-force shared by every sub-order in this entry. `0` = GTC, `1` = IOC, `2` = FOK, `3` = ALO, `4` = SOFT_ALO. */
  tif: 0 | 1 | 2 | 3 | 4;
  /** Order side shared by every sub-order. `0` = LONG, `1` = SHORT. */
  side: 0 | 1;
}

export interface PlaceBulkOrdersEntryDto {
  /**
   * Market ID this entry targets.
   * @min 1
   */
  marketId: number;
  /** Resting orders to cancel **atomically before this entry is matched**, in the same on-chain `bulkOrders` call. Pass `{ ids: [], isAll: false, isStrict: false }` for the no-op case (place without cancelling). Use `isAll: true` to wipe the book for this `(marketAcc, marketId)` before placing. Set `isStrict: true` to make the entire transaction revert if any id cannot be honored. */
  cancelData: BulkOrdersCancelDataDto;
  /** Sub-orders to place on this market (shared `side`/`tif`, per-order `size`/`limitTick`). */
  orders: BulkOrdersLongShortDataDto;
  /**
   * Absolute average-execution ceiling. The contract reverts with `TradeUndesiredRate` if `signedCost > signedSize * desiredRate`. Mutually exclusive with `slippage` — exactly one of the two must be supplied.
   * @min -1000
   * @max 1000
   */
  desiredRate?: number;
  /** Relative tolerance from this market's current mid-rate (e.g. `0.005` = 0.5%). Backend computes `desiredRate = midRate ± slippage`. Mutually exclusive with `desiredRate` — exactly one of the two must be supplied. */
  slippage?: number;
}

export interface PlaceBulkOrdersDto {
  /**
   * Sub-account index (0-255) all entries execute under. Defaults to 0 (main account).
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /** `true` → all `bulks[]` execute against the user's **cross** account for the relevant `(root, accountId, tokenId)`. `false` → execute against the **isolated** account on each entry's `marketId`. Mixing cross + isolated within a single `bulkOrders` call is not supported — split into two `orderRequests[]` entries instead. */
  cross: boolean;
  /** Per-market entries packed into a single on-chain `bulkOrders` call. */
  bulks: PlaceBulkOrdersEntryDto[];
}

export interface OrderRequestDto {
  /** Single-order entry. Mutually exclusive with `bulkOrders`. */
  singleOrder?: PlaceSingleOrderBodyDto;
  /** Multi-market `bulkOrders` entry. Mutually exclusive with `singleOrder`. */
  bulkOrders?: PlaceBulkOrdersDto;
}

export interface PlaceOrdersBodyDto {
  /**
   * **Advanced / liquidity-provisioning** batch. Each entry is either a `singleOrder` (one `placeSingleOrder` call) or a `bulkOrders` (one `bulkOrders` multicall covering many per-market sub-orders). The backend emits one on-chain call per entry, preserving request order.
   *
   * Built for **market-making / liquidity-provisioning flows** that need to place many resting orders across tick levels and/or markets at once — not for the common single-order UI case (use `POST /place-order` for that).
   *
   * **Constraints.** All entries must execute under the same `(root, accountId)` — one agent signature covers the whole multicall. Each `singleOrder` and each `bulkOrders.bulks[i]` must supply exactly one of `desiredRate` / `slippage`.
   */
  orderRequests: OrderRequestDto[];
}

export interface CancelOrdersMarketDto {
  /** Market account identifier (54-char hex). All entries in one request should unpack to the same `(root, accountId)` — the agent submits one signature for all of them. */
  marketAcc: string;
  /**
   * Market ID. Must match the `marketId` segment of `marketAcc` (or equal `0xFFFFFF` for cross).
   * @min 1
   */
  marketId: number;
  /** If `true`, cancel every resting order in this market for this account; `orderIds` is ignored. */
  cancelAll: boolean;
  /** Specific order ids to cancel. Required when `cancelAll: false`. Cancels are best-effort at the entry level: an id already filled or cancelled is skipped without reverting the other entries. */
  orderIds?: string[];
}

export interface CancelOrdersBodyDto {
  /** Per-market cancel requests. One on-chain `bulkCancels` call per entry. */
  markets: CancelOrdersMarketDto[];
}

export interface AgentCall {
  /** ABI-encoded calldata for the agent to execute on the target contract. */
  calldata: string;
  /** The account ID this calldata targets. */
  accountId: number;
}

export interface AgentCalldataResponse {
  /** One entry per on-chain call this request produces. Submit them via `POST /agent/send-transactions`. */
  calls: AgentCall[];
}

export interface CashTransferBodyDto {
  /**
   * Sub-account index (0-255) performing the transfer. Defaults to 0 — i.e. the user's main account.
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /**
   * Market ID of the **isolated** leg. The corresponding cross leg is implied — there is exactly one cross account per `(root, accountId, tokenId)` pair, derived from the market's `tokenId`.
   * @min 1
   */
  marketId: number;
  /** `CROSS_TO_ISOLATED` — cash moves from the cross account into the isolated market. `ISOLATED_TO_CROSS` — reverse. */
  direction: "CROSS_TO_ISOLATED" | "ISOLATED_TO_CROSS";
  /** BigInt string of the transfer amount, scaled by 10^18. Always positive — direction is explicit via `direction`. */
  amount: string;
}

export interface EnterExitMarketsBodyDto {
  /**
   * Sub-account index (0-255) this enter/exit targets. Backend echoes it into `executeParams[].accountId`. Defaults to 0.
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /**
   * Which account enters/exits. `true` → the user's **cross** account (default; can target multiple markets in one call). `false` → the user's **isolated** account; send exactly one `marketId` — an isolated account is pinned to a single market.
   * @default true
   */
  isCross?: boolean;
  /** Market IDs to enter or exit. With `isCross: false` the array must have length 1 (isolated accounts are pinned to a single market). */
  marketIds: number[];
}

export interface PayTreasuryBodyDto {
  /**
   * Sub-account index (0-255) paying the treasury fee. Defaults to 0.
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /** Which account pays the fee. `true` → deduct from the user's **cross** account. `false` → deduct from the user's **isolated** account on this market. */
  isCross: boolean;
  /**
   * Market ID whose treasury receives the payment. Fees accrue per-market; this identifies which market's treasury is being settled.
   * @min 1
   */
  marketId: number;
  /** BigInt string of the treasury payment amount, **in the paying token's native decimals** (e.g. `"1000000"` is `1 USDC` for a 6-decimals token). Look up `decimals` from `/open-api-v2/v1/assets`. After the tx executes on-chain, the backend credits the equivalent USD value to the user's **off-chain gas budget** that funds subsequent agent-signed transactions. */
  amount: string;
}

export interface AddLiquidityToAmmAgentBodyDto {
  /**
   * Market ID of the AMM pool to deposit cash into.
   * @min 1
   */
  marketId: number;
  /** BigInt string of net cash to add as single-sided liquidity. */
  netCashIn: string;
  /** BigInt string of minimum LP tokens to receive. */
  minLpOut: string;
}

export interface AgentExecuteParams {
  /**
   * ABI-encoded calldata for the agent to execute on the target contract
   * @example "0xa9059cbb000000000000000000000000..."
   */
  calldata: string;
  /** The account ID that this calldata should be executed against. The agent uses this to route the call to the correct margin account. */
  accountId: number;
}

export interface BulkAgentExecuteParamsResponseV2 {
  executeParams: AgentExecuteParams[];
}

export interface RemoveLiquidityFromAmmAgentBodyDto {
  /**
   * Market ID of the AMM pool to burn LP tokens from.
   * @min 1
   */
  marketId: number;
  /** BigInt string of LP tokens to burn. */
  lpToRemove: string;
  /** BigInt string of minimum cash to receive. */
  minCashOut: string;
}

export interface FundingRateSymbolResponse {
  /**
   * Venue-specific instrument identifier (the symbol as listed by the source exchange).
   * @example "BTCUSDT"
   */
  fundingRateSymbol: string;
  /**
   * Canonical asset symbol (venue-agnostic).
   * @example "BTC"
   */
  assetSymbol: string;
  /**
   * Source venue this funding rate is sourced from.
   * @example "binance"
   */
  exchange: string;
}

export interface FundingRateSymbolListResponse {
  fundingRateSymbols: FundingRateSymbolResponse[];
}

export interface GetSettlementSummaryByMarketQueryDto {
  /** Filter to a specific subset of markets (max 100). Omit to query all whitelisted markets — keep in mind this scales the CU cost linearly. */
  marketIds?: number[];
  /**
   * Inclusive lower bound of the settlement period (Unix seconds, UTC). Compared against `periodTimestamp` (the period start, aligned to the market's configured `settlementInterval` — e.g. 1h / 2h / 8h), not block time.
   * @example 1735689600
   */
  fromTimestamp: number;
  /**
   * Inclusive upper bound of the settlement period (Unix seconds, UTC).
   * @example 1735776000
   */
  toTimestamp: number;
}

export interface SettlementMarketSummaryResponse {
  marketId: number;
  /** @example "BTCUSDT" */
  marketName: string;
  /**
   * Source funding rate symbol the market settles against (see `/v1/funding-rate/all-funding-rate-symbols`).
   * @example "BTCUSDT"
   */
  fundingRateSymbol: string;
  /** Start of the settlement period (Unix seconds, UTC). Period length matches the market's configured `settlementInterval` (e.g. 1h / 2h / 8h); the period covers `[periodTimestamp, periodTimestamp + settlementInterval)`. */
  periodTimestamp: number;
  /** Composite ordering key for the settlement event: `blockNumber * 1_000_000 + logIndex`. Stable, unique, monotonic across events. */
  eventIndex: number;
  /** Unix seconds when the settlement was emitted on-chain. Usually equals `periodTimestamp` plus a small lag from the keeper that triggers the settlement. */
  blockTimestamp: number;
  /**
   * Realized funding rate for the period, expressed as an annualized rate (1.0 = 100% APR). Multiply by `settlementInterval / SECONDS_PER_YEAR` (per-market — e.g. `1/8760` only for 1h markets, `2/8760` for 2h, `8/8760` for 8h) to convert back to the per-period funding rate.
   * @example 0.085
   */
  settlementApr: number;
  /**
   * Total settlement-fee revenue collected in this period, denominated in the market collateral token.
   * @example 125.5
   */
  totalFee: number;
  /**
   * One-sided open interest (notional, in YU) that participated in this settlement. Returned as the absolute long-side notional (`raw_notional / 2`), so it equals long OI = short OI for the period.
   * @example 500000
   */
  totalNotionalSize: number;
  /**
   * Net settled value transferred from one side to the other this period, denominated in the market collateral token. Already halved (`raw / 2`) to express the magnitude transferred (positive number).
   * @example 1250.75
   */
  totalSettledValue: number;
}

export interface SettlementMarketSummaryListResponse {
  settlementMarketSummaries: SettlementMarketSummaryResponse[];
}

export interface LiquidateMarketAccPositionResponse {
  /** Fully-packed 54-character `marketAcc` (`0x` + 26 bytes). Layout: `root` (20B) · `accountId` (1B) · `tokenId` (2B) · `marketId` (3B). The `marketId` segment is `0xFFFFFF` for a **cross** account, or the actual `marketId` for an **isolated** account. */
  marketAcc: string;
  /**
   * Weighted-average implied APR of the position **before** the liquidation trade (1.0 = 100%).
   * @example 0.085
   */
  prevPositionRate: number;
  /**
   * Signed notional size of the position **before** liquidation (positive = long YU, negative = short YU).
   * @example 50000
   */
  prevPositionSize: number;
  /**
   * Weighted-average implied APR of the position **after** liquidation (1.0 = 100%).
   * @example 0.082
   */
  postPositionRate: number;
  /**
   * Signed notional size of the position **after** liquidation.
   * @example 25000
   */
  postPositionSize: number;
}

export interface LiquidationEventResponse {
  marketId: number;
  /** The block number when the liquidation occurred */
  blockNumber: number;
  /** Block timestamp of the liquidation (Unix seconds, UTC). */
  timestamp: number;
  txHash: string;
  /**
   * Notional size of the liquidation trade (in YU). **Signed int128** as parsed from the on-chain trade payload — sign indicates the trade direction; magnitude is the absolute notional.
   * @example 50000
   */
  size: number;
  /**
   * Mark implied APR of the market at the moment of liquidation (1.0 = 100%).
   * @example 0.085
   */
  rate: number;
  /**
   * Implied APR at which the liquidation trade actually executed (typically off-mark to incentivize the liquidator).
   * @example 0.083
   */
  tradeRate: number;
  /** Position snapshot of the **violator** (the liquidated account) — pre and post the liquidation trade. */
  violator: LiquidateMarketAccPositionResponse;
  /** Position snapshot of the **liquidator** account that absorbed the position. */
  liquidator: LiquidateMarketAccPositionResponse;
}

export interface LiquidationEventListResponse {
  liquidationEvents: LiquidationEventResponse[];
}

export interface OnChainEventItem {
  /** Event name */
  eventName: string;
  /** Stable unique event id, formatted as `<blockHash>-<logIndex>`. */
  id: string;
  /** Source contract address */
  sourceAddress: string;
  /** Block number */
  blockNumber: number;
  /** Position of the log within its transaction receipt. */
  logIndex: number;
  /** Transaction hash */
  txHash: string;
  /** Block hash */
  blockHash: string;
  /** Block timestamp (Unix seconds, UTC). */
  blockTimestamp: number;
  /** Composite ordering key: `blockNumber * 1_000_000 + logIndex`. Use this as the sort/cursor field — it is monotonic across the chain. */
  eventIndex: number;
  /** True once the block containing the event has been finalized by the consensus layer. Pre-finalization events can in principle be reorged out. */
  isFinalized?: boolean;
  /** Decoded event-specific fields. Shape depends on `eventName` — e.g. for `LimitOrderFilled` this carries `marketAcc`, `orderId`, `size`, `cost`, etc. Refer to the contract ABI for the exact payload of each event type. */
  data?: object;
}

export interface OnChainEventsResponse {
  /** Events matching the query, sorted by `eventIndex` descending (newest first). */
  events: OnChainEventItem[];
  /** Cursor for the next page. Pass back as `resumeToken` to continue paginating. **`null`** when the current page is the last one. */
  resumeToken?: string;
}

export interface DepositSimulationBodyDto {
  /** Target account identifier (54-char hex). Packs `root + accountId + tokenId + marketId`. For a cross deposit, the embedded `marketId` segment is `0xFFFFFF`; for an isolated deposit, it is the actual market id. Shares the same `marketAcc` + `amount` shape as `POST /calldata-builder/user/deposit`. */
  marketAcc: string;
  /** BigInt string of the deposit amount, **in the depositing token's native decimals** — same unit the calldata endpoint expects (e.g. `"1000000"` for 1 USDC at 6 decimals). Look up `decimals` from `/open-api-v2/v1/assets`. */
  amount: string;
}

export interface DepositStateResponse {
  /** Bigint string representing the collateral balance of the account */
  collateralBalance: string;
  /** Bigint string representing the maintenance margin requirement */
  maintenanceMargin: string;
  /**
   * Margin ratio of the account (collateral / maintenance margin)
   * @example 2.5
   */
  marginRatio: number;
}

export interface DepositSimulationResponse {
  /** Bigint string representing the minimum amount of collateral received after deposit */
  minReceived: string;
  /** Snapshot of the destination `marketAcc` **before** the deposit lands — current `collateralBalance` (totalCash + Σ positionValue), aggregate `maintenanceMargin`, and resulting `marginRatio = collateralBalance / maintenanceMargin`. */
  preUserState: DepositStateResponse;
  /** Projected snapshot **after** crediting `minReceived` cash. Maintenance margin is unchanged (deposits do not open positions); the new `marginRatio` reflects the higher collateral. Use the delta vs `preUserState` to confirm liquidation headroom. */
  postUserState: DepositStateResponse;
}

export interface RequestWithdrawalSimulationBodyDto {
  /** Withdrawer wallet address (42-char hex). Aliased as `root` — the user wallet that owns the cross account. Simulation always assumes `accountId = 0` (the main sub-account). */
  root: string;
  /**
   * Collateral token ID to withdraw — the token whose cross balance is being drained. Use `/open-api-v2/v1/assets` to look up `tokenId`.
   * @min 1
   */
  tokenId: number;
  /** BigInt string of the requested withdrawal amount, scaled by **10^18 (cash accounting unit)** — *not* the token's native decimals. This differs from the corresponding `POST /calldata-builder/user/request-withdrawal` body, which expects native decimals; the simulation operates directly on the 18-decimal `collateralBalance` returned in the response. Only the cross account is debited — move funds from isolated to cross via `cash-transfer` first. */
  amount: string;
}

export interface WithdrawStateResponse {
  /** Bigint string representing the collateral balance of the account */
  collateralBalance: string;
  /**
   * Margin ratio = `totalMaintenanceMargin / collateralBalance`. The account is liquidatable when this reaches **1.0**; safer accounts trend toward 0. Returns **0** when `collateralBalance` is 0 (no positions or fully empty), not Infinity.
   * @example 0.4
   */
  marginRatio: number;
}

export interface WithdrawSimulationResponse {
  /** Snapshot of the user's **cross** `marketAcc` (the only acc allowed to withdraw) before the requested amount leaves. `collateralBalance` is `totalCash + Σ positionValue`; see `marginRatio` for the health metric. */
  preUserState: WithdrawStateResponse;
  /** Projected snapshot **after** the withdrawal. `collateralBalance` drops by the requested amount (already 18-dec scaled); `marginRatio` **rises** accordingly (denominator shrinks while `totalMaintenanceMargin` is unchanged). Compare to `preUserState` to confirm the account stays below the liquidation threshold of `1.0`. */
  postUserState: WithdrawStateResponse;
}

export interface CashTransferSimulationBodyDto {
  /** User wallet address — the `root` of the margin account. Supplies the user context the agent-signed calldata endpoint gets from its signature. */
  root: string;
  /**
   * Sub-account index under `root` (0–255). `0` is the main sub-account.
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /**
   * Market ID of the **isolated** leg. Matches `POST /calldata-builder/agent/cash-transfer` — the corresponding cross leg is derived from the market's `tokenId`.
   * @min 1
   */
  marketId: number;
  /** Transfer direction: `CROSS_TO_ISOLATED` or `ISOLATED_TO_CROSS`. */
  direction: "CROSS_TO_ISOLATED" | "ISOLATED_TO_CROSS";
  /** BigInt string of the transfer amount (always positive), scaled by 10^18 (cash accounting unit — same as the calldata endpoint). */
  amount: string;
}

export interface CashTransferStateResponse {
  /** Bigint string representing the collateral balance of the account */
  collateralBalance: string;
  /** Bigint string representing the maintenance margin requirement */
  maintenanceMargin: string;
  /**
   * Margin ratio = `maintenanceMargin / collateralBalance`. Liquidatable at **1.0**; safer accounts trend toward 0. Returns **0** when `collateralBalance` is 0.
   * @example 0.4
   */
  marginRatio: number;
}

export interface CashTransferPrePostSimulationResponse {
  /** Snapshot of this side of the transfer **before** the cash moves — `collateralBalance` (totalCash + Σ positionValue), aggregate `maintenanceMargin`, and `marginRatio = maintenanceMargin / collateralBalance`. */
  preUserState: CashTransferStateResponse;
  /** Projected snapshot **after** the transfer settles. Cross side decreases / increases by `amount` depending on `direction`; the isolated side moves by the opposite sign. `maintenanceMargin` is unchanged (cash moves do not open or close positions); `marginRatio` shifts because `collateralBalance` changed. */
  postUserState: CashTransferStateResponse;
}

export interface CashTransferSimulationResponseV2 {
  /** Pre/post state of the cross-margin account during the cash transfer */
  crossAccState: CashTransferPrePostSimulationResponse;
  /** Pre/post state of the isolated-margin account during the cash transfer */
  isolatedAccState: CashTransferPrePostSimulationResponse;
}

export interface PlaceOrderSimulationBodyDto {
  /** Market account identifier (54-char hex). Packs `root + accountId + tokenId + marketId`. Identifies which sub-account / token / market is placing the order. The simulator does **not** require the account to have already entered the market — entrance is simulated as part of the call. */
  marketAcc: string;
  /**
   * Market ID. Must match the `marketId` segment encoded in `marketAcc` (validated server-side).
   * @min 1
   */
  marketId: number;
  /** Order side. `0` = LONG (buy yield), `1` = SHORT (sell yield). */
  side: 0 | 1;
  /** BigInt string of the notional size (always positive), scaled by 10^18. Validated against the market's minimum order value — orders below the floor are rejected with `INVALID_INPUT`. */
  size: string;
  /** Time-in-force (numeric). `0` = GTC (resting limit), `1` = IOC, `2` = FOK, `3` = ALO (post-only), `4` = SOFT_ALO. `FOK` / `IOC` are market-style orders that simulate immediate matching; `GTC` / `ALO` / `SOFT_ALO` are limit orders that simulate resting the unmatched remainder on the book. See [Order book mechanics](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook). */
  tif: 0 | 1 | 2 | 3 | 4;
  /** Human-readable rate (e.g. `0.085` = 8.5% APR). **Required** for resting-limit `tif` (`GTC` / `ALO` / `SOFT_ALO`); optional for `IOC` and `FOK` (when omitted, the simulator falls back to the side's extreme tick). Backend rounds to the nearest tick: LONG rounds **down**, SHORT rounds **up** (always safer for the user). The post-rounding tick and rate are echoed back in `resolved.limitTick` / `resolved.actualRate`. */
  rate?: number;
  /** Relative tolerance from the current mid-rate (e.g. `0.005` = 0.5%). Backend computes the execution guard as `desiredRate = midRate ± slippage`. Strongly recommended for `FOK` / `IOC` market orders; if omitted on a market order, a default slippage is applied. The resolved guard is echoed in `resolved.desiredRate`. */
  slippage?: number;
  /**
   * AMM routing. `0` → orderbook-only (ignore AMM); a specific AMM id → also route through that AMM. Optional — if omitted, the simulator uses the market's active `ammId` from `/v1/markets`
   * @min 0
   */
  ammId?: number;
}

export interface PlaceOrderPreStateResponse {
  /** BigInt string (signed) representing the active position size **before** the order. Positive = LONG, negative = SHORT. */
  activePositionSize: string;
}

export interface ContractSwapPositionResponse {
  /** Bigint string representing the matched position size */
  size: string;
  /** Bigint string representing the cost of the matched position */
  cost: string;
  /**
   * Volume-weighted average matched APR (decimal, e.g. `0.085` = 8.5%) for the matched portion. `0` when nothing matched (pure resting order).
   * @example 0.085
   */
  rate: number;
}

export interface PlaceOrderPostStateResponse {
  /** BigInt string of the margin the account must hold **after** the order. */
  marginRequired: string;
  /**
   * Projected liquidation APR. `null` if the position remains margin-safe at any APR.
   * @example 0.15
   */
  liquidationApr?: number | null;
  /**
   * Post-trade long-yield APR for this market.
   * @example 0.09
   */
  longYieldApr: number;
}

export interface PlaceOrderResolvedResponse {
  /** Order side (numeric): `0` = LONG, `1` = SHORT. Always present. */
  side: 0 | 1;
  /** Exact tick used in the simulation (equal to request `limitTick`, or derived from `rate`). */
  limitTick: number;
  /**
   * Rate corresponding to `limitTick` after tick-to-rate conversion. May differ from `requestedRate` by a fraction of a bp.
   * @example 0.08497
   */
  actualRate: number;
  /**
   * Echoes the original user-supplied `rate`. Only set if the request used `rate`.
   * @example 0.085
   */
  requestedRate?: number;
  /**
   * Absolute ceiling used in the simulation. Set if `desiredRate` or `slippage` was provided (or auto-set for limit orders); `null` otherwise.
   * @example 0.09
   */
  desiredRate?: number | null;
}

export interface PlaceOrderSimulationResponseV3 {
  /** Account snapshot **before** the order — currently exposes `activePositionSize` so callers can compute net deltas without a separate user-info call. */
  preState: PlaceOrderPreStateResponse;
  /** Matched portion (size = 0 for a pure resting order). */
  matched: ContractSwapPositionResponse;
  /** Projected account snapshot **after** the order — `marginRequired` (with leverage applied), `liquidationApr` (`null` if margin-safe at any APR), and post-trade `longYieldApr` for this market. */
  postState: PlaceOrderPostStateResponse;
  /**
   * Price impact of the order against mid-rate (decimal).
   * @example 0.002
   */
  priceImpact: number;
  /** Human-readable status (e.g. `FILLED`, `PARTIALLY_FILLED`, `RESTING`, `NOT_FILLED`). */
  status: string;
  /**
   * Contract-level status (`Succeed`, or a contract error code such as `InsufficientMargin`).
   * @example "Succeed"
   */
  statusCode: string;
  /** Estimated maker order reward in PENDLE. */
  makerOrderReward: number;
  /** Echo of the inputs the simulator actually used after rate↔tick conversion and slippage resolution. Use these values when building the matching `place-order` calldata to avoid drift between simulation and submission. */
  resolved: PlaceOrderResolvedResponse;
}

export interface AddLiquidityToAmmV2SimulationBodyDto {
  /** User wallet address — the `root` of the margin account. Supplied explicitly because the simulation has no agent signature to read it from (the calldata-builder counterpart `POST /calldata-builder/agent/add-liquidity-to-amm` derives it from the signed payload). */
  root: string;
  /**
   * Sub-account index under `root` (0–255). `0` is the main sub-account.
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /**
   * Market ID whose AMM pool will receive the deposit. The pool's active `ammId` is resolved server-side.
   * @min 1
   */
  marketId: number;
  /** BigInt string of net cash to add as single-sided liquidity, scaled by **10^18 (cash accounting unit)** — same as `POST /calldata-builder/agent/add-liquidity-to-amm`. Funds are pulled from the user's cross account; if the account has not entered the market yet, an additional market-entrance fee is also debited (surfaced in `feeBreakdown.marketEntranceFee`). */
  netCashIn: string;
}

export interface AddLiquidityFeeBreakdownResponse {
  /** Bigint string representing the market entrance fee charged for entering a market */
  marketEntranceFee?: string;
  /** Bigint string representing the vault deposit fee charged when depositing into the vault */
  vaultDepositFee?: string;
  /**
   * Spot-USD value of `marketEntranceFee`, valued at query time. Omitted when no fee applies.
   * @example 0.15
   */
  marketEntranceFeeInUSD?: number;
  /**
   * Spot-USD value of `vaultDepositFee`, valued at query time. Omitted when no fee applies.
   * @example 0.03
   */
  vaultDepositFeeInUSD?: number;
}

export interface AddLiquidityToAmmFeeSimulationResponse {
  /** Per-component fees that will be charged when the add-liquidity transaction lands. Combines the one-off `marketEntranceFee` (only present if the account is not yet a member of the AMM's market) with the `vaultDepositFee` (proportional to the deposited cash). Bigint amounts are in 18-decimal cash units; `*InUSD` siblings are spot-priced floats. All sub-fields are optional — missing means the corresponding component does not apply. */
  feeBreakdown: AddLiquidityFeeBreakdownResponse;
}

export interface RemoveLiquidityFromAmmV2SimulationBodyDto {
  /** User wallet address — the `root` of the margin account. Supplied explicitly because the simulation has no agent signature to read it from (the calldata-builder counterpart `POST /calldata-builder/agent/remove-liquidity-from-amm` derives it from the signed payload). */
  root: string;
  /**
   * Sub-account index under `root` (0–255). `0` is the main sub-account.
   * @min 0
   * @max 255
   * @default 0
   */
  accountId?: number;
  /**
   * Market ID whose AMM pool the LP tokens will be redeemed from.
   * @min 1
   */
  marketId: number;
  /** BigInt string of LP tokens to burn, scaled by 10^18 — same unit as `POST /calldata-builder/agent/remove-liquidity-from-amm`. Caller must hold at least this much LP in the AMM sub-account; the resulting cash is returned to the cross account, net of the vault withdrawal fee surfaced in `feeBreakdown.vaultWithdrawalFee`. */
  lpToRemove: string;
}

export interface RemoveLiquidityFeeBreakdownResponse {
  /** Bigint string representing the vault withdrawal fee charged when withdrawing from the vault */
  vaultWithdrawalFee?: string;
  /**
   * Spot-USD value of `vaultWithdrawalFee`, valued at query time. Omitted when no fee applies.
   * @example 0.03
   */
  vaultWithdrawalFeeInUSD?: number;
}

export interface RemoveLiquidityFromAmmFeeSimulationResponse {
  /** Per-component fees that will be charged when the remove-liquidity transaction lands. Currently only carries `vaultWithdrawalFee` (proportional to the LP being burned); other fee categories do not apply on the exit path. Bigint amount is in 18-decimal cash units; `vaultWithdrawalFeeInUSD` is the spot-priced equivalent. */
  feeBreakdown: RemoveLiquidityFeeBreakdownResponse;
}

export interface UserVaultStateEntry {
  /** Numeric market identifier (1-based). */
  marketId: number;
  /** Numeric `tokenId` of the collateral asset. */
  tokenId: number;
  /** AMM identifier of the vault holding this position. */
  ammId: number;
  /** Volume-weighted average LP price (in collateral) the user paid into this vault. */
  averageLpPrice: number;
  /** User's aggregate deposit value into this vault, in collateral (18-decimal bigint string). */
  depositValue: string;
  /** LP tokens currently held by the user in this vault (18-decimal bigint string). */
  totalLp: string;
  /** Cap on the user's next LP deposit into this vault — derived from the cross-account initial-margin headroom (minus any first-time market entrance fee), 18-decimal bigint string. **Not** a wallet ERC-20 balance. */
  availableBalanceToDeposit: string;
}

export interface UserVaultStatesResponse {
  /** AMM vaults the user holds non-zero LP in. */
  results: UserVaultStateEntry[];
}

export interface AccountGasBalanceResponse {
  /**
   * Current wallet-level gas balance in USD. Spent automatically on each relayed action; top up via the `pay-treasury` calldata endpoints (collateral ERC-20, not the chain-native gas token).
   * @example 12.5
   */
  balanceInUSD: number;
}

export interface GasConsumptionV2Response {
  /**
   * Action type that consumed gas (e.g. deposit, withdraw, trade)
   * @example "deposit"
   */
  actionType: string;
  /** User wallet address — the `root` of the margin account. */
  root: string;
  /**
   * Gas fee in USD (always positive)
   * @example 0.35
   */
  gasFee: number;
  txHash: string;
  blockTimestamp: number;
  chainId: number;
}

export interface GasConsumptionHistoryV2RootResponse {
  results: GasConsumptionV2Response[];
  /** Resume token for fetching the next page. Null if there are no more results. */
  resumeToken?: string;
}

export interface FundLocationResponse {
  /** Where the funds live in the Boros accounting hierarchy. { Wallet : wallet, CrossAccount : cross_account, IsolatedAccount : isolated_account, AMM : amm } */
  fundType: "wallet" | "cross_account" | "isolated_account" | "amm";
  /** Numeric `marketId` when `fundType` references an isolated/specific market; omitted for wallet/cross/global locations. */
  marketId?: number;
}

export interface TransferLogResponse {
  /** Stable per-event id (use for de-duplication). */
  transferLogId: string;
  /** Block timestamp in **Unix seconds (UTC)**. */
  blockTimestamp: number;
  /** User wallet address — the `root` of the margin account. */
  root: string;
  /** Sub-account index under `root` (0–255). `0` is the main sub-account. */
  accountId: number;
  /** Numeric `tokenId` of the collateral asset. */
  tokenId: number;
  /** Transfer amount, **18-decimal bigint string** (normalised; not in the underlying token's native decimals). Always non-negative — direction is encoded by `fromFundLocation` / `toFundLocation`. */
  amount: string;
  /** Source bucket the funds left. */
  fromFundLocation: FundLocationResponse;
  /** Destination bucket the funds entered. */
  toFundLocation: FundLocationResponse;
  /** Lifecycle status (e.g. pending vs finalised; relevant for cooldown-gated withdrawals). { Pending : pending, Success : success, Failed : failed } */
  status: "pending" | "success" | "failed";
}

export interface TransferLogsV2Response {
  results: TransferLogResponse[];
  /** Resume token for fetching the next page. Null if there are no more results. */
  resumeToken?: string;
  /** Current sync status of the backend */
  syncStatus: SyncStatusResponse;
}

export interface LimitOrdersV2Response {
  results: LimitOrderResponseV2[];
  /** Resume token for fetching the next page. Null if there are no more results. */
  resumeToken?: string;
  /** Current sync status of the backend */
  syncStatus: SyncStatusResponse;
}

export interface TransactionResponse {
  /** Stable per-event id (use for de-duplication). */
  id: string;
  /** Block timestamp of the event in Unix seconds (UTC). */
  timestamp: number;
  /** The trade side: long or short. { LONG : 0, SHORT : 1 } */
  side: 0 | 1;
  /** Absolute notional size, 18-decimal bigint string, always positive — sign comes from `side`. */
  tradeSize: string;
  /**
   * Implied fixed APR at which the trade was executed (decimal, e.g. `0.05` = 5%).
   * @example 0.05
   */
  tradeRate: number;
  /** Notional value in the settlement token, 18-decimal bigint string. */
  tradeValue: string;
  /** Trading fee charged (18-decimal bigint string). */
  fee: string;
  /**
   * Realised PnL booked at this event, net of fees (18-decimal signed bigint string). Negative means a loss.
   * @example "-250000000000000"
   */
  pnl: string;
  txHash: string;
  /** `true` when this `marketAcc` filled as the maker (its resting limit order was hit). `false` for taker (market) fills. */
  isLimitOrderTrade: boolean;
  blockNumber: number;
  /** Source `orderId` — only set for maker fills (`isLimitOrderTrade = true`). */
  orderId: string;
  marketId: number;
  /** The position-owner `marketAcc` (54-char hex). Decode via `/v1/market-acc/decode`. */
  marketAcc: string;
  /** Signed position size **before** this event (18-decimal bigint string; positive = long, negative = short). */
  prevPositionS: string;
  /** Position fixed-rate cost basis **before** this event, 18-decimal bigint string. Divide by 1e18 for the human-readable value. */
  prevPositionF: string;
  /** Position fixed-rate cost basis **after** this event (18-decimal raw value). */
  postPositionF: string;
  /** Signed position size **after** this event (18-decimal bigint string). */
  postPositionS: string;
}

export interface TransactionsV2Response {
  results: TransactionResponse[];
  /** Resume token for fetching the next page. Null if there are no more results. */
  resumeToken?: string;
  /** Current sync status of the backend */
  syncStatus: SyncStatusResponse;
}

export interface SettlementResponse {
  /** Stable per-event id (use for de-duplication). */
  id: string;
  /** Block timestamp of the settlement in **Unix seconds (UTC)**. */
  timestamp: number;
  /**
   * The position-owner `marketAcc` (54-char hex). Decode via `/v1/market-acc/decode`.
   * @example "0x9dcf85824e024fea9e3ef583dccbea68edbc37b8000002ffffff"
   */
  marketAcc: string;
  /** Numeric market identifier (1-based). */
  marketId: number;
  /** Position side at time of settlement. { LONG : 0, SHORT : 1 } */
  side: 0 | 1;
  /** Signed position size at time of settlement (18-decimal bigint string; positive = long, negative = short). */
  positionSize: string;
  /** Notional value of the position at time of settlement (18-decimal bigint string in settlement token). */
  positionValue: string;
  /** Yield paid by this position holder during the settlement period (18-decimal **signed** bigint string; sign depends on `paymentIndex` / `fixedApr`). */
  yieldPaid: string;
  /** Yield received by this position holder during the settlement period (18-decimal **signed** bigint string; sign depends on `paymentIndex` / `fixedApr`). */
  yieldReceived: string;
  /** Fee charged on this settlement (18-decimal bigint string). */
  fee: string;
  /** Net settlement = `yieldReceived - yieldPaid - fee` (18-decimal **signed** bigint string). Positive means the holder was paid out this period. */
  settlement: string;
  /**
   * Annualised settlement rate effectively applied this period (decimal, e.g. `0.05` = 5%).
   * @example 0.05
   */
  settlementRate: number;
  /** All-time cumulative settlement PnL for this `(marketAcc, marketId)` (18-decimal signed bigint string). */
  cumulativeSettlementPnl: string;
  /** Cumulative settlement PnL since the **current** position was opened from flat (18-decimal signed bigint string). Resets each time the position fully closes and re-opens. */
  sinceOpenSettlementPnl: string;
}

export interface SettlementsV2Response {
  results: SettlementResponse[];
  /** Resume token for fetching the next page. Null if there are no more results. */
  resumeToken?: string;
  /** Current sync status of the backend */
  syncStatus: SyncStatusResponse;
}

export interface GetMarketAccInfosV2Dto {
  /**
   * Array of fully-packed 54-character `marketAcc` identifiers. Mix cross and isolated handles freely — each is looked up independently. Build entries via `/v1/market-acc/encode`. Min 1, max 100 per request.
   * @maxItems 100
   */
  marketAccs: string[];
}

export interface OrderResponse {
  /** Order identifier as a bigint string (64-bit uint). Packs an init marker (bit 63) · `side` (bit 56) · `tickIndex` (bits 55–40) · `orderIndex` (bits 39–0, monotonic per market+side); opaque to the caller. */
  id: string;
  /** The maker `marketAcc` that placed the order. */
  maker: string;
  /** Remaining unfilled order size (18-decimal bigint string). */
  size: string;
  /** Side of the order. { LONG : 0, SHORT : 1 } */
  side: 0 | 1;
  /** Integer tick on the discrete rate ladder. `rate = 1.00005^(tick × tickStep) - 1` where `tickStep` is per-market. */
  tick: number;
  /** Limit rate (fixed APR) of the order, 18-decimal bigint string. Divide by 1e18 to get the APR as a decimal (e.g. `5e16` → `0.05` = 5%). */
  rate: string;
  /** Initial-margin requirement currently locked behind this resting order, 18-decimal bigint string. */
  initialMarginWithLeverage: string;
}

export interface PositionResponse {
  /** Numeric market identifier (1-based). */
  marketId: number;
  /** Signed position size, 18-decimal bigint string. **Positive = long, negative = short**, zero only for residual entries. */
  signedSize: string;
  /** Mark-to-market notional value of the position, 18-decimal bigint string in the settlement token. */
  positionValue: string;
  /** Fixed APR at which this position would be liquidated, 18-decimal bigint string. Divide by 1e18 to get the APR as a decimal (e.g. `5e16` → `0.05` = 5%). */
  liquidationApr: string;
  /** Raw initial-margin requirement (no leverage), 18-decimal bigint string in the settlement token. */
  initialMargin: string;
  /** Initial-margin requirement after the account-specific leverage multiplier, 18-decimal bigint string. This is what is actually checked at order/position open. */
  initialMarginWithLeverage: string;
  /** Maintenance-margin requirement, 18-decimal bigint string. The position is liquidatable when the account can no longer cover this. */
  maintMargin: string;
  /** Resting orders pinned to this position. */
  orders: OrderResponse[];
}

export interface MarketAccInfoResponse {
  /** The 54-char `marketAcc` this result corresponds to (echoed from the request). */
  marketAcc: string;
  /** Collateral cash held inside this `marketAcc` (18-decimal bigint string in the settlement token). */
  totalCash: string;
  /** Equity of this `marketAcc`: `totalCash + Σ positionValue` (18-decimal signed bigint string). Drives all margin checks below. */
  netBalance: string;
  /** Open positions visible to this `marketAcc`. For an isolated handle this is at most one entry; for a cross handle, one per entered market with a non-zero position. */
  positions: PositionResponse[];
  /** Sum of raw per-position initial margins (no leverage), 18-decimal bigint string in the settlement token. */
  initialMargin: string;
  /** Sum of per-position initial margins after the account-specific leverage multiplier, 18-decimal bigint string. */
  initialMarginWithLeverage: string;
  /** Remaining margin available for opening new positions/orders (with leverage), 18-decimal bigint string. Reaches 0 when no further IM-consuming actions are possible. */
  availableInitialMargin: string;
  /** Remaining buffer before liquidation, 18-decimal bigint string. Zero => health ratio = 1.0 and the account is liquidatable. See [Margin mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Margin#health-ratio). */
  availableMaintMargin: string;
}

export interface MarketAccInfosResponse {
  results: MarketAccInfoResponse[];
  /** Current sync status */
  syncStatus: SyncStatusResponse;
}

export interface ActivePositionWithPnlResponse {
  /** Numeric market identifier (1-based). */
  marketId: number;
  /** The position-owner `marketAcc` (54-char hex). Decode via `/v1/market-acc/decode`. */
  marketAcc: string;
  /** `true` if owned by a cross `marketAcc`, `false` for isolated. */
  isCross: boolean;
  /**
   * Effective fixed APR cost basis of the position (decimal, e.g. `0.05` = 5%).
   * @example 0.05
   */
  fixedApr: number;
  /** Signed position size, 18-decimal bigint string. **Positive = long, negative = short.** Always non-zero in this list. */
  signedSize: string;
  /** Position side derived from `signedSize`. { LONG : 0, SHORT : 1 } */
  side: 0 | 1;
  /** All-time cumulative realised trade PnL for this `(marketAcc, marketId)` (18-decimal signed bigint string, **net of fees**). */
  cumulativePnl: string;
  /** Whether the underlying market has reached its maturity date. Matured markets are non-tradable; positions stay until final settlement. */
  isMatured: boolean;
  /** Live mark-to-market PnL on the open position, derived from current `markApr` vs the position's entered `fixedApr` (18-decimal signed bigint string). Zero when flat or matured. */
  unrealisedPnl: string;
  /** All-time cumulative funding-rate settlement PnL for this `(marketAcc, marketId)` (18-decimal signed bigint string). */
  settlementPnl: string;
}

export interface ActivePositionsWithPnlResponse {
  results: ActivePositionWithPnlResponse[];
  /** Current sync status of the backend */
  syncStatus: SyncStatusResponse;
}

export interface EnteredMarketResponse {
  /** Numeric id of an entered (and not yet exited) market. */
  marketId: number;
  /** Whether the market has reached its maturity date. Matured markets are non-tradable but may still hold residual positions awaiting final settlement. */
  isMatured: boolean;
}

export interface EnteredMarketsResponse {
  results: EnteredMarketResponse[];
}

export interface LightEventFeedOrderChangeResponse {
  orderId: string;
  /** Coarse classification of the order. `Limit`/`Market` carry a bigint-string `orderId`; `Conditional` carries a `Hex` `orderId` (the on-chain `orderHash`). */
  orderType: LightEventOrderType;
  /** LimitOrderStatus { Filling : 0, Cancelled : 1, FullyFilled : 2, Expired : 3, Purged : 4 } */
  status: 0 | 1 | 2 | 3 | 4;
  /** Bigint string of remaining unfilled size. */
  unfilledSize: string;
  /** Bigint string of size filled by THIS event (0 for non-fill events). */
  eventFilledSize: string;
  /** Side { LONG : 0, SHORT : 1 }. */
  side: 0 | 1;
  /** Tick index. Set for limit-order entries only. */
  tick?: number;
  /** Decimal rate rounded to 5 fractional digits (e.g. 10.123% → 0.10123). Set for market-order entries only. */
  rate?: number;
  /** Market-order user (`MarketAcc`) that filled the maker. Set only on `LimitOrderFilled` and `LimitOrderPartiallyFilled` entries. */
  takerAcc?: string;
  /** Support the market-order only. { GOOD_TIL_CANCELLED : 0, IMMEDIATE_OR_CANCEL : 1, FILL_OR_KILL : 2, ADD_LIQUIDITY_ONLY : 3, SOFT_ADD_LIQUIDITY_ONLY : 4 }. */
  tif?: 0 | 1 | 2 | 3 | 4;
}

export interface LightEventFeedPositionChangeResponse {
  /** Signed bigint string. Net position size right AFTER this chain event applied (NOT post-block). Negative = net short, positive = net long. */
  size: string;
  /** Bigint string. Signed delta from THIS event only. Sub-deltas of the same chain event are summed. */
  changedSize: string;
}

export interface LightEventFeedItemResponse {
  /** Composite `(blockNumber, logIndex)` index of this event. */
  eventIndex: number;
  blockNumber: number;
  /** Unix seconds. Same value across all entries from the same block. */
  blockTimestamp: number;
  /** On-chain event name in PascalCase. One of: `LimitOrderPlaced`, `LimitOrderFilled`, `LimitOrderPartiallyFilled`, `LimitOrderCancelled`, `LimitOrderForcedCancelled`, `OobOrdersPurged`, `SingleOrderExecuted`, `BulkOrdersExecuted`, `ConditionalOrderExecuted`, `SwapWithAmm`, `OtcSwap`, `ForceDeleverage`, `Liquidate`. */
  eventName: string;
  /** Coarse classification of `eventName`. { LimitOrderPlaced : LimitOrderPlaced, LimitOrderFilled : LimitOrderFilled, LimitOrderCancelled : LimitOrderCancelled, MarketOrderExecuted : MarketOrderExecuted, OtcSwap : OtcSwap, Liquidate : Liquidate, Deleverage : Deleverage, Unknown : Unknown }. */
  eventType:
    | "LimitOrderPlaced"
    | "LimitOrderFilled"
    | "LimitOrderCancelled"
    | "MarketOrderExecuted"
    | "OtcSwap"
    | "Liquidate"
    | "Deleverage"
    | "Unknown";
  txHash: string;
  marketAcc: string;
  marketId: number;
  /** Order changes produced by this chain event for this `(marketAcc, marketId)`. Omitted when empty. */
  orders?: LightEventFeedOrderChangeResponse[];
  /** Single position move this chain event produced for this `(marketAcc, marketId)`. Omitted when the event did not move the position (e.g. `LimitOrderPlaced` / `LimitOrderCancelled`). */
  position?: LightEventFeedPositionChangeResponse;
}

export interface LightEventFeedResponse {
  results: LightEventFeedItemResponse[];
  /** Resume token for fetching the next (older) page. Null if there are no more results. */
  resumeToken?: string;
  /** Current sync status of the backend. */
  syncStatus: SyncStatusResponse;
}

export interface AddLiquidityIncentiveSideResponse {
  /** Half-width of the incentive band around the mid implied APR for this side, expressed as a decimal APR (e.g. `0.005` = ±50bps). Resting size within this band qualifies. */
  incentiveRange: number;
  /** Configured PENDLE budget for this side per hour (human-readable PENDLE, decimals already applied). */
  budgetPerHour: number;
  /** Total in-range maker liquidity on this side at the latest hourly snapshot, in raw YU base units (stringified bigint). */
  currentInRangeLiquidity: string;
  /** PENDLE actually emitted per hour after the liquidity-cap throttle is applied (capped at `budgetPerHour`). */
  currentCappedDistributionPerHour: number;
  /** Caller's share (0-1) of the in-range YU at the latest sync snapshot. **0 when `maker` is not provided.** */
  currentEligibleShare: number;
  /** PENDLE accumulated by `maker` on this side **for the current epoch only** — equals already-accumulated rewards plus the in-epoch projection up to the current block (human-readable PENDLE). Resets each epoch. **0 when `maker` is not provided.** */
  accumulatedReward: number;
}

export interface AddLiquidityIncentiveResponse {
  /** Incentive parameters and stats for **long-side** maker orders (resting bids on YU). */
  long: AddLiquidityIncentiveSideResponse;
  /** Incentive parameters and stats for **short-side** maker orders (resting asks on YU). */
  short: AddLiquidityIncentiveSideResponse;
}

export interface FilledVolumeIncentiveResponse {
  /** Caller's notional traded as a **maker** (filled side of a resting limit order) since the start of the current epoch, expressed in YU. Filtered to `accountId = 0` only — non-zero sub-accounts are excluded. **0 when `maker` is not provided.** */
  userMakerVolume: number;
  /** Total maker-side notional executed across all participants in the current epoch (in YU). */
  totalMakerVolume: number;
  /** PENDLE budget allocated to the filled-volume track for this market in the current epoch. */
  totalEpochReward: number;
  /** Implied PENDLE-per-YU rate so far this epoch — `totalEpochReward / max(totalMakerVolume, 1)`. Use to estimate the marginal reward for additional maker fills. */
  avgRewardPerYu: number;
}

export interface MakerIncentiveCampaignResponse {
  /** Start of the current incentive epoch (Unix seconds, UTC). All `epoch`-scoped fields are measured against this anchor. */
  epochTimestamp: number;
  /** Hourly maker resting-liquidity track (long + short sides). */
  addLiquidityIncentive: AddLiquidityIncentiveResponse;
  /** Per-epoch filled-volume track (rewards based on share of maker-side fills). */
  filledVolumeIncentive: FilledVolumeIncentiveResponse;
}

export interface AmmIncentivesAllTimeRewards {
  /** Lifetime PENDLE incentive rewards earned by the LP, in human-readable PENDLE (token-denominated, **not** USD-converted). */
  pendleRewards: number;
  /** Lifetime swap-fee rewards earned by the LP, in whole units of the AMM's collateral token (decimals applied; **not** USD-converted). */
  swapFeeRewards: number;
}

export interface AmmIncentivesMarketEntry {
  /** market id */
  marketId: number;
  /** Reserved — currently always `"0"`. Per-market unclaimed rewards are not yet wired through this endpoint; use the top-level `unclaimedAmountInUsd` for the aggregate. */
  unclaimedRewards: string;
  /** Lifetime rewards earned by the LP on this market, split into PENDLE and swap-fee components (token-denominated, **not** USD-converted). */
  allTimeRewards: AmmIncentivesAllTimeRewards;
}

export interface AmmIncentivesResponse {
  /** Lifetime accrued AMM rewards across **all** Boros AMMs the user has provided liquidity to, valued in USD at query time. Includes both already-claimed and currently-unclaimed amounts. */
  accruedAmountInUsd: number;
  /** Currently **unclaimed** AMM rewards across all AMMs, valued in USD at query time. */
  unclaimedAmountInUsd: number;
  /** Per-market breakdown — one entry per market the user has LP exposure in. Empty when `user` is omitted. */
  perMarket: AmmIncentivesMarketEntry[];
}

export interface AgentExpiryTimeResponse {
  /**
   * Unix seconds (UTC) at which the agent's authorization expires. `0` if the agent has never been approved or has been revoked. Compare against the current time to determine if the agent is still valid.
   * @example 1735689600
   */
  expiryTime: number;
}

export interface StrategyMarketResponse {
  /** Numeric market identifier (1-based). */
  marketId: number;
  /** Market address */
  address: string;
  /** Collateral token id this market settles in. */
  tokenId: number;
  /** Human-readable market name (e.g. `BTCUSDT`). */
  name: string;
  /** Asset symbol */
  assetSymbol: string;
  /** Market maturity (Unix seconds, UTC). */
  maturity: number;
  /** Market lifecycle state (one of `Normal`, `Capped`, `Paused`, `Halted`). */
  state: string;
  /** Market's current mid implied APR (1.0 = 100%). */
  impliedApr: number;
  /** Maximum leverage allowed for fixed (held-to-maturity) positions. */
  maxLeverage: number;
  /** Maximum leverage allowed for perpetual-style (rolled) positions. */
  maxPerpLeverage: number;
  /** AMM ID */
  ammId?: number;
  /** Platform / venue label (e.g. `Binance`, `Hyperliquid`). */
  platformName?: string;
}

export interface StrategyResponse {
  /** Strategy ID */
  id: string;
  /** Market to be **longed** (buy YU). See `StrategyMarketResponse`. */
  longMarket: StrategyMarketResponse;
  /** Market to be **shorted** (sell YU). See `StrategyMarketResponse`. */
  shortMarket: StrategyMarketResponse;
  /** Calendar days remaining until the shared maturity. Both markets are grouped by identical maturity, so this single value applies to both legs. */
  daysToMaturity: number;
  /** Absolute spread `|market1.impliedApr - market2.impliedApr|` (always ≥ 0, decimal where 1.0 = 100%). The lower-APR market is assigned as `longMarket`, so this equals `shortMarket.impliedApr - longMarket.impliedApr`. The strategy harvests this spread to maturity. */
  impliedAprSpread: number;
  /** Max perp leverage achievable on the spread = `min(10, longMarket.maxPerpLeverage, shortMarket.maxPerpLeverage)`. Hard cap of **10** applies on top of the per-market limits. */
  maxPerpLeverage: number;
  /** Indicative annualized return at maximum allowable leverage, net of strategy fees and combined Boros margin (decimal, 1.0 = 100%). Used as the sort key. */
  aprTimesMaxLeverage: number;
}

export interface FindStrategiesResponse {
  strategies: StrategyResponse[];
  /** Total number of strategies found */
  totalCount: number;
}

export interface GasPriceInfoResponse {
  /** Latest sampled gas price in **wei per gas unit** (stringified bigint). `null` if unavailable. */
  gasPriceWei: object | null;
  /** Latest sampled gas price in **USD per gas unit** (decimal). `null` if unavailable. */
  gasPriceUsd: object | null;
  /** Estimated USD cost of placing **one limit order** at the current gas price (decimal). `null` if unavailable. */
  estimatedOrderGasCostUsd: object | null;
  /** Unix seconds (UTC) when the gas-price sample was taken — useful to gauge staleness. `null` if unavailable. */
  timestamp: object | null;
  /** EVM chain id this sample is for. **Always `42161` (Arbitrum One)** today. */
  chainId: number;
}

export interface LeaderboardEntryResponse {
  /** 1-based rank within this (period, tokenId) leaderboard. Ordinal (no ties). */
  rank: number;
  /** User wallet address — the `root` of the margin account. */
  root: string;
  /** Sub-account index under `root` (0–255). `0` is the main sub-account. */
  accountId: number;
  /** Realized + unrealized PnL over the period, in **raw base units** of the collateral token. Stringified bigint. */
  pnl: string;
  /** Account's current net balance in raw base units of the collateral token. Stringified bigint. */
  netBalance: string;
  /** Cumulative notional traded over the period in raw base units of the collateral token. Stringified bigint. */
  tradingVolume: string;
  /** Peak capital deployed during the period — used as the denominator in ROI. Stringified bigint, raw base units. */
  maxCapital: string;
  /** Return on capital over the period, expressed as a decimal (1.0 = +100%). Used as the ranking key. */
  roi: number;
}

export interface LeaderboardResponse {
  /** Unix seconds (UTC) of the snapshot used to compute this leaderboard — always at midnight. Snapshots are produced once per day. */
  snapshotTimestamp: number;
  /** Page of leaderboard entries (sorted by `rank` ascending, i.e. by ROI descending). */
  entries: LeaderboardEntryResponse[];
  /** Total number of qualifying entries in this snapshot. Use to compute total page count. */
  totalEntries: number;
}

export interface UserSearchResponse {
  /** 1-based rank in the snapshot. **Present only when the user is in the leaderboard** — omitted when computing fallback values from daily snapshots. */
  rank?: number;
  /** User's PnL over the period in raw base units of the collateral token. Stringified bigint. */
  pnl: string;
  /** User's current net balance in raw base units of the collateral token. Stringified bigint. */
  netBalance: string;
  /** User's notional volume over the period in raw base units. Stringified bigint. */
  tradingVolume: string;
  /** ROI over the period (1.0 = +100%). **Present only when the user is in the leaderboard.** */
  roi?: number;
}

export interface TvlTokenBreakdownResponse {
  /** Collateral token address */
  address: string;
  symbol: string;
  /** ERC-20 `decimals` of the token. Use to convert `balance` to a human-readable amount. */
  decimals: number;
  /**
   * Raw on-chain balance held by `MarketHub` in **token base units** (stringified bigint).
   * @example "1000000000"
   */
  balance: string;
  /**
   * Oracle USD price for **1 whole token** (decimals already applied), stringified decimal.
   * @example "3500.25"
   */
  usdPrice: string;
  /**
   * `balance / 10^decimals × usdPrice`, stringified decimal. Sums to `totalInUSD`.
   * @example "3500250.12"
   */
  tokenInUSD: string;
}

export interface TvlResponse {
  /** Sum of `tokenInUSD` across all collateral tokens held by `MarketHub`, stringified decimal. */
  totalInUSD: string;
  /** Per-token breakdown — one entry per registered collateral token (assets with `isCollateral` set, regardless of whitelist status). */
  breakdown: TvlTokenBreakdownResponse[];
}

export interface PendleSignTxDto {
  /**
   * Packed account identifier (root address + account ID)
   * @example "0x009dcf85824e024fea9e3ef583dccbea68edbc37b8"
   */
  account: string;
  /**
   * Unique connection identifier for nonce management
   * @example "0xabcdef1234567890"
   */
  connectionId: string;
  /** Transaction nonce as a bigint string, must be >= 1 */
  nonce: string;
}

export interface AgentExecuteDto {
  agent: string;
  message: PendleSignTxDto;
  signature: string;
  /**
   * ABI-encoded calldata to be executed by the Boros Router contract
   * @example "0x..."
   */
  calldata: string;
}

export interface BulkAgentExecuteDto {
  datas: AgentExecuteDto[];
  /**
   * If true, the on-chain `tryAggregate` reverts the entire batch when any inner call fails.
   * @default false
   */
  requireSuccess?: boolean;
  /**
   * If true, return as soon as the bot reports the txHash — do not wait for the on-chain receipt to decode per-call status. The response will have `status` and `error` fields empty for every survivor.
   * @default false
   */
  skipReceipt?: boolean;
}

export interface TxResponse {
  txHash?: string;
  status?: "success" | "reverted";
  /** On-chain `tryAggregate` position of this call. Includes any startIndex offset if v2 merged this submission with others. */
  index?: number;
  error?: string;
}

export interface ApproveAgentQueryDto {
  /**
   * ABI-encoded calldata for the Router.approveAgent() function call
   * @example "0x..."
   */
  approveAgentCalldata: string;
  /** If true, return as soon as the bot reports the txHash. Default: false. */
  skipReceipt?: boolean;
}

export interface ApproveAgentResponse {
  approveAgentResult: TxResponse;
}

export interface TraceQueryDto {
  /** Agent address used when submitting the original batch */
  agent: string;
  /** Nonce (bigint string) of the calldata to look up */
  nonce: string;
}

export interface TraceResponse {
  /** Status of the submission the queried (agent, nonce) belongs to */
  submissionStatus: "HAVENT_SEEN" | "PROCESSING" | "PROCESSED" | "SEND_FAILED";
  /** Status of the specific (agent, nonce). Mirrors the submission status today. */
  nonceStatus: "HAVENT_SEEN" | "PROCESSING" | "PROCESSED" | "SEND_FAILED";
  /** Per-nonce result, shaped like one entry from /bulk-calls. Set when submissionStatus is PROCESSED and a tx was actually broadcast for this nonce (i.e. simulation passed for this entry). */
  result?: TxResponse;
}

export interface TxStatusQueryDto {
  /** On-chain transaction hash returned by /bulk-calls (or /approve) */
  txHash: string;
}

export interface DedicatedTxStatusItem {
  /** Transaction status */
  status: string;
  /** Index in tryAggregate batch */
  index: number;
  /** Error message if reverted */
  error?: string;
}

export interface DedicatedTxStatusResponseV2 {
  /** Overall transaction status: "success" if all calls succeeded, "reverted" if the transaction reverted */
  status: string;
  /** Block number of the transaction */
  blockNumber: number;
  /** Block timestamp of the transaction */
  blockTimestamp: number;
  /** Transaction status items */
  statuses: DedicatedTxStatusItem[];
}

export interface LimitOrderPlacedEventItem {
  /** Market address that emitted the event */
  marketAddress: string;
  /** Market ID */
  marketId: number;
  /** Order IDs placed */
  orderIds: string[];
  /** Corresponding sizes for each order */
  sizes: string[];
}

export interface LimitOrderCancelledEventItem {
  /** Market address that emitted the event */
  marketAddress: string;
  /** Market ID */
  marketId: number;
  /** Order IDs cancelled */
  orderIds: string[];
}

export interface MarketOrderExecutedItem {
  /** Market address */
  marketAddress: string;
  /** Market ID */
  marketId: number;
  /** Market order ID (derived from block + log index) */
  orderId: string;
  /** MarketAcc of the order taker */
  user: string;
  /** Side { LONG : 0, SHORT : 1 } */
  side: 0 | 1;
  /** Absolute filled size as a bigint string */
  size: string;
}

export interface DedicatedTxStatusWithEventsItem {
  /** Transaction status */
  status: string;
  /** Index in tryAggregate batch */
  index: number;
  /** Error message if reverted */
  error?: string;
  /** Limit orders placed by this call */
  limitOrdersPlaced: LimitOrderPlacedEventItem[];
  /** Limit orders cancelled by this call */
  limitOrdersCancelled: LimitOrderCancelledEventItem[];
  /** Market orders executed by this call */
  marketOrdersExecuted: MarketOrderExecutedItem[];
}

export interface DedicatedTxStatusWithEventsResponse {
  /** Overall transaction status: "success" if all calls succeeded, "reverted" if the transaction reverted */
  status: string;
  /** Block number of the transaction */
  blockNumber: number;
  /** Block timestamp of the transaction */
  blockTimestamp: number;
  /** Per-call status with associated limit order events */
  statuses: DedicatedTxStatusWithEventsItem[];
}

export interface DedicatedBulkAgentExecuteDto {
  /** Array of agent execute requests. All must share the same agent address and root account. */
  datas: AgentExecuteDto[];
  /**
   * If true, reverts the entire batch when any single transaction fails.
   * @default false
   */
  requireSuccess?: boolean;
  /**
   * If true, simulates the batch before sending. When `requireSuccess=true`, returns failedSimulations without broadcasting if any call would revert. When `requireSuccess=false`, filters reverters out of the batch before sending.
   * @default false
   */
  simulate?: boolean;
}

export interface FailedSimulationItem {
  /** Index of the calldata in the original sorted batch */
  index: number;
  /** The calldata that failed simulation */
  calldata: string;
  /** Reason for failure */
  reason: string;
}

export interface DedicatedTxResponse {
  /** Transaction hash, null if no calldata was sent */
  txHash?: string | null;
  /** List of calldata that failed simulation. Only present when simulate=true and some calls reverted. */
  failedSimulations?: FailedSimulationItem[];
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://api-boros.pendle.finance/apis",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Boros Open API Docs
 * @version 1.0
 * @baseUrl https://api-boros.pendle.finance/apis
 * @contact Pendle Finance <hello@pendle.finance> (https://pendle.finance)
 *
 * Boros Open API documentation (redesigned).
 *
 * **Compute Units (CU).** Every endpoint advertises a CU cost via the `x-computing-unit` OpenAPI extension, also returned as the `x-computing-unit` response header. A value like `1+` means the endpoint has a variable cost — the minimum is charged for an empty / default request, and the total scales with the work actually performed (usually page size, number of markets, or number of indicators).
 */
export class Sdk<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  amm = {
    /**
     * @description Returns AMM states for the requested markets, in the order of the `marketIds` query param. Markets without an attached AMM, missing IDs, and non-whitelisted markets are silently omitted (no 404). **Limits.** Minimum 1, maximum **100** IDs per request. **Cost.** **1 CU** for a single ID, **2 CU** for 2+ IDs. See [Order Book mechanics](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook) for how AMM state composes with resting limit orders.
     *
     * @tags AMM
     * @name Ammv2ControllerGetAmmStates
     * @summary Get AMM states by market IDs
     * @request GET:/v1/amm/states
     */
    ammv2ControllerGetAmmStates: (
      query: {
        /**
         * Comma-separated market IDs (e.g. `1,2,3`). Numeric market identifier (1-based). Min 1, max 100 per request.
         * @example "1,2,3"
         */
        marketIds: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetAMMStatesResponse, void>({
        path: `/v1/amm/states`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  assets = {
    /**
     * @description Returns the list of **whitelisted** assets/tokens recognised by the Boros backend with their on-chain metadata and current USD price — non-whitelisted assets are excluded. Not paginated — the response includes every whitelisted asset in one call. **Filtering.** When `isCollateral` is omitted, both collateral and non-collateral assets are returned. Pass `isCollateral=true` to restrict to assets that can back margin (used as collateral for positions); pass `isCollateral=false` for the inverse.
     *
     * @tags Assets
     * @name AssetsControllerListAssets
     * @summary List all supported assets
     * @request GET:/v1/assets
     */
    assetsControllerListAssets: (
      query?: {
        /** Filter by collateral status. If omitted, returns all assets */
        isCollateral?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListAssetsResponse, any>({
        path: `/v1/assets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  markets = {
    /**
     * @description Returns a paginated list of markets with their configuration and real-time pricing data, ordered by ascending `marketId`. Non-whitelisted markets (`metadata.isWhitelisted = false`) are never returned. Use `isUiWhitelisted` to narrow the set, `isMatured` to filter by maturity status, or `resumeToken`/`limit` for cursor-based pagination. **Pagination.** `limit` defaults to **50** and is capped at **200**. `resumeToken` encodes the last `marketId` returned; pages are stable across calls because markets are ordered by an immutable numeric ID. The response `resumeToken` is `null` when no more pages remain. Use `GET /markets/by-ids` to fetch specific markets by ID. See [Glossary](https://docs.pendle.finance/boros-dev/Backend/glossary) for terminology.
     *
     * @tags Markets
     * @name MarketsControllerListMarkets
     * @summary List markets
     * @request GET:/v1/markets
     */
    marketsControllerListMarkets: (
      query?: {
        /** Filter by maturity status. If omitted, returns all markets (including matured). */
        isMatured?: boolean;
        /** Filter by UI whitelist status. A market is UI-whitelisted when it is not flagged as a dev/test market. If omitted, returns both UI-whitelisted and non-UI-whitelisted markets. Non-UI-whitelisted markets are not displayed in the UI but are accessible to market makers. */
        isUiWhitelisted?: boolean;
        /**
         * Page size.
         * @default 50
         */
        limit?: number;
        /** Resume token from a previous response to fetch the next page. */
        resumeToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListMarketsResponse, void>({
        path: `/v1/markets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the requested markets in the order of the `marketIds` query param. Non-whitelisted markets (`metadata.isWhitelisted = false`) are never returned, even by direct ID lookup; matured markets remain reachable. Missing or non-whitelisted IDs are silently omitted (no 404). The response `resumeToken` is always `null` (this endpoint does not paginate). **Limits.** Minimum 1, maximum **100** IDs per request. IDs must be positive integers; duplicates yield duplicate response entries. **Cost.** **1 CU** for a single ID, **2 CU** for 2+ IDs.
     *
     * @tags Markets
     * @name MarketsControllerGetMarketsByIds
     * @summary Get markets by IDs
     * @request GET:/v1/markets/by-ids
     */
    marketsControllerGetMarketsByIds: (
      query: {
        /**
         * Comma-separated market IDs (e.g. `1,2,3`). Returns the requested markets in the order provided.
         * @example "1,2,3"
         */
        marketIds: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ListMarketsResponse, void>({
        path: `/v1/markets/by-ids`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a paginated list of executed trades for a market, ordered **newest-first** by `eventIndex`. Pages are stable across calls — the cursor advances over a strictly monotone field, so newly-arrived trades appear only on the first page. **Pagination.** `limit` defaults to **10**, capped at **2000**. Pass `resumeToken` from the previous response to fetch the next page; `resumeToken` is `null` when no more results. **Cost.** Dynamic: **1 CU per 200 trades** requested (e.g. `limit=10` → 1 CU, `limit=400` → 2 CU, `limit=2000` → 10 CU).
     *
     * @tags Markets
     * @name MarketsControllerListMarketTrades
     * @summary List market trades
     * @request GET:/v1/markets/trades
     */
    marketsControllerListMarketTrades: (
      query: {
        /**
         * Numeric market identifier (1-based).
         * @min 1
         */
        marketId: number;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarketTradesV2Response, void>({
        path: `/v1/markets/trades`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns aggregated order book data for a market, grouped by `tickSize` (tick aggregation step). The response contains `long` (bid) and `short` (ask) sides as parallel arrays: `ia[i]` is the implied APR at level `i` (unitless decimal, e.g. `0.085` = 8.5%), `sz[i]` is the total notional size at that level as a **bigint string** in 18-decimal YU (yield units). Long levels are sorted descending by APR (best bid first); short levels ascending by APR (best ask first). Each side is capped at the **best 50 entries**. **AMM merging.** When `includeAmm=true`, on-chain AMM positions are merged into the book before the 50-entry cap is applied. When `includeAmm=false` (default), only resting limit orders are returned, also capped at 50 entries per side. **Tick size.** `tickSize` controls how raw ticks are bucketed before aggregation. See [Order Book mechanics](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook) for the tick-to-rate exponential mapping and matching rules.
     *
     * @tags Markets
     * @name MarketsControllerGetOrderBook
     * @summary Get market order book
     * @request GET:/v1/markets/order-book
     */
    marketsControllerGetOrderBook: (
      query: {
        /**
         * Numeric market identifier (1-based).
         * @min 1
         */
        marketId: number;
        /** Tick aggregation step. Adjacent raw ticks are grouped into a single price level before sizes are summed; larger values produce coarser, more readable books. */
        tickSize: 0.0001 | 0.001 | 0.01 | 0.1;
        /**
         * When `true`, on-chain AMM liquidity is merged into both sides of the book and each side is capped at **50** entries. When `false` (default), only resting limit orders are returned.
         * @default false
         * @example false
         */
        includeAmm?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<OrderBooksResponse, void>({
        path: `/v1/markets/order-book`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns OHLCV (Open, High, Low, Close, Volume) candlestick data for a specific market, ordered ascending by `ts`. Each candle covers a half-open `[ts, ts + timeFrame)` window. **Timestamp rounding.** `startTimestamp` and `endTimestamp` are floored to the nearest `timeFrame` boundary before the query runs. `endTimestamp` defaults to *now* and is clamped to *now*; `startTimestamp` defaults to `0` (the engine then clamps the window — see below). **Gap-filling.** If a bucket has no trades, the candle is emitted with `o = h = l = c` equal to the previous candle's close (or `0` if no prior candle exists) and `v = 0`. Buckets are never skipped. **Response cap.** The `[startTimestamp, endTimestamp]` window is capped to at most **200** candles at the requested `timeFrame`; if the window is larger, `startTimestamp` is automatically advanced so the response holds the **most recent 200 candles** ending at `endTimestamp`. For longer ranges, page backwards with smaller windows or use `GET /indicators/export` (CSV, up to 10,000 rows).
     *
     * @tags Markets
     * @name MarketsControllerGetOhlcv
     * @summary Get OHLCV chart data
     * @request GET:/v1/markets/ohlcv
     */
    marketsControllerGetOhlcv: (
      query: {
        /**
         * Numeric market identifier (1-based).
         * @min 1
         */
        marketId: number;
        /** Candle width. { FIVE_MINUTES : 5m, ONE_HOUR : 1h, ONE_DAY : 1d, ONE_WEEK : 1w } */
        timeFrame: "5m" | "1h" | "1d" | "1w";
        /**
         * Start timestamp (Unix seconds). Floored to `timeFrame`. Defaults to `0`. The window is capped to the most recent **200** candles ending at `endTimestamp` — if `[startTimestamp, endTimestamp]` is wider, `startTimestamp` is advanced automatically.
         * @default 0
         */
        startTimestamp?: number;
        /**
         * End timestamp (Unix seconds). Floored to `timeFrame` and clamped to *now*. Defaults to *now*.
         * @default 1779260620
         */
        endTimestamp?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<OhlcvChartResponse, void>({
        path: `/v1/markets/ohlcv`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  indicators = {
    /**
     * @description Unified endpoint for fetching market indicators on a uniform time grid: - `u` — underlying APR (unitless decimal, `0.085` = 8.5%). - `fp` — future premium (mark APR minus underlying APR). - `fgi` — Fear & Greed Index, returned as `{ v: 0..100, vc: classification }`. - `ap` — asset price in **USD**. - `udma:<periods>` — X-day moving average(s) of the underlying funding rate; periods are integers `1..365` separated by `;`, max 10 periods (e.g. `udma:7;30`). **Time grid.** `startTimestamp` and `endTimestamp` are **Unix seconds**, floored to the chosen `timeFrame` bucket. `endTimestamp` defaults to *now*; `startTimestamp` defaults to `0`. `endTimestamp >= startTimestamp` is enforced after rounding. Each result row corresponds to one bucket on the grid, ordered ascending by `ts`. **Response cap.** The `[startTimestamp, endTimestamp]` window is capped to **500** buckets at the chosen `timeFrame`; if the window is larger, `startTimestamp` is automatically advanced so the response holds the **most recent 500 buckets** ending at `endTimestamp`. For longer ranges, use `GET /indicators/export` (CSV, up to 10,000 rows). **Forward-fill.** Sparse indicators (e.g. hourly `fgi` queried at `5m`) are forward-filled from the most recent known value. `metadata.firstDataTimestamp[indicator]` reports the earliest bucket with real data so callers can render "no data before X". `metadata.uLastSettledTimestamp` marks the last bucket where `u` is settled historical data; later buckets use real-time funding rates and may revise. **Cost.** Dynamic: **1 CU per indicator in `select`.** A `udma:7;30` entry counts as a single indicator regardless of how many moving-average periods are packed into it.
     *
     * @tags Indicators
     * @name IndicatorsControllerGetIndicators
     * @summary Get market indicators with dynamic selection
     * @request GET:/v1/indicators
     */
    indicatorsControllerGetIndicators: (
      query: {
        /**
         * Numeric market identifier (1-based).
         * @min 1
         */
        marketId: number;
        /** Bucket width on the response time grid. { FIVE_MINUTES : 5m, ONE_HOUR : 1h, ONE_DAY : 1d, ONE_WEEK : 1w } */
        timeFrame: "5m" | "1h" | "1d" | "1w";
        /**
         * Start timestamp (Unix seconds), floored to `timeFrame`. Defaults to `0`. The window is capped to the most recent **500** buckets ending at `endTimestamp` — if the requested window is wider, `startTimestamp` is advanced automatically.
         * @default 0
         */
        startTimestamp?: number;
        /**
         * End timestamp (Unix seconds), floored to `timeFrame` and clamped to *now*. Defaults to *now*. Must be `>= startTimestamp` after rounding.
         * @default 1779260620
         */
        endTimestamp?: number;
        /**
         * Comma-separated list of indicators to return. Supported: `u` (underlying APR), `fp` (future premium), `fgi` (Fear & Greed Index), `ap` (asset price USD), `udma:<periods>` (X-day moving averages of underlying funding rate, integer periods 1-365 separated by `;`, max 10 periods, e.g. `udma:7;30`). At least 1 entry required. Each entry costs **1 CU**.
         * @example "u,fp,fgi,ap,udma:7;30"
         */
        select: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<IndicatorsResponse, any>({
        path: `/v1/indicators`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Streams a CSV file with one row per `timeFrame` bucket on the `[startTimestamp, endTimestamp]` grid (Unix seconds, floored to `timeFrame`). OHLCV columns (`o`, `h`, `l`, `c`, `v` — APR decimals for OHLC, USD for `v`) are **always** included; pass `select` to add any of `u`, `fp`, `fgi`, `ap`, `udma:<periods>` (same format as `GET /indicators`). **Response cap.** Up to **10,000** rows per call. If the requested window exceeds 10,000 buckets, `startTimestamp` is advanced so the file holds the most recent 10,000 buckets ending at `endTimestamp`. Filename pattern: `indicators-<marketId>-<timeFrame>-<unixMs>.csv`, served as `text/csv` attachment.
     *
     * @tags Indicators
     * @name IndicatorsControllerGetIndicatorsExport
     * @summary Export market indicators as CSV (up to 10,000 data points)
     * @request GET:/v1/indicators/export
     */
    indicatorsControllerGetIndicatorsExport: (
      query: {
        /**
         * Numeric market identifier (1-based).
         * @min 1
         */
        marketId: number;
        /**
         * CSV row width. { FIVE_MINUTES : 5m, ONE_HOUR : 1h, ONE_DAY : 1d, ONE_WEEK : 1w }
         * @example "5m"
         */
        timeFrame: "5m" | "1h" | "1d" | "1w";
        /**
         * Start timestamp (Unix seconds), floored to `timeFrame`. Defaults to `0`. Capped to the most recent **10,000** buckets ending at `endTimestamp` — if the window is wider, `startTimestamp` is advanced automatically.
         * @default 0
         * @example 0
         */
        startTimestamp?: number;
        /**
         * End timestamp (Unix seconds), floored to `timeFrame` and clamped to *now*. Defaults to *now*. Must be `>= startTimestamp` after rounding.
         * @default 1779260620
         */
        endTimestamp?: number;
        /**
         * Comma-separated list of **additional** indicators to include alongside OHLCV (which is always present). Supported: `u`, `fp`, `fgi`, `ap`, `udma:<periods>` (integer periods 1-365 separated by `;`, max 10 periods, e.g. `udma:3;7;30`). Empty/omitted = OHLCV only.
         * @example "u,fgi,fp,ap,udma:3;7;30"
         */
        select?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<File, any>({
        path: `/v1/indicators/export`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  marketAccountUtilities = {
    /**
     * @description Packs `root + accountId + tokenId + marketId` into the 54-character hex identifier used across the API. **Concept.** A `marketAcc` uniquely identifies a margin account inside Pendle Boros. It is a 26-byte identifier laid out as `root` (20 bytes, the user wallet) · `accountId` (1 byte, 0-255 sub-account index) · `tokenId` (2 bytes, the collateral token) · `marketId` (3 bytes). When `marketId` is `0xFFFFFF` the identifier points at the user's cross-margin account; any other value pins it to a single isolated market. Every account/balance/trading endpoint expects this same handle, so reuse the output here when calling them.
     *
     * @tags Market Account (Utilities)
     * @name MarketAccV2ControllerEncode
     * @summary Encode a `marketAcc`
     * @request GET:/v1/market-acc/encode
     */
    marketAccV2ControllerEncode: (
      query: {
        /** The user wallet address (42-char hex). This is the `root` of the margin account. */
        root: string;
        /**
         * Sub-account index (0-255). A single wallet (`root`) may hold up to 256 accounts. Defaults to 0 (the main account).
         * @min 0
         * @max 255
         * @default 0
         */
        accountId?: number;
        /**
         * Collateral `tokenId` assigned to this market account (e.g. 1 for USD0).
         * @min 1
         */
        tokenId: number;
        /**
         * Market identifier. Omit (or pass the decimal equivalent of `0xFFFFFF` = 16777215) to target the cross account. Any other value pins the identifier to that isolated market.
         * @min 1
         */
        marketId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<EncodeMarketAccResponse, void>({
        path: `/v1/market-acc/encode`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Unpacks a 54-character `marketAcc` into `{ root, accountId, tokenId, marketId, isCross }`. Handy when you receive a `marketAcc` from another endpoint and want to render the account in a UI or re-derive any of its components. See the `/encode` endpoint for the full layout.
     *
     * @tags Market Account (Utilities)
     * @name MarketAccV2ControllerDecode
     * @summary Decode a `marketAcc`
     * @request GET:/v1/market-acc/decode
     */
    marketAccV2ControllerDecode: (
      query: {
        /** Packed 54-character hex identifier (`0x` + 26 bytes). Layout: `root` (20 bytes) · `accountId` (1 byte) · `tokenId` (2 bytes) · `marketId` (3 bytes). */
        marketAcc: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DecodeMarketAccResponse, void>({
        path: `/v1/market-acc/decode`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  miscellaneous = {
    /**
     * @description Returns every limit order placed by a specific transaction hash. Useful for reconciling a `place-order` / `place-orders` call against the resulting on-chain order ids.
     *
     * @tags Miscellaneous
     * @name OrdersV2ControllerGetOrdersByPlacedTxHash
     * @summary Get orders by placed transaction hash
     * @request GET:/v1/orders/by-tx-hash
     */
    ordersV2ControllerGetOrdersByPlacedTxHash: (
      query: {
        /** The transaction hash of the placed order */
        placedTxHash: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<OrdersByTxHashResponse, void>({
        path: `/v1/orders/by-tx-hash`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the catalog of off-chain perp funding rate streams that Boros markets settle against — each entry pairs a venue (`exchange`, e.g. `binance`, `hyperliquid`) with the venue-specific instrument string (`fundingRateSymbol`, e.g. `BTCUSDT`) and the canonical `assetSymbol`. **A "symbol" here is a (venue, contract) pair, not a Boros market** — multiple Boros markets can quote the same symbol with different maturities. Use this to discover which feeds are available; map a feed to its tradable Boros markets via `GET /v1/markets`.
     *
     * @tags Miscellaneous
     * @name FundingRateV2ControllerGetAllFundingRateSymbols
     * @summary Get all funding rate symbols
     * @request GET:/v1/funding-rate/all-funding-rate-symbols
     */
    fundingRateV2ControllerGetAllFundingRateSymbols: (
      params: RequestParams = {},
    ) =>
      this.request<FundingRateSymbolListResponse, any>({
        path: `/v1/funding-rate/all-funding-rate-symbols`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns one row per **on-chain settlement event** that fell inside the `[fromTimestamp, toTimestamp]` window (Unix seconds, UTC), sorted by `periodTimestamp` descending. `periodTimestamp` is the start of the funding period; period length matches the market's configured `settlementInterval` (e.g. 1h / 2h / 8h). Non-whitelisted markets are silently excluded. **CU cost.** Dynamic: **1 CU per 10 returned rows** (e.g. up to 10 rows → 1 CU, 100 rows → 10 CU). See [Settlement mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Settlement) for how funding payments accrue and settle.
     *
     * @tags Miscellaneous
     * @name FundingRateV2ControllerGetSettlementSummaryByMarket
     * @summary Get settlement summary
     * @request POST:/v1/funding-rate/settlement-summary
     */
    fundingRateV2ControllerGetSettlementSummaryByMarket: (
      data: GetSettlementSummaryByMarketQueryDto,
      params: RequestParams = {},
    ) =>
      this.request<SettlementMarketSummaryListResponse, void>({
        path: `/v1/funding-rate/settlement-summary`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the most recent on-chain `Liquidate` events emitted by the market contract, **sorted by `blockTimestamp` descending** (newest first). For each event the response also includes the violator and liquidator position snapshots (rate + notional size) before and after the liquidation trade. The endpoint is **not cursor-paginated**: it always returns the top-N events that match the filters (`limit`, default 10, max 2000). To page through history, narrow the window with `fromTimestamp`/`toTimestamp`. Cost scales with `limit`: **CU = max(1, ceil(limit / 200))**. See [Margin mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Margin) for liquidation rules and health ratio.
     *
     * @tags Miscellaneous
     * @name EventsV2ControllerGetLiquidationEvents
     * @summary Get liquidation events, sorted by timestamp descending
     * @request GET:/v1/events/liquidation-events
     */
    eventsV2ControllerGetLiquidationEvents: (
      query?: {
        /**
         * Restrict results to a single market id. If omitted, liquidations from all markets are returned.
         * @min 1
         */
        marketId?: number;
        /** Inclusive lower bound on the event block timestamp (Unix seconds, UTC). Must be at or after Boros mainnet genesis (`1753334471`). */
        fromTimestamp?: number;
        /** Inclusive upper bound on the event block timestamp (Unix seconds, UTC). */
        toTimestamp?: number;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<LiquidationEventListResponse, void>({
        path: `/v1/events/liquidation-events`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns raw decoded events emitted by Boros contracts. Each item includes the base envelope (`eventName`, `txHash`, `blockNumber`, `logIndex`, `eventIndex`, `blockTimestamp`, `isFinalized`) plus a `data` map carrying event-specific decoded fields. Sorted by `eventIndex` descending (newest first); `eventIndex` is a stable monotonic ordering key. Pagination is cursor-based via `resumeToken`. The `[fromBlockNumber, toBlockNumber]` filter is inclusive on both ends. `eventName` is a free-form string matching the on-chain event names (e.g. `BulkOrdersExecuted`, `Liquidate`, `Settlement`).
     *
     * @tags Miscellaneous
     * @name OnChainEventsV2ControllerGetEvents
     * @summary Get on-chain events with filters
     * @request GET:/v1/on-chain-events
     */
    onChainEventsV2ControllerGetEvents: (
      query?: {
        /**
         * Maximum number of results to return. The parameter is capped at 5000.
         * @default 10
         */
        limit?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
        /**
         * Filter by on-chain event name (free-form match — e.g. `BulkOrdersExecuted`, `Liquidate`, `Settlement`).
         * @example "BulkOrdersExecuted"
         */
        eventName?: string;
        /**
         * Filter by source contract address. Case-insensitive — value is lower-cased before lookup.
         * @example "0x8080808080dab95efed788a9214e400ba552def6"
         */
        sourceAddress?: string;
        /**
         * Inclusive lower bound on block number.
         * @min 0
         */
        fromBlockNumber?: number;
        /**
         * Inclusive upper bound on block number.
         * @min 0
         */
        toBlockNumber?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<OnChainEventsResponse, any>({
        path: `/v1/on-chain-events`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the **PENDLE-denominated maker incentive program** for a specific market. `maker` is optional — if not provided, per-maker fields stay at 0 and CU cost is 1. Supplying a `maker` triggers the per-maker lookup and the call is charged at **2 CU**.
     *
     * @tags Miscellaneous
     * @name IncentivesControllerGetMakerIncentiveCampaign
     * @summary Get maker incentive campaign for a market
     * @request GET:/v1/incentives/maker-incentives/campaigns/{marketId}
     */
    incentivesControllerGetMakerIncentiveCampaign: (
      marketId: number,
      query?: {
        /** Maker wallet address (optional). When omitted, `currentEligibleShare` and `accumulatedReward` are returned as `0`. */
        maker?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MakerIncentiveCampaignResponse, any>({
        path: `/v1/incentives/maker-incentives/campaigns/${marketId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns **AMM liquidity-provider rewards** for a single user across all Boros AMMs (PENDLE incentive emissions plus accumulated swap fees), broken down by market. `user` is optional — if not provided, aggregates are 0 and `perMarket` is empty.
     *
     * @tags Miscellaneous
     * @name IncentivesControllerGetAmmIncentives
     * @summary Get user AMM incentives
     * @request GET:/v1/incentives/amm-incentives
     */
    incentivesControllerGetAmmIncentives: (
      query?: {
        /** User wallet address (optional). When omitted, `accruedAmountInUsd` / `unclaimedAmountInUsd` are `0` and `perMarket` is empty. */
        user?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AmmIncentivesResponse, any>({
        path: `/v1/incentives/amm-incentives`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns **cross-venue spread** strategies — pairs of (long market, short market) grouped by the same `(assetSymbol, tokenId, maturity)` (i.e. identical maturity but different funding-rate venues) — that satisfy: - both markets have **> 10 days to maturity**, and - the estimated APR × max leverage (net of fees and combined margin) is strictly positive. Results are sorted by `aprTimesMaxLeverage` descending.
     *
     * @tags Miscellaneous
     * @name StrategiesV2ControllerFindStrategies
     * @summary Find funding-rate arbitrage strategies with positive `aprTimesMaxLeverage` and more than 10 days to maturity
     * @request GET:/v1/strategies
     */
    strategiesV2ControllerFindStrategies: (params: RequestParams = {}) =>
      this.request<FindStrategiesResponse, any>({
        path: `/v1/strategies`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the latest known Arbitrum One gas price (Wei + USD) and an estimated USD cost for placing a **single limit order**. Use `timestamp` to gauge staleness; numeric fields may be `null` if upstream data is unavailable.
     *
     * @tags Miscellaneous
     * @name GasPriceV2ControllerGetGasPriceInfo
     * @summary Get gas price info and order gas estimation
     * @request GET:/v1/gas-price/current
     */
    gasPriceV2ControllerGetGasPriceInfo: (params: RequestParams = {}) =>
      this.request<GasPriceInfoResponse, any>({
        path: `/v1/gas-price/current`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the trading leaderboard scoped to a single (`period`, `tokenId`) pair, **ranked by ROI** (1-based, ordinal, no ties). Data is updated daily; `snapshotTimestamp` reports the as-of time of the served snapshot. Pagination is offset-based via `limit` (default 100, max 1000) and `offset` (default 0).
     *
     * @tags Miscellaneous
     * @name LeaderboardV2ControllerGetLeaderboard
     * @summary Get leaderboard data
     * @request GET:/v1/leaderboard
     */
    leaderboardV2ControllerGetLeaderboard: (
      query: {
        /**
         * Leaderboard window. `7d` = trailing 7 calendar days, `30d` = trailing 30 calendar days, `all_time` = since genesis.
         * @example "7d"
         */
        period: "all_time" | "30d" | "7d";
        /**
         * Collateral token id the leaderboard is scoped to (one leaderboard per token). All amounts in the response are in raw base units of this token.
         * @min 1
         */
        tokenId: number;
        /**
         * Page size — number of ranked entries to return (1-1000).
         * @default 100
         * @example 100
         */
        limit?: number;
        /**
         * Number of entries to skip from the top of the ranking. Combine with `limit` for offset pagination.
         * @default 0
         * @example 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<LeaderboardResponse, any>({
        path: `/v1/leaderboard`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single (`userAddress`, `accountId`) row for the (`period`, `tokenId`) leaderboard. - If the user **is** ranked, all fields are populated including `rank` and `roi`. - If the user is **not** ranked (e.g. did not meet the minimum-capital filter), `rank` and `roi` are omitted; `pnl` and `tradingVolume` are still populated for the requested period. - If the user has no recorded activity, all amount fields return `"0"`.
     *
     * @tags Miscellaneous
     * @name LeaderboardV2ControllerSearchUser
     * @summary Check specific user in the leaderboard
     * @request GET:/v1/leaderboard/search
     */
    leaderboardV2ControllerSearchUser: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        userAddress: string;
        /**
         * Sub-account index under `root` (0–255). `0` is the main sub-account.
         * @min 0
         * @max 255
         */
        accountId: number;
        /**
         * Leaderboard window. `7d`, `30d`, or `all_time`.
         * @example "7d"
         */
        period: "all_time" | "30d" | "7d";
        /**
         * Numeric `tokenId` of the collateral asset.
         * @min 1
         */
        tokenId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserSearchResponse, any>({
        path: `/v1/leaderboard/search`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the Total Value Locked of the Boros protocol in USD, with a per-collateral-token `breakdown`.
     *
     * @tags Miscellaneous
     * @name TvlV2ControllerGetTvl
     * @summary Get protocol TVL
     * @request GET:/v1/total-value-locked
     */
    tvlV2ControllerGetTvl: (params: RequestParams = {}) =>
      this.request<TvlResponse, any>({
        path: `/v1/total-value-locked`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  calldataBuilderUserSigned = {
    /**
     * @description Generates the **unsigned** transaction the user signs to deposit collateral into a margin account. Identity is supplied via a single `marketAcc` (packs `root + accountId + tokenId + marketId`); `0xFFFFFF` in the `marketId` segment targets the **cross** account, any other value targets that **isolated** market. **Signing & submission.** This is **user-signed**, not agent-signed. Nothing is broadcast by Pendle — after signing, the user (or their wallet) submits the returned transaction directly on-chain and pays gas themselves. The user wallet is the `from` echoed in the response. **Pre-conditions.** The user wallet must hold a sufficient ERC20 allowance to the router for `amount`; the calldata itself only encodes the deposit, not the approval. If allowance is missing, `gas` may be omitted from the response (see the `gas` field). See [Glossary](https://docs.pendle.finance/boros-dev/Backend/glossary) for `marketAcc` packing details.
     *
     * @tags Calldata-Builder (User-Signed)
     * @name CalldataBuilderUserControllerBuildDeposit
     * @summary Build deposit calldata
     * @request POST:/v1/calldata-builder/user/deposit
     */
    calldataBuilderUserControllerBuildDeposit: (
      data: DepositBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<CalldataBuilderUserResponse, void>({
        path: `/v1/calldata-builder/user/deposit`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generates the **unsigned** transaction the user signs to request a withdrawal. **User-signed and user-broadcast** — Pendle does not submit this for you. **Two-step on-chain flow.** A withdrawal is `request → cooldown → finalize`. **Finalization is automatic**: a backend bot calls the finalize step on-chain after the cooldown elapses, so there is no separate finalize endpoint here. The user only signs the request. **Cross-only.** Withdrawals always exit from the **cross** account for `(root, tokenId)`. To withdraw funds that are currently sitting in an isolated market, first move them with `POST /calldata-builder/agent/cash-transfer` (`ISOLATED_TO_CROSS`). To abort before the cooldown expires, use `/cancel-withdrawal`.
     *
     * @tags Calldata-Builder (User-Signed)
     * @name CalldataBuilderUserControllerBuildRequestWithdrawal
     * @summary Build request-withdrawal calldata
     * @request POST:/v1/calldata-builder/user/request-withdrawal
     */
    calldataBuilderUserControllerBuildRequestWithdrawal: (
      data: RequestWithdrawalBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<CalldataBuilderUserResponse, void>({
        path: `/v1/calldata-builder/user/request-withdrawal`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generates the **unsigned** transaction the user signs to cancel a pending withdrawal request **before its cooldown elapses**. **User-signed and user-broadcast.** Once the cooldown finishes the backend bot will auto-finalize the withdrawal and this endpoint can no longer be used for that request.
     *
     * @tags Calldata-Builder (User-Signed)
     * @name CalldataBuilderUserControllerBuildCancelWithdrawal
     * @summary Build cancel-withdrawal calldata
     * @request POST:/v1/calldata-builder/user/cancel-withdrawal
     */
    calldataBuilderUserControllerBuildCancelWithdrawal: (
      data: CancelWithdrawalBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<CalldataBuilderUserResponse, void>({
        path: `/v1/calldata-builder/user/cancel-withdrawal`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generates the **unsigned** transaction the user signs to authorize an **agent address** to sign trading / order operations on behalf of the user. Approval auto-expires at `expiry` (unix seconds, must be in the future). This is the prerequisite for **every** endpoint under `Calldata-Builder (Agent-Executable)` — without an active approval, the agent bot cannot submit place-order, cancel, enter/exit-markets, etc. for that `(root, accountId)`. **Two submission paths** (both produce the same on-chain state — pick whichever fits the client): 1. **User submits on-chain directly.** The user (or their wallet) broadcasts the returned transaction themselves — Pendle never sees the signature. The user pays gas on the target chain. Standard path. 2. **User signs off-chain + posts to Pendle BE.** The user EIP-712-signs the payload with their wallet and posts the signed blob via `POST /v1/agents/approve-agent` (the auth/agents endpoint, not this builder); Pendle then submits the on-chain tx for them via the backend bot. Useful when the user does not hold native gas on the target chain. See the [Agent Trading guide](https://docs.pendle.finance/boros-dev/Backend/agent) for the full lifecycle and revocation rules.
     *
     * @tags Calldata-Builder (User-Signed)
     * @name CalldataBuilderUserControllerBuildApproveAgent
     * @summary Build approve-agent calldata
     * @request POST:/v1/calldata-builder/user/approve-agent
     */
    calldataBuilderUserControllerBuildApproveAgent: (
      data: ApproveAgentBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<CalldataBuilderUserResponse, void>({
        path: `/v1/calldata-builder/user/approve-agent`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generates the **unsigned** transaction the user signs to revoke a previously approved agent before its `expiry`. **User-signed and user-broadcast** (or sent through the off-chain approve-agent path the same way as `/approve-agent`). Once mined, all future agent-signed calls under this `(root, accountId, agentAddress)` triple revert on-chain. See the [Agent Trading guide](https://docs.pendle.finance/boros-dev/Backend/agent) for revocation semantics.
     *
     * @tags Calldata-Builder (User-Signed)
     * @name CalldataBuilderUserControllerBuildRevokeAgent
     * @summary Build revoke-agent calldata
     * @request POST:/v1/calldata-builder/user/revoke-agent
     */
    calldataBuilderUserControllerBuildRevokeAgent: (
      data: RevokeAgentBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<CalldataBuilderUserResponse, void>({
        path: `/v1/calldata-builder/user/revoke-agent`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generates the **unsigned** transaction the user (or their vault contract) signs to pay treasury fees **directly from the wallet**, bypassing the agent flow used by `POST /calldata-builder/agent/pay-treasury`. **User-signed and user-broadcast** — useful for vaults / smart-contract wallets that do not delegate to an agent. **Side effect on the backend (off-chain, post-tx):** identical to `agent/pay-treasury` — once the tx is mined, the backend credits the equivalent USD value to the user's **off-chain gas budget**, which funds future agent-submitted transactions. Treasury accrual itself is a real on-chain fee payment ([Fees mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Fees)). `amount` is in the paying token's **native decimals** — look up `decimals` from `/open-api-v2/v1/assets`.
     *
     * @tags Calldata-Builder (User-Signed)
     * @name CalldataBuilderUserControllerBuildVaultPayTreasury
     * @summary Build vault-pay-treasury calldata (tops up the user's off-chain gas budget)
     * @request POST:/v1/calldata-builder/user/vault-pay-treasury
     */
    calldataBuilderUserControllerBuildVaultPayTreasury: (
      data: VaultPayTreasuryBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<CalldataBuilderUserResponse, void>({
        path: `/v1/calldata-builder/user/vault-pay-treasury`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  calldataBuilderAgentExecutable = {
    /**
     * @description Generate **agent-executable** calldata for a single order using the UI-style parameter set (`rate` + `slippage`). Targets the common case: a trader places one order on one market. **Submission.** The returned `calls[0].calldata` is signed by the **agent** (not the user), and the agent (typically a Pendle backend bot) submits it on-chain via `POST /v1/agent/send-transactions`. Gas is **not** paid in native ETH/etc. — it is debited from the user's **off-chain gas budget** (top up via `pay-treasury`). The user must have a non-expired agent approval first (see `/calldata-builder/user/approve-agent`). **Pre-conditions.** For a market the account has not held a position on yet, `enter-markets` must succeed before the order can match. Min-order-value is enforced server-side per market. For advanced / market-making flows that need raw `limitTick`, absolute `desiredRate`, or many orders across markets in one request, use POST `/place-orders`. Returns a `resolved` block echoing the exact tick / rate actually encoded so the UI can show the user before they sign. See [Order Book mechanics](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook) for tick/rate semantics, [Margin](https://docs.pendle.finance/boros-dev/Mechanics/Margin) for IM / leverage, and [Fees](https://docs.pendle.finance/boros-dev/Mechanics/Fees) for taker-fee mechanics.
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildPlaceOrder
     * @summary Build place-order calldata (simple, UI-style)
     * @request POST:/v1/calldata-builder/agent/place-order
     */
    calldataBuilderAgentControllerBuildPlaceOrder: (
      data: PlaceOrderSimpleBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<PlaceOrdersResponse, void>({
        path: `/v1/calldata-builder/agent/place-order`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description **Advanced use case.** Build **agent-executable** calldata for a heterogeneous batch of order requests in one HTTP call. Primary target is **market-making / liquidity-provisioning** flows that need to place many resting orders across tick levels and/or markets at once. **Submission.** Each entry of the response `calls[]` is one **agent-signed** on-chain call — the agent (typically a Pendle backend bot) submits them in order via `POST /v1/agent/send-transactions`. Gas is debited from the user's **off-chain gas budget**, not paid in native token. An active agent approval is required (see `/calldata-builder/user/approve-agent`). Each entry in `orderRequests[]` is exactly one of: - `singleOrder` — compiles to one on-chain `placeSingleOrder` call. Carries its own `marketAcc`, `ammId`, limit price and execution guard. Power-user controls: raw `limitTick` XOR human-friendly `rate`, absolute `desiredRate` XOR relative `slippage` (**exactly one** required), optional `preCancelOrderId` (atomic strict cancel-and-replace). - `bulkOrders` — compiles to one on-chain `bulkOrders` multicall covering N per-market sub-orders. Each `bulks[i]` carries its own `marketId`, `cancelData` (orders to atomically cancel before placing), `orders` (shared `side`/`tif`, per-order `size`/`limitTick`), and `desiredRate` XOR `slippage`. Request order is preserved in the response — `calls[i]` corresponds to `orderRequests[i]`. Cost: **one on-chain call per `orderRequests[]` entry**. **CU cost.** Dynamic: **1 CU per 10 entries** (e.g. `orderRequests.length=10` → 1 CU, `length=100` → 10 CU). **Constraints.** All entries execute under the same `(root, accountId)` — one agent signature covers the whole batch. Entries may freely target different markets. `enter-markets` must already cover every targeted market for the account. For the common single-order UI case, prefer POST `/place-order` — simpler DTO, no power-user knobs. See [Order Book](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook) for tick semantics and [Best Practices](https://docs.pendle.finance/boros-dev/Backend/best-practices) for batching tips.
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildPlaceOrders
     * @summary Build place-orders calldata (advanced, liquidity-provisioning batch)
     * @request POST:/v1/calldata-builder/agent/place-orders
     */
    calldataBuilderAgentControllerBuildPlaceOrders: (
      data: PlaceOrdersBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<PlaceOrdersResponse, void>({
        path: `/v1/calldata-builder/agent/place-orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate **agent-executable** calldata to cancel resting orders across one or more markets. **One on-chain `bulkCancels` call per `markets[]` entry** — the response has N `calls` for N markets, each individually agent-signed and submitted via `POST /v1/agent/send-transactions`. Per-entry: set `cancelAll: true` to cancel every resting order on that `(marketAcc, marketId)`, or `cancelAll: false` + `orderIds: ["123", "456", ...]` to target specific ids. Cancels are emitted in **non-strict** mode here — ids already filled or already cancelled are skipped silently and the other entries still go through. For **strict** atomic cancel-then-place (revert if the cancel cannot be honored), use `preCancelOrderId` on `/place-order` / `/place-orders` or the per-bulk `cancelData.isStrict` inside `bulkOrders`.
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildCancelOrders
     * @summary Build cancel-orders calldata (multi-market)
     * @request POST:/v1/calldata-builder/agent/cancel-orders
     */
    calldataBuilderAgentControllerBuildCancelOrders: (
      data: CancelOrdersBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<AgentCalldataResponse, void>({
        path: `/v1/calldata-builder/agent/cancel-orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate **agent-executable** calldata to move cash between the user's cross account and the isolated account on a specific market. Direction is explicit (`CROSS_TO_ISOLATED` or `ISOLATED_TO_CROSS`); `amount` is always positive — the backend applies the sign off-chain from `direction` before encoding `signedAmount` into the call. The corresponding cross leg is implicit — there is exactly one cross account per `(root, accountId, tokenId)`, derived from the market's `tokenId`. Clients only specify the isolated leg's `marketId`. **Common reason to call this:** to withdraw funds locked in an isolated market — first move them back to cross via `ISOLATED_TO_CROSS`, then call `/calldata-builder/user/request-withdrawal`. **One on-chain call** per request. See [Margin](https://docs.pendle.finance/boros-dev/Mechanics/Margin) for cross vs isolated semantics.
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildCashTransfer
     * @summary Build cash-transfer calldata (cross ⇄ isolated)
     * @request POST:/v1/calldata-builder/agent/cash-transfer
     */
    calldataBuilderAgentControllerBuildCashTransfer: (
      data: CashTransferBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<AgentCalldataResponse, void>({
        path: `/v1/calldata-builder/agent/cash-transfer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate **agent-executable** calldata to opt the account into the given markets. **Required prerequisite** before that `(root, accountId)` can place orders / hold positions on a market it has not previously entered. **One on-chain call** per request. - **Cross** (`isCross: true`, default): `marketIds` may list multiple markets in one call — they all get entered atomically against the cross account for `(root, accountId, tokenId)`. - **Isolated** (`isCross: false`): `marketIds` must have length **1** — an isolated account is pinned to a single market. Entering charges a one-time per-market `marketEntranceFee` from the account; pre-fund accordingly. See [Margin](https://docs.pendle.finance/boros-dev/Mechanics/Margin).
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildEnterMarkets
     * @summary Build enter-markets calldata
     * @request POST:/v1/calldata-builder/agent/enter-markets
     */
    calldataBuilderAgentControllerBuildEnterMarkets: (
      data: EnterExitMarketsBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<AgentCalldataResponse, void>({
        path: `/v1/calldata-builder/agent/enter-markets`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate **agent-executable** calldata to opt the account out of the given markets. The account must hold no open positions / open orders on a market for the exit to succeed on-chain. **One on-chain call** per request. - **Cross** (`isCross: true`, default): `marketIds` may list multiple markets in one call. - **Isolated** (`isCross: false`): `marketIds` must have length **1**.
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildExitMarkets
     * @summary Build exit-markets calldata
     * @request POST:/v1/calldata-builder/agent/exit-markets
     */
    calldataBuilderAgentControllerBuildExitMarkets: (
      data: EnterExitMarketsBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<AgentCalldataResponse, void>({
        path: `/v1/calldata-builder/agent/exit-markets`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate **agent-executable** calldata to pay treasury fees on a specific market. `amount` is a bigint string in the paying token's **native decimals** (no USD conversion at this endpoint — look up `decimals` from `/open-api-v2/v1/assets`). **One on-chain call** per request. **Side effect on the backend (off-chain, post-tx):** once the on-chain tx is mined, the backend credits the equivalent **USD** value to the user's **off-chain gas budget**. That budget funds subsequent agent-signed transactions (place-order, enter-markets, cancel-orders, …) that the Pendle backend bot wallet submits on the user's behalf — users do **not** pay native ETH/etc. for agent-submitted txs. Paying treasury is the canonical way to top up gas for ongoing agent-driven activity. If the user instead wants to pay treasury directly from their wallet (e.g. vault contracts that don't delegate to an agent), use `POST /calldata-builder/user/vault-pay-treasury`. See [Fees mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Fees) and the [Agent Trading guide](https://docs.pendle.finance/boros-dev/Backend/agent).
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildPayTreasury
     * @summary Build pay-treasury calldata (tops up the user's off-chain gas budget)
     * @request POST:/v1/calldata-builder/agent/pay-treasury
     */
    calldataBuilderAgentControllerBuildPayTreasury: (
      data: PayTreasuryBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<AgentCalldataResponse, void>({
        path: `/v1/calldata-builder/agent/pay-treasury`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate **agent-executable** calldata for depositing cash into a market's AMM pool as **single-sided liquidity** (cash only — the AMM auto-balances by taking the matching swap leg internally). Cash is sourced from the user's **cross** account on the market's `tokenId`. **Returned `executeParams[]` is a 2-call sequence**: an `ammCashTransfer` that pulls cash from the cross account into the AMM-account leg (its `cashIn` already includes any one-time `marketEntranceFee` if the AMM account has not yet entered the market), followed by the `addLiquiditySingleCashToAmm` call. The agent must submit the entries in order via `POST /v1/agent/send-transactions`. `minLpOut` is the slippage guard on LP tokens received — set conservatively. The desired-swap-rate guard for the AMM's internal balancing is computed by the backend from the current mid-rate.
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildAddLiquidityToAmm
     * @summary Build add-liquidity-to-amm calldata (single-cash deposit)
     * @request POST:/v1/calldata-builder/agent/add-liquidity-to-amm
     */
    calldataBuilderAgentControllerBuildAddLiquidityToAmm: (
      data: AddLiquidityToAmmAgentBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<BulkAgentExecuteParamsResponseV2, void>({
        path: `/v1/calldata-builder/agent/add-liquidity-to-amm`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generate **agent-executable** calldata for burning LP tokens from a market's AMM and receiving **cash** back into the user's **cross** account on the market's `tokenId`. **Returned `executeParams[]` is a 2-call sequence**: `removeLiquiditySingleCashFromAmm` (burn LP, internally settles a swap leg against the AMM's mid-rate) followed by `ammCashTransfer` that sweeps the resulting cash from the AMM account back into the user's cross account. The agent must submit them in order via `POST /v1/agent/send-transactions`. `minCashOut` is the slippage guard on the cash received — set conservatively.
     *
     * @tags Calldata-Builder (Agent-Executable)
     * @name CalldataBuilderAgentControllerBuildRemoveLiquidityFromAmm
     * @summary Build remove-liquidity-from-amm calldata (single-cash withdrawal)
     * @request POST:/v1/calldata-builder/agent/remove-liquidity-from-amm
     */
    calldataBuilderAgentControllerBuildRemoveLiquidityFromAmm: (
      data: RemoveLiquidityFromAmmAgentBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<BulkAgentExecuteParamsResponseV2, void>({
        path: `/v1/calldata-builder/agent/remove-liquidity-from-amm`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  simulations = {
    /**
     * @description Simulates depositing collateral from a wallet into an isolated or cross margin account. **Preview-only counterpart** to `POST /calldata-builder/user/deposit` — same `marketAcc` + `amount` body, no signing. `0xFFFFFF` in the `marketAcc` marketId segment targets the cross account; any other value targets that isolated market. Returns the projected `collateralBalance` / `maintenanceMargin` / `marginRatio` pre and post deposit, plus `minReceived` (the deposit scaled into the 18-decimal cash accounting unit). The simulator does **not** check the wallet's on-chain balance — it assumes the deposit succeeds. See [Margin mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Margin) for how `marginRatio` is computed.
     *
     * @tags Simulations
     * @name SimulationsControllerSimulateDeposit
     * @summary Deposit collateral to isolated/cross margin account
     * @request POST:/v1/simulations/deposit
     */
    simulationsControllerSimulateDeposit: (
      data: DepositSimulationBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<DepositSimulationResponse, void>({
        path: `/v1/simulations/deposit`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Previews the margin state change that a withdrawal request would produce on the user's **cross** account. **Preview-only counterpart** to `POST /calldata-builder/user/request-withdrawal`; isolated balances must be moved to cross via `cash-transfer` first. **Unit caveat:** unlike the calldata-builder body, the simulation `amount` is in the **18-decimal cash accounting unit** (the unit `collateralBalance` is reported in), not the token's native decimals. The simulator returns `preUserState` / `postUserState` only — it does not enforce the on-chain liveness or available-margin guards (see [Margin mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Margin)).
     *
     * @tags Simulations
     * @name SimulationsControllerSimulateRequestWithdrawal
     * @summary Request withdrawal of collateral
     * @request POST:/v1/simulations/request-withdrawal
     */
    simulationsControllerSimulateRequestWithdrawal: (
      data: RequestWithdrawalSimulationBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<WithdrawSimulationResponse, void>({
        path: `/v1/simulations/request-withdrawal`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Previews a cross ⇄ isolated cash transfer and returns the pre/post `collateralBalance` / `maintenanceMargin` / `marginRatio` of **both** legs. **Preview-only counterpart** to `POST /calldata-builder/agent/cash-transfer` — uses the same `marketId` + `direction` + `amount` trio. The user context (`root` + optional `accountId`) is supplied explicitly here because simulations have no agent signature to read it from. `amount` is in 10^18 cash units — same as the calldata endpoint.
     *
     * @tags Simulations
     * @name SimulationsControllerSimulateCashTransfer
     * @summary Cash transfer
     * @request POST:/v1/simulations/cash-transfer
     */
    simulationsControllerSimulateCashTransfer: (
      data: CashTransferSimulationBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<CashTransferSimulationResponseV2, void>({
        path: `/v1/simulations/cash-transfer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description **Preview-only counterpart** to `POST /calldata-builder/agent/place-order` — submit the same body here to preview, and to the calldata endpoint to build a signed transaction. The two surfaces intentionally share one DTO (`rate` + `slippage` + `ammId`, no raw `limitTick` / `desiredRate`). `rate` is required for limit orders (`GTC` / `ALO` / `SOFT_ALO`); optional for `FOK` / `IOC` market orders. `slippage` is optional but strongly recommended for market orders — a default is applied when omitted. The simulator handles market entrance automatically — it does **not** require the account to have already entered the market. See [Margin mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Margin) and [Order book mechanics](https://docs.pendle.finance/boros-dev/Mechanics/OrderBook).
     *
     * @tags Simulations
     * @name SimulationsControllerSimulatePlaceOrder
     * @summary Place order (simple, UI-style)
     * @request POST:/v1/simulations/place-order
     */
    simulationsControllerSimulatePlaceOrder: (
      data: PlaceOrderSimulationBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<PlaceOrderSimulationResponseV3, void>({
        path: `/v1/simulations/place-order`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description **Fee-only preview** counterpart to `POST /calldata-builder/agent/add-liquidity-to-amm` — uses the same `root` / `accountId` / `marketId` / `netCashIn` body. The simulator runs the full add-liquidity flow on a forked state to compute fees but only the fee breakdown is exposed publicly: `marketEntranceFee` (charged once when the account first enters this market) + `vaultDepositFee`. Fuller state projections (projected margin, matched sizes, LP out, post-deposit margin ratio) are intentionally not part of the public simulation surface. Funds are assumed to be available in the cross account; the simulator does not pre-check the caller's cross balance.
     *
     * @tags Simulations
     * @name SimulationsControllerSimulateAddLiquidityToAmm
     * @summary Add liquidity to AMM — fee preview (single-cash)
     * @request POST:/v1/simulations/add-liquidity-to-amm
     */
    simulationsControllerSimulateAddLiquidityToAmm: (
      data: AddLiquidityToAmmV2SimulationBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<AddLiquidityToAmmFeeSimulationResponse, void>({
        path: `/v1/simulations/add-liquidity-to-amm`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description **Fee-only preview** counterpart to `POST /calldata-builder/agent/remove-liquidity-from-amm` — uses the same `root` / `accountId` / `marketId` / `lpToRemove` body. Only `feeBreakdown.vaultWithdrawalFee` is exposed; fuller state projections (cash out, post-burn margin ratio) are intentionally not part of the public simulation surface. The simulator assumes the AMM sub-account holds at least `lpToRemove` LP — it does not pre-check the balance.
     *
     * @tags Simulations
     * @name SimulationsControllerSimulateRemoveLiquidityFromAmm
     * @summary Remove liquidity from AMM — fee preview (single-cash)
     * @request POST:/v1/simulations/remove-liquidity-from-amm
     */
    simulationsControllerSimulateRemoveLiquidityFromAmm: (
      data: RemoveLiquidityFromAmmV2SimulationBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<RemoveLiquidityFromAmmFeeSimulationResponse, void>({
        path: `/v1/simulations/remove-liquidity-from-amm`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  accounts = {
    /**
     * @description Returns the list of AMMs (LP vaults) the **sub-account** has active deposits in, with per-vault user data only. Each entry tells you how much LP this `(root, accountId)` holds in a given `(ammId, marketId, tokenId)` vault, the average LP price the user paid, and the wallet's currently available balance of the vault's collateral token. **Identity.** Takes the 44-char `account` handle (`root` + `accountId`), **not** a `marketAcc` — LP positions are not pinned to a single market. Use `/v1/market-acc/encode` for the trading-side handle and a hex-concat helper for this one. **Note.** Does not return global vault state (TVL, supply, fees). For that, see the dedicated AMM endpoints.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetUserAmmStates
     * @summary Get user AMM states
     * @request GET:/v1/accounts/amm-states
     */
    accountsV2ControllerGetUserAmmStates: (
      query: {
        /** Packed 44-character account hex (`0x` + 21 bytes): `root` (20B) · `accountId` (1B). Identifies a sub-account without a market binding. */
        account: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserVaultStatesResponse, any>({
        path: `/v1/accounts/amm-states`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the **wallet-level** gas balance (USD) for the specified `root`. Gas balance pays the per-action fee charged when a Pendle bot relays the user's agent-signed transactions on-chain (order placement/cancellation, cash transfer, AMM add/remove liquidity, enter/exit markets, conditional-order execution, pay-treasury, collateral swap). It is **not** the EVM gas of the underlying chain and is not segregated per `accountId` or per `marketAcc` — every sub-account under the same `root` draws from this single bucket. Top up via the `pay-treasury` calldata endpoints (`/calldata-builder/agent/pay-treasury` or `/calldata-builder/user/vault-pay-treasury`) — the backend credits the equivalent USD value to this budget once the on-chain tx is mined. Funded with a collateral ERC-20, **not** the chain-native gas token.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetAccountGasBalance
     * @summary Get account gas balance
     * @request GET:/v1/accounts/gas-balance
     */
    accountsV2ControllerGetAccountGasBalance: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AccountGasBalanceResponse, void>({
        path: `/v1/accounts/gas-balance`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the per-action gas-fee debits charged to the wallet-level gas balance, in USD. One row per chargeable relayed event (e.g. order placement/cancellation, cash transfer, AMM add/remove liquidity, enter/exit markets, conditional-order execution, pay-treasury, collateral swap). **Wallet-level**: filtered by `root` only — covers every sub-account under that wallet. **Pagination.** Cursor-based: pass the previous response's `resumeToken` for the next page. Sorted by event index descending (newest first). `resumeToken` is `null` when the page is the last one. **Cost.** `1 + ceil(limit / 200) - 1` CU.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetGasConsumptionHistory
     * @summary Get gas consumption history
     * @request GET:/v1/accounts/gas-consumption-history
     */
    accountsV2ControllerGetGasConsumptionHistory: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GasConsumptionHistoryV2RootResponse, void>({
        path: `/v1/accounts/gas-consumption-history`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the **collateral-balance** movement log for a sub-account: external deposits, external withdrawals, and **internal** transfers between fund locations (cross account, isolated markets, vaults, pending-withdrawal queue). One row per movement. Filter by `root + accountId` (required) and optionally by `tokenId`. **Pagination.** Cursor-based, sorted by event index descending. Pass the previous `resumeToken` to fetch the next page; `null` when exhausted. Pair `fromFundLocation` / `toFundLocation` to classify the movement (e.g. `WALLET → CROSS` = deposit, `ISOLATED → WALLET` = withdrawal, `CROSS → ISOLATED` = internal cash transfer).
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetTransferLogs
     * @summary Get transfer logs
     * @request GET:/v1/accounts/transfer-logs
     */
    accountsV2ControllerGetTransferLogs: (
      query: {
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Sub-account index under `root` (0–255). `0` is the main sub-account.
         * @min 0
         * @max 255
         * @default 0
         */
        accountId?: number;
        /**
         * Optional collateral-token filter. The numeric `tokenId` of the asset (see `/v1/assets`). Omit to return movements for every token in the sub-account.
         * @min 1
         */
        tokenId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TransferLogsV2Response, void>({
        path: `/v1/accounts/transfer-logs`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the sub-account's orders (both resting limit orders and historical market orders that swept the book) sorted by **last-updated** event index descending. Filter by `root + accountId` (required), `marketId`, `isActive`, and one or more `orderType`s. **Pagination caveat — read first.** The cursor advances on `eventIndex`, which is mutated whenever an order is filled, partially-filled, or cancelled. If an order is updated **after** it has already been returned in a previous page, paginating to the end of the dataset may silently miss or duplicate it. **Use `/v1/accounts/orders-by-placed-time` for any full-history scan / indexing job** — it sorts by the immutable placed-time index. This endpoint is appropriate for UIs showing recent activity. See [`/v2/accounts/limit-orders`](https://docs.pendle.finance/boros-dev/Backend/api#which-limit-orders-endpoint-to-use) for the same trade-off written up in the dev docs.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetOrders
     * @summary Get orders (cursor-based pagination, sorted by last-updated)
     * @request GET:/v1/accounts/orders
     */
    accountsV2ControllerGetOrders: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Sub-account index under `root` (0–255). `0` is the main sub-account.
         * @min 0
         * @max 255
         * @default 0
         */
        accountId?: number;
        /**
         * Optional market filter. Omit to return orders across every market the sub-account has touched.
         * @min 1
         */
        marketId?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
        /**
         * `true` → only currently-resting orders (status = filling). `false` → only finalised orders (filled, cancelled, expired). Omit to return both.
         * @example true
         */
        isActive?: boolean;
        /** OrderType { LIMIT : 0, MARKET : 1, TAKE_PROFIT_MARKET : 2, STOP_LOSS_MARKET : 3 }. Comma-separated for multiple values (e.g., "0,1,2,3"). Filters by **order kind** — `MARKET` orders sweep the book and never rest, the others (LIMIT / TP_MARKET / SL_MARKET) rest until matched, cancelled, or triggered. Time-In-Force (GTC / IOC / FOK / POST_ONLY) is a separate concept set at order placement. */
        orderType?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LimitOrdersV2Response, void>({
        path: `/v1/accounts/orders`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns **every** orderbook order (limit + market, every status) ever placed by the sub-account, sorted by `placedEventIndex` descending. Because `placedEventIndex` is set when the order is placed and never mutated thereafter, **iterating to the end of the cursor is guaranteed to yield each order exactly once** — regardless of fills, cancels, or expirations happening mid-pagination. **Use this for syncing/indexing jobs.** For UIs that just need to render recent activity, `/v1/accounts/orders` is cheaper because it can be filtered by `marketId` / `isActive` / `orderType`. **No filters.** Only `root` and `accountId` are honored — by design.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetOrdersByPlacedTime
     * @summary Get orders by placed time (cursor-based pagination, placed-index descending)
     * @request GET:/v1/accounts/orders-by-placed-time
     */
    accountsV2ControllerGetOrdersByPlacedTime: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Sub-account index under `root` (0–255). `0` is the main sub-account.
         * @min 0
         * @max 255
         * @default 0
         */
        accountId?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<LimitOrdersV2Response, void>({
        path: `/v1/accounts/orders-by-placed-time`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns every on-chain event that moved this position's size or cost basis on a specific `(marketAcc, marketId)` pair: market-order fills, limit-order fills (maker side), and liquidations. Each row carries pre/post position state (`prevPositionS/F`, `postPositionS/F`) and the realised PnL booked at that event. **Identity.** Both `marketAcc` **and** `marketId` are required. For an isolated `marketAcc` they will match, but for a **cross** `marketAcc` (the one whose embedded marketId is `0xFFFFFF`) the `marketId` query param is what disambiguates the per-market position. Use `/v1/market-acc/encode` to construct `marketAcc`. **Pagination.** Cursor-based, sorted by event index descending. `fromBlockNumber` / `toBlockNumber` narrow the time range; `isLimitOrderTrade=true` filters to maker fills only.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetPositionUpdateEvents
     * @summary Get position-update events (cursor-based pagination)
     * @request GET:/v1/accounts/position-update-events
     */
    accountsV2ControllerGetPositionUpdateEvents: (
      query: {
        /** Fully-packed 54-character `marketAcc` handle (cross or isolated). Build via `/v1/market-acc/encode`. */
        marketAcc: string;
        /**
         * Numeric market id of the position. **Required even for isolated `marketAcc`s** (must equal the embedded marketId). For cross `marketAcc`s, this disambiguates which per-market position to pull events for.
         * @min 1
         */
        marketId: number;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
        /**
         * Inclusive lower bound on block number.
         * @min 0
         */
        fromBlockNumber?: number;
        /**
         * Inclusive upper bound on block number.
         * @min 0
         */
        toBlockNumber?: number;
        /** When `true`, returns only events where this `marketAcc` filled as the **maker** (its resting limit order was hit). When `false`, returns only **taker** fills. Omit to get both. */
        isLimitOrderTrade?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<TransactionsV2Response, void>({
        path: `/v1/accounts/position-update-events`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns periodic funding-rate **settlement events** for the sub-account, optionally narrowed to a single `marketId`. A settlement is the on-chain event where a position's accrued floating-vs-fixed differential is realised into cash; it is independent of fills. **Identity.** Filter by `root + accountId` (required) plus optional `marketId`. **No `marketAcc` is needed** — settlements are queried by sub-account because cross/isolated positions on the same `(root, accountId, marketId)` settle on the same schedule. **Pagination.** Cursor-based, sorted by event index descending. See [Settlement mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Settlement) for the math.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetSettlementEvents
     * @summary Get settlement events (cursor-based pagination)
     * @request GET:/v1/accounts/settlement-events
     */
    accountsV2ControllerGetSettlementEvents: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Sub-account index under `root` (0–255). `0` is the main sub-account.
         * @min 0
         * @max 255
         * @default 0
         */
        accountId?: number;
        /**
         * Optional market filter. Omit to return settlements across every market the sub-account has positions in.
         * @min 1
         */
        marketId?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
        /**
         * Maximum number of results to return. The parameter is capped at 2000.
         * @default 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SettlementsV2Response, void>({
        path: `/v1/accounts/settlement-events`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Batch lookup of full margin-account state for up to **100** `marketAcc` handles in one call. **Identity.** Pass each handle as the **fully-packed 26-byte `marketAcc`** (use `/v1/market-acc/encode` to build it). For a cross account, embed `0xFFFFFF` as `marketId`; for isolated, embed the actual `marketId`. The two views return distinct slices of the same underlying balances — request both if you need both. **Cost.** Dynamic: **1 CU per 10 `marketAcc` handles** (e.g. `length=10` → 1 CU, `length=100` → 10 CU). See [Margin mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Margin#health-ratio) for IM / MM / health-ratio formulas.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetMarketAccInfos
     * @summary Get market acc infos by marketAccs
     * @request POST:/v1/accounts/market-acc-infos
     */
    accountsV2ControllerGetMarketAccInfos: (
      data: GetMarketAccInfosV2Dto,
      params: RequestParams = {},
    ) =>
      this.request<MarketAccInfosResponse, void>({
        path: `/v1/accounts/market-acc-infos`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns full margin-account state for every funded `marketAcc` under `(root, accountId = 0)` — the main sub-account's cross handle plus each isolated handle holding non-zero collateral. **Only `accountId = 0` is enumerated; non-zero sub-accounts are not returned.** Useful to discover dust accounts on the main sub-account without knowing the `(tokenId, marketId)` triples up front. Each entry has the same shape as `/v1/accounts/market-acc-infos`: `totalCash`, `netBalance`, `positions[]`, IM/MM, etc. A `marketAcc` with non-zero collateral but no open positions will show `positions: []` and `netBalance == totalCash`. **Cost.** Flat **5** CU regardless of how many funded `marketAcc`s are returned.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetMarketAccInfosByRoot
     * @summary Get market acc infos by root
     * @request GET:/v1/accounts/market-acc-infos-by-root
     */
    accountsV2ControllerGetMarketAccInfosByRoot: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<MarketAccInfosResponse, void>({
        path: `/v1/accounts/market-acc-infos-by-root`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns every position with **non-zero signed size** belonging to the sub-account, across both its cross `marketAcc` and any isolated `marketAcc`s, each enriched with a per-position PnL summary. **Identity.** Filter by `root + accountId` (the sub-account); positions across **all** entered markets and isolated accounts are returned in one call. Use this to populate a portfolio view in a single request. **"Active" vs "entered".** A market is *active* iff the user holds a non-zero position there. A market is *entered* (returned by `/v1/accounts/entered-markets`) iff the user has called `enterMarket` on a cross account; an entered market with zero size will not appear here. See [Margin mechanics](https://docs.pendle.finance/boros-dev/Mechanics/Margin) for why entering is required for cross.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetActivePositions
     * @summary Get active positions (with PnL summary)
     * @request GET:/v1/accounts/active-positions
     */
    accountsV2ControllerGetActivePositions: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Sub-account index under `root` (0–255). `0` is the main sub-account.
         * @min 0
         * @max 255
         * @default 0
         */
        accountId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ActivePositionsWithPnlResponse, void>({
        path: `/v1/accounts/active-positions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns every market the **cross** `marketAcc` has called `enterMarket` on and has not yet exited. **Cross-only**: entering a market is the on-chain bookkeeping step that lets a cross account use that market's PnL toward its shared margin pool — it is a prerequisite for trading on a market in cross mode. Isolated `marketAcc`s do not need to enter markets, so calling this on an isolated handle returns an empty list. **Identity.** Pass the fully-packed cross `marketAcc` (with `marketId = 0xFFFFFF`). Use `/v1/market-acc/encode` to build it. **Entered ≠ active.** A market may be entered but currently flat (no position). Use `/v1/accounts/active-positions` for the dual view filtered to non-zero size.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetEnteredMarkets
     * @summary Get entered markets for a cross market account
     * @request GET:/v1/accounts/entered-markets
     */
    accountsV2ControllerGetEnteredMarkets: (
      query: {
        /** Fully-packed 54-character cross `marketAcc` (i.e. embedded `marketId = 0xFFFFFF`). Build via `/v1/market-acc/encode` with `marketId` omitted. Passing an isolated `marketAcc` is allowed but returns an empty list. */
        marketAcc: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EnteredMarketsResponse, void>({
        path: `/v1/accounts/entered-markets`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the most recent per-event diffs live feed. Only for premium users.
     *
     * @tags Accounts
     * @name AccountsV2ControllerGetLightEventFeed
     * @summary Get fast-sync live-feed event diffs (premium-only, last 1 hour)
     * @request GET:/v1/accounts/light-event-feed
     */
    accountsV2ControllerGetLightEventFeed: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Maximum number of results to return. The parameter is capped at 1000.
         * @default 10
         */
        limit?: number;
        /** Resume token for cursor-based pagination. Pass the resumeToken from the previous response to fetch the next page. */
        resumeToken?: string;
        /**
         * Filter to events that carry a `position` change
         * @default false
         */
        onlyPositionChange?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<LightEventFeedResponse, void>({
        path: `/v1/accounts/light-event-feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  agents = {
    /**
     * @description Reads the on-chain expiry of a specific (`root`, `accountId`, `agentAddress`) tuple. Agents are externally-controlled addresses that the user has approved to submit non-sensitive trading actions (place/cancel orders, etc.) on behalf of a margin account. - **`expiryTime`** is the Unix-seconds (UTC) deadline after which the agent's signed actions will be rejected. - **`expiryTime == 0`** means the agent has never been approved (or has been explicitly revoked). - **`expiryTime <= now`** means the approval has lapsed. To refresh an expiring agent, the user must submit a new on-chain approval; the next call will then reflect the new expiry. See [Agent Trading guide](https://docs.pendle.finance/boros-dev/Backend/agent) for the full agent lifecycle.
     *
     * @tags Agents
     * @name AgentsV2ControllerGetAgentExpiryTime
     * @summary Get agent expiry time
     * @request GET:/v1/agents/expiry-time
     */
    agentsV2ControllerGetAgentExpiryTime: (
      query: {
        /** User wallet address — the `root` of the margin account. */
        root: string;
        /**
         * Sub-account index under `root` (0–255). `0` is the main sub-account.
         * @min 0
         * @max 255
         * @default 0
         */
        accountId?: number;
        /** Address of the agent whose expiry is being looked up. */
        agentAddress: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<AgentExpiryTimeResponse, void>({
        path: `/v1/agents/expiry-time`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  sendTxs = {
    /**
     * @description Submit one or more calldatas, each accompanied by the agent's EIP-712 signature, to be executed on-chain via the Router. Mirrors send-txs-bot's regular-agent /v3/agent/bulk-direct-call: returns a per-call `TxResponse[]` in the SAME order as the input, with on-chain status decoded from the receipt. Gas balance is charged up front via the shared GasTrackingService — submission throws BadRequestException if the signer is below the gas-balance floor.
     *
     * @tags Send-Txs
     * @name SendTxsControllerBulkCalls
     * @summary Submit agent-signed calls
     * @request POST:/v1/send-txs/bulk-calls
     */
    sendTxsControllerBulkCalls: (
      data: BulkAgentExecuteDto,
      params: RequestParams = {},
    ) =>
      this.request<TxResponse[], void>({
        path: `/v1/send-txs/bulk-calls`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Approve an agent wallet to act on behalf of a user account. Calldata must encode the Router.approveAgent function. The endpoint validates the function selector to prevent gas-balance bypass attacks. Free action — the user is not charged gas balance; the bot wallet pays the on-chain gas. Mirrors send-txs-bot's /v1/agent/approve.
     *
     * @tags Send-Txs
     * @name SendTxsControllerApprove
     * @summary Approve an agent
     * @request POST:/v1/send-txs/approve
     */
    sendTxsControllerApprove: (
      data: ApproveAgentQueryDto,
      params: RequestParams = {},
    ) =>
      this.request<ApproveAgentResponse, void>({
        path: `/v1/send-txs/approve`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the tracked status of the submission the given (agent, nonce) was sent in: HAVENT_SEEN, PROCESSING, PROCESSED (with `result` shaped like a single /bulk-calls `TxResponse` for that nonce — currently carrying just the on-chain txHash; use /tx-status with that hash for full per-call status), or SEND_FAILED. PROCESSING means the bot is mid-send — clients should poll this endpoint themselves if they need to wait for it to resolve.
     *
     * @tags Send-Txs
     * @name SendTxsControllerTrace
     * @summary Trace a (agent, nonce) submission
     * @request POST:/v1/send-txs/trace
     */
    sendTxsControllerTrace: (data: TraceQueryDto, params: RequestParams = {}) =>
      this.request<TraceResponse, any>({
        path: `/v1/send-txs/trace`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the on-chain status of a Router tryAggregate transaction submitted via /bulk-calls or /approve, with per-call success/revert decoded from the receipt (or from `debug_traceTransaction` if the outer tx reverted).
     *
     * @tags Send-Txs
     * @name SendTxsControllerTxStatus
     * @summary Get transaction status
     * @request POST:/v1/send-txs/tx-status
     */
    sendTxsControllerTxStatus: (
      data: TxStatusQueryDto,
      params: RequestParams = {},
    ) =>
      this.request<DedicatedTxStatusResponseV2, any>({
        path: `/v1/send-txs/tx-status`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Same as /tx-status but additionally parses limit order events (placed / cancelled) and market order executions from the transaction logs, grouped by the tryAggregate call that emitted them.
     *
     * @tags Send-Txs
     * @name SendTxsControllerTxStatusWithEvents
     * @summary Get transaction status with limit order events
     * @request POST:/v1/send-txs/tx-status-with-events
     */
    sendTxsControllerTxStatusWithEvents: (
      data: TxStatusQueryDto,
      params: RequestParams = {},
    ) =>
      this.request<DedicatedTxStatusWithEventsResponse, any>({
        path: `/v1/send-txs/tx-status-with-events`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Submit one or more agent-signed calldatas via a dedicated bot. Differences from `/bulk-calls`: - Sent by a dedicated bot, so the batch lands in a transaction of its own (not merged with other signers' calls). - Accepts an optional `simulate` flag — when `true`, calls are simulated first and reverters are reported in `failedSimulations`. With `requireSuccess: true`, nothing is broadcast if any call would revert; with `requireSuccess: false`, reverters are filtered out and survivors are broadcast. **Whitelist required.** Only approved accounts can call this endpoint. Contact us if you need access.
     *
     * @tags Send-Txs
     * @name SendTxsControllerDedicatedBulkCalls
     * @summary Submit dedicated agent-signed calls
     * @request POST:/v1/send-txs/dedicated/bulk-calls
     */
    sendTxsControllerDedicatedBulkCalls: (
      data: DedicatedBulkAgentExecuteDto,
      params: RequestParams = {},
    ) =>
      this.request<DedicatedTxResponse, void>({
        path: `/v1/send-txs/dedicated/bulk-calls`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
