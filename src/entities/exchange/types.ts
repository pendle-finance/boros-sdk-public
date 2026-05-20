import { Hex } from 'viem';
import { Address } from 'viem';
import { CancelData } from '../../types';
import { Side, TimeInForce } from '../../types/common';

export enum OrderType {
  LIMIT = 0,
  MARKET = 1,
  TAKE_PROFIT_MARKET = 2,
  STOP_LOSS_MARKET = 3,
}

export type PlaceOrderParams = {
  marketAcc: Hex;
  marketId: number;
  side: Side;
  size: bigint;
  ammId?: number;
  limitTick?: number;
  rate?: number;
  slippage?: number;
  tif: TimeInForce;
  nonces?: bigint[];
};

export type BulkOrders = {
  tif: TimeInForce;
  side: Side;
  sizes: bigint[];
  limitTicks: number[];
};

export type SingleOrderRequest = {
  marketAcc: Hex;
  marketId: number;
  side: Side;
  size: bigint;
  limitTick: number;
  tif: TimeInForce;
  ammId?: number;
  slippage?: number;
};

export type BulkOrderRequest = {
  cross: boolean;
  bulks: {
    marketId: number;
    orders: BulkOrders;
    cancelData: CancelData;
  }[];
  slippage?: number;
};

export type BulkPlaceOrderParams = {
  orderRequests: (SingleOrderRequest | BulkOrderRequest)[];
  nonces?: bigint[];
};

export type CancelOrdersParams = {
  marketAcc: Hex;
  marketId: number;
  cancelAll: boolean;
  orderIds: string[];
  nonces?: bigint[];
};

export type PayTreasuryParams = {
  isCross: boolean;
  marketId: number;
  usdAmount: number;
  nonces?: bigint[];
};

export type DepositParams = {
  userAddress: Address;
  tokenId: number;
  tokenAddress?: Address;
  amount: bigint;
  accountId: number;
  marketId: number;
};

export type WithdrawParams = {
  userAddress: Address;
  tokenId: number;
  amount: bigint;
};

export type CashTransferParams = {
  marketId: number;
  isDeposit: boolean;
  amount: bigint;
  nonces?: bigint[];
};

export type CloseActivePositionsParams = {
  marketAcc: Hex;
  marketId: number;
  side: Side;
  size: bigint;
  limitTick: number;
  slippage?: number;
  tif: TimeInForce;
  nonces?: bigint[];
};

export type UpdateSettingsParams = {
  marketAcc: Hex;
  marketId: number;
  leverage: number;
  signature: Hex;
  agent: Hex;
  timestamp: number;
};

export type GetAllMarketsFilters = {
  isMatured?: boolean;
  isUiWhitelisted?: boolean;
};

export type GetOrderBookParams = {
  marketId: number;
  tickSize: 0.0001 | 0.001 | 0.01 | 0.1;
};

export type GetOrdersPageParams = {
  root?: Address; // default this.root
  accountId?: number; // default this.accountId
  marketId?: number;
  isActive?: boolean;
  orderType?: OrderType[]; // SDK joins to comma string at HTTP boundary
  resumeToken?: string;
  limit?: number;
};

export type GetActiveOrdersFromContractParams = {
  userAddress?: Address;
  accountId?: number;
  tokenId: number;
  marketId: number;
};

// Contract-based positions query.
export type GetUserPositionsParams = {
  userAddress?: Address;
  accountId?: number;
  tokenId: number;
  marketId: number;
};

export type GetAgentExpiryTimeParams = {
  agentAddress?: Address;
  root?: Address;
  accountId?: number;
};
