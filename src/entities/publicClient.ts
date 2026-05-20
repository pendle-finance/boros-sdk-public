import { http, PublicClient, createPublicClient } from 'viem';
import { arbitrum } from 'viem/chains';
import { RPC_URL } from '../common';

export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http(RPC_URL),
}) as PublicClient;
