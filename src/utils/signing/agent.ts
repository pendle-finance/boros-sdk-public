import { Address, Hex, getAbiItem, keccak256 } from 'viem';
import { iRouterAbi } from '../../contracts/abis/viemAbis';
import { Agent, getInternalAgent } from '../../entities';
import {
  Account,
  CashSwapMessage,
  MarketAcc,
  MarketId,
  PendleSignTxStruct,
  Side,
  TimeInForce,
  functionEncoder,
} from '../../types';
import { AccountLib } from '../accountLib';
import {
  AGENT_MESSAGE_TYPES,
  CANCEL_CONDITIONAL_MESSAGE_TYPES,
  CANCEL_CONDITIONAL_MESSAGE_V2_TYPES,
  EIP712_DOMAIN_TYPES,
  PENDLE_BOROS_ROUTER_DOMAIN,
  PLACE_CONDITIONAL_ACTION_MESSAGE_TYPES,
  UPDATE_SETTINGS_TYPES,
  hashStopOrderRequest,
} from './common';

export type AgentExecution = keyof typeof functionEncoder;

export type SignedAgentExecution = {
  agent: Address;
  message: PendleSignTxStruct;
  signature: Hex;
  calldata: Hex;
};

async function messagesToSigns(params: {
  calldatas: Hex[];
  messages: PendleSignTxStruct[];
  agent?: Agent;
}) {
  const { calldatas, messages } = params;
  const agent = params.agent ?? getInternalAgent();
  const signer = agent.walletClient;
  const pendleSignTxType = getAbiItem({
    abi: iRouterAbi,
    name: 'agentExecute',
  }).inputs.find((item) => item.name === 'message')!.components;

  const signatures = await Promise.all(
    messages.map((message) =>
      signer.signTypedData({
        account: agent.walletClient.account!,
        domain: PENDLE_BOROS_ROUTER_DOMAIN(),
        types: {
          EIP712Domain: EIP712_DOMAIN_TYPES,
          PendleSignTx: pendleSignTxType,
        },
        primaryType: 'PendleSignTx',
        message,
      })
    )
  );

  const signs = await Promise.all(
    signatures.map(async (signature, index) => ({
      agent: await agent.getAddress(),
      message: messages[index],
      signature,
      calldata: calldatas[index],
    }))
  );

  return signs;
}

export async function bulkSignWithAgentV2(params: {
  root: Address;
  executeParams: {
    accountId: number;
    calldata: Hex;
  }[];
  agent?: Agent;
  nonces?: bigint[];
}) {
  const { root, executeParams, nonces } = params;

  if (nonces !== undefined && nonces.length !== executeParams.length) {
    throw new Error('nonces length must be equal to executeParams length');
  }

  const messages: PendleSignTxStruct[] = [];
  const baseNonce = Date.now() * 1000;
  for (let i = 0; i < executeParams.length; i++) {
    const nonce = nonces?.[i] ?? BigInt(baseNonce + i);
    const message: PendleSignTxStruct = {
      account: AccountLib.pack(root, executeParams[i].accountId),
      connectionId: keccak256(executeParams[i].calldata),
      nonce,
    };
    messages.push(message);
  }
  const calldatas = executeParams.map((param) => param.calldata);

  const signs = await messagesToSigns({ calldatas, messages, agent: params.agent });
  return signs;
}

export async function bulkSignWithAgent(params: {
  root: Address;
  accountId: number;
  calldatas: Hex[];
  agent?: Agent;
  nonces?: bigint[];
}) {
  const { root, accountId, calldatas, nonces } = params;

  if (nonces !== undefined && nonces.length !== calldatas.length) {
    throw new Error('nonces length must be equal to calldatas length');
  }

  const messages: PendleSignTxStruct[] = [];
  const baseNonce = Date.now() * 1000;
  for (let i = 0; i < calldatas.length; i++) {
    const nonce = nonces?.[i] ?? BigInt(baseNonce + i);
    const message: PendleSignTxStruct = {
      account: AccountLib.pack(root, accountId),
      connectionId: keccak256(calldatas[i]),
      nonce,
    };
    messages.push(message);
  }

  const signs = await messagesToSigns({ calldatas, messages, agent: params.agent });
  return signs;
}

export async function signWithAgent(params: {
  root: Address;
  accountId: number;
  calldata: Hex;
  agent?: Agent;
  nonce?: bigint;
}): Promise<SignedAgentExecution> {
  const { root, accountId, calldata } = params;

  const message: PendleSignTxStruct = {
    account: AccountLib.pack(root, accountId),
    connectionId: keccak256(calldata),
    nonce: params.nonce ?? BigInt(Date.now() * 1000),
  };

  const agent = params.agent ?? getInternalAgent();
  const signer = agent.walletClient;
  const pendleSignTxType = getAbiItem({
    abi: iRouterAbi,
    name: 'agentExecute',
  }).inputs.find((item) => item.name === 'message')!.components;

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: PENDLE_BOROS_ROUTER_DOMAIN(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      PendleSignTx: pendleSignTxType,
    },
    primaryType: 'PendleSignTx',
    message,
  });

  return {
    agent: await agent.getAddress(),
    message,
    signature,
    calldata,
  };
}

export async function signUpdateSettings(params: {
  marketAcc: MarketAcc;
  marketId: number;
  leverage: number;
}) {
  const { marketAcc, marketId, leverage } = params;

  const agent = getInternalAgent();
  const agentAddress = await agent.getAddress();
  const signer = agent.walletClient;
  const timestamp = Date.now();

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: PENDLE_BOROS_ROUTER_DOMAIN(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      UpdateSettings: UPDATE_SETTINGS_TYPES,
    },
    primaryType: 'UpdateSettings',
    message: {
      marketAcc,
      timestamp: BigInt(timestamp),
    },
  });

  return {
    marketAcc,
    marketId,
    leverage,
    signature,
    agent: agentAddress,
    timestamp,
  };
}

export async function signStopOrderRequest(params: {
  req: {
    account: Account;
    cross: boolean;
    marketId: MarketId;
    side: Side;
    tif: TimeInForce;
    size: bigint;
    tick: number;
    reduceOnly: boolean;
    salt: string;
    expiry: string;
  };
  offchainCondition: Hex;
}) {
  const { req, offchainCondition } = params;
  const hashedOffchainCondition = keccak256(offchainCondition);

  const agent = getInternalAgent();
  const agentAddress = await agent.getAddress();
  const signer = agent.walletClient;

  const orderHash = hashStopOrderRequest({ ...req, hashedOffchainCondition });

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: PENDLE_BOROS_ROUTER_DOMAIN(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      PlaceConditionalActionMessage: PLACE_CONDITIONAL_ACTION_MESSAGE_TYPES,
    },
    primaryType: 'PlaceConditionalActionMessage',
    message: { actionHash: orderHash },
  });

  return { agent: agentAddress, signature, orderHash };
}

export async function signCancelStopOrderRequest(params: {
  orderId: Hex;
}) {
  const { orderId } = params;

  const agent = getInternalAgent();
  const agentAddress = await agent.getAddress();
  const signer = agent.walletClient;

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: PENDLE_BOROS_ROUTER_DOMAIN(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      CancelConditionalMessage: CANCEL_CONDITIONAL_MESSAGE_TYPES,
    },
    primaryType: 'CancelConditionalMessage',
    message: { orderId },
  });

  return { agent: agentAddress, signature, orderId };
}

export async function signCancelStopOrderV2Request(params: {
  orderIds: Hex[];
}) {
  const { orderIds } = params;

  const agent = getInternalAgent();
  const agentAddress = await agent.getAddress();
  const signer = agent.walletClient;

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: PENDLE_BOROS_ROUTER_DOMAIN(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      CancelConditionalMessage: CANCEL_CONDITIONAL_MESSAGE_V2_TYPES,
    },
    primaryType: 'CancelConditionalMessage',
    message: { orderIds },
  });

  return { agent: agentAddress, signature, orderIds };
}

export async function getAgentSignature() {
  const agent = getInternalAgent();
  const agentAddress = await agent.getAddress();
  const signer = agent.walletClient;
  const timestamp = Date.now();

  const signature = await signer.signTypedData({
    account: agent.walletClient.account!,
    domain: PENDLE_BOROS_ROUTER_DOMAIN(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      AgentMessage: AGENT_MESSAGE_TYPES,
    },
    primaryType: 'AgentMessage',
    message: {
      timestamp: BigInt(timestamp),
    },
  });

  return { agent: agentAddress, signature, timestamp };
}

export function generateCashSwapNonce(): bigint {
  return BigInt(Date.now() * 1000);
}

export async function signCashSwapMessage(params: {
  message: CashSwapMessage;
  agent?: Agent;
}) {
  const agent = params.agent ?? getInternalAgent();
  const resolvedMessage = { ...params.message, nonce: params.message.nonce ?? generateCashSwapNonce() };
  const signature = await agent.walletClient.signTypedData({
    account: agent.walletClient.account!,
    domain: PENDLE_BOROS_ROUTER_DOMAIN(),
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPES,
      CashSwapMessage: [
        { name: 'from', type: 'bytes26' },
        { name: 'to', type: 'bytes26' },
        { name: 'amountSpent', type: 'uint256' },
        { name: 'minAmountReceived', type: 'uint256' },
        { name: 'swapExtRouter', type: 'address' },
        { name: 'swapApprove', type: 'address' },
        { name: 'swapCalldata', type: 'bytes' },
        { name: 'nonce', type: 'uint64' },
      ],
    },
    primaryType: 'CashSwapMessage',
    message: resolvedMessage,
  });
  return { signature, message: resolvedMessage };
}
