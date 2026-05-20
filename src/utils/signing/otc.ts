import { randomBytes } from 'node:crypto';
import { Address, Hex, hashTypedData } from 'viem';
import { getInternalAgent } from '../../entities';
import { EIP712_DOMAIN_TYPES, createPendleBorosRouterDomain } from './common';

export function generateOrderSalt(): bigint {
  const saltBytes = randomBytes(32);
  return BigInt(`0x${saltBytes.toString('hex')}`);
}

export const OTC_TRADE_REQ_TYPES = [
  { name: 'marketId', type: 'uint24' },
  { name: 'signedSize', type: 'int128' },
  { name: 'rate', type: 'int128' },
  { name: 'maker', type: 'address' },
  { name: 'taker', type: 'address' },
  { name: 'salt', type: 'uint256' },
] as const;

export const ACCEPT_OTC_FULL_MESSAGE_TYPES = [
  { name: 'trade', type: 'OTCTradeReq' },
  { name: 'accountId', type: 'uint8' },
  { name: 'cross', type: 'bool' },
  { name: 'expiry', type: 'uint64' },
] as const;

export const EXECUTE_OTC_TRADE_MESSAGE_TYPES = [
  { name: 'makerMsgHash', type: 'bytes32' },
  { name: 'takerMsgHash', type: 'bytes32' },
  { name: 'expiry', type: 'uint64' },
] as const;

export interface OTCTradeReq {
  marketId: number;
  signedSize: bigint;
  rate: bigint;
  maker: Address;
  taker: Address;
  salt?: bigint;
}

export interface AcceptOTCFullMessage {
  trade: OTCTradeReq;
  accountId: number;
  cross: boolean;
  expiry: bigint;
}

export interface ExecuteOTCTradeMessage {
  makerMsgHash: Hex;
  takerMsgHash: Hex;
  expiry: bigint;
}

export function hashAcceptOTCFullMessage(message: AcceptOTCFullMessage, routerAddress?: Address): Hex {
  const trade = {
    ...message.trade,
    salt: message.trade.salt ?? generateOrderSalt(),
  };
  return hashTypedData({
    domain: createPendleBorosRouterDomain(routerAddress),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      OTCTradeReq: OTC_TRADE_REQ_TYPES,
      AcceptOTCFullMessage: ACCEPT_OTC_FULL_MESSAGE_TYPES,
    },
    primaryType: 'AcceptOTCFullMessage',
    message: {
      trade,
      accountId: message.accountId,
      cross: message.cross,
      expiry: message.expiry,
    },
  });
}

export const CANCEL_OTC_TRADE_MESSAGE_TYPES = [{ name: 'tradeId', type: 'bytes32' }] as const;

export interface CancelOTCTradeMessage {
  tradeId: Hex;
}

export async function signAcceptOTCFullMessageWithAgent(params: {
  trade: OTCTradeReq;
  accountId: number;
  cross: boolean;
  expiry: bigint;
}): Promise<{ agent: Address; signature: Hex }> {
  const agent = getInternalAgent();
  const agentAddress = await agent.getAddress();
  const signer = agent.walletClient;

  const trade = {
    ...params.trade,
    salt: params.trade.salt ?? 0n,
  };

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: createPendleBorosRouterDomain(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      OTCTradeReq: OTC_TRADE_REQ_TYPES,
      AcceptOTCFullMessage: ACCEPT_OTC_FULL_MESSAGE_TYPES,
    },
    primaryType: 'AcceptOTCFullMessage',
    message: {
      trade,
      accountId: params.accountId,
      cross: params.cross,
      expiry: params.expiry,
    },
  });

  return { agent: agentAddress, signature };
}

export async function signCancelOTCTradeMessageWithAgent(params: {
  tradeId: Hex;
}): Promise<{ agent: Address; signature: Hex }> {
  const agent = getInternalAgent();
  const agentAddress = await agent.getAddress();
  const signer = agent.walletClient;

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: createPendleBorosRouterDomain(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      CancelOTCTradeMessage: CANCEL_OTC_TRADE_MESSAGE_TYPES,
    },
    primaryType: 'CancelOTCTradeMessage',
    message: { tradeId: params.tradeId },
  });

  return { agent: agentAddress, signature };
}
