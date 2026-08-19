import { MarketId, Side } from '../../types';

/** Trigger kind. Numbering is shared with the limit-order `orderType`, minus its non-conditional members. */
export enum StopAprOrderType {
  TAKE_PROFIT_MARKET = 2,
  STOP_LOSS_MARKET = 3,
}

/** Lifecycle of a conditional order. Not contiguous with the limit-order status enum. */
export enum ConditionalOrderStatus {
  Filling = 0,
  Cancelled = 1,
  FullyFilled = 2,
  Expired = 3,
  Purged = 4,
  Pending = 5,
  Executing = 6,
  Retrying = 7,
  Failed = 8,
}

export interface PlaceStopOrderParams {
  /** Market of the position the trigger protects. */
  marketId: MarketId;
  /** Where the position sits: `true` → the cross account, `false` → isolated on `marketId`. */
  isCross: boolean;
  side: Side;
  type: StopAprOrderType;
  /** APR that arms the trigger, as a decimal (`0.085` = 8.5%). */
  stopApr: number;
  /** Close the whole position when it triggers; `size` is then ignored. */
  closePosition?: boolean;
  /** Notional to close, scaled by 10^18. Required unless `closePosition` is set. */
  size?: bigint;
}

export interface ListStopOrdersParams {
  marketId?: MarketId;
  tokenId?: number;
  /** `true` → live orders only, `false` → finalised only, omitted → both. */
  isActive?: boolean;
  resumeToken?: string;
  /** Capped at 200 by the backend. */
  limit?: number;
}
