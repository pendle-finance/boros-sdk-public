import { Address, Hex } from 'viem';

const ADDRESSES = {
  ROUTER_ADDRESS: '0x8080808080daB95eFED788a9214e400ba552DEf6',
  MARKET_HUB_ADDRESS: '0x1080808080f145b14228443212e62447C112ADaD',
  EXPLORER_ADDRESS: '0x40808080804111c374C8F1dc78b13FB57Df93197',
  MARKET_FACTORY_ADDRESS: '0x3080808080Ee6a795c1a6Ff388195Aa5F11ECeE0',
  EXPLORER_CONTRACT_ADDRESS: '0x40808080804111c374C8F1dc78b13FB57Df93197',
  DEPOSIT_BOX_FACTORY_ADDRESS: '0xDEB0FAC888C33E3E7394c095FE3c4E3de760E12c',
  CHAIN_ID: 42161,

  //TODO: fix this
  REFERRAL_MERKLE_DISTRIBUTOR_ADDRESS: '0xD2808080809a71248620a7ddc25b721d3DBe1058',
  MAKER_INCENTIVE_MERKLE_DISTRIBUTOR_ADDRESS: '0xD0808080803c59dBF8825290bca8979786C2d65B',
  LP_REWARDS_MERKLE_DISTRIBUTOR_ADDRESS: '0xD180808080402FE41711Db560B8db5C41e21Df71',
  SWAP_EXECUTOR_ADDRESS: '0xd8d82d566F251E0280F3B5C91c58C8A7bB7A1780',
  BNB_OFT_ADDRESS: '0x74d9d3c04d69fbd0a1278a902d656412b8af9005',
  HYPE_OFT_ADDRESS: '0x007C26Ed5C33Fe6fEF62223d4c363A01F1b1dDc1',

  DEPOSIT_BOX_CODE_HASH: '0x44fbd2278daf4176957107c6ec3a53e6e0f2fe9a6499154e63101d500acbe6af',
} as const;

export const getRouterAddress = (): Address => ADDRESSES.ROUTER_ADDRESS;

export const getMarketHubAddress = (): Address => ADDRESSES.MARKET_HUB_ADDRESS;

export const getExplorerAddress = (): Address => ADDRESSES.EXPLORER_ADDRESS;

export const getMarketFactoryAddress = (): Address => ADDRESSES.MARKET_FACTORY_ADDRESS;

export const getExplorerContractAddress = (): Address => ADDRESSES.EXPLORER_CONTRACT_ADDRESS;

export const getReferralMerkleDistributorAddress = (): Address => ADDRESSES.REFERRAL_MERKLE_DISTRIBUTOR_ADDRESS;

export const getMakerIncentiveMerkleDistributorAddress = (): Address =>
  ADDRESSES.MAKER_INCENTIVE_MERKLE_DISTRIBUTOR_ADDRESS;

export const getLpRewardsMerkleDistributorAddress = (): Address => ADDRESSES.LP_REWARDS_MERKLE_DISTRIBUTOR_ADDRESS;

export const getDepositBoxFactoryAddress = (): Address => ADDRESSES.DEPOSIT_BOX_FACTORY_ADDRESS;

export const getSwapExecutorAddress = (): Address => ADDRESSES.SWAP_EXECUTOR_ADDRESS;

export const getBnbOftAddress = (): Address => ADDRESSES.BNB_OFT_ADDRESS;

export const getHypeOftAddress = (): Address => ADDRESSES.HYPE_OFT_ADDRESS;

export const getDepositBoxCodeHash = (): Hex => ADDRESSES.DEPOSIT_BOX_CODE_HASH;

export const getChainId = (): number => ADDRESSES.CHAIN_ID;

export function getBungeeApiUrl(): string {
  return 'https://backend.bungee.exchange';
}

export function toAddress(rawAddress: string): Address {
  return rawAddress.toLowerCase() as Address;
}

export const getAddresses = () => ({
  ROUTER_ADDRESS: getRouterAddress(),
  MARKET_HUB_ADDRESS: getMarketHubAddress(),
  EXPLORER_ADDRESS: getExplorerAddress(),
  MARKET_FACTORY_ADDRESS: getMarketFactoryAddress(),
  EXPLORER_CONTRACT_ADDRESS: getExplorerContractAddress(),
  CHAIN_ID: getChainId(),
  REFERRAL_MERKLE_DISTRIBUTOR_ADDRESS: getReferralMerkleDistributorAddress(),
  MAKER_INCENTIVE_MERKLE_DISTRIBUTOR_ADDRESS: getMakerIncentiveMerkleDistributorAddress(),
  LP_REWARDS_MERKLE_DISTRIBUTOR_ADDRESS: getLpRewardsMerkleDistributorAddress(),
});

export const ROUTER_ADDRESS = getRouterAddress();
export const MARKET_HUB_ADDRESS = getMarketHubAddress();
export const EXPLORER_ADDRESS = getExplorerAddress();
export const MARKET_FACTORY_ADDRESS = getMarketFactoryAddress();
export const CHAIN_ID = getChainId();
export const EXPLORER_CONTRACT_ADDRESS = getExplorerContractAddress();
export const MULTI_TOKEN_MERKLE_DISTRIBUTOR_ADDRESS = getReferralMerkleDistributorAddress();
export const MAKER_INCENTIVE_MERKLE_DISTRIBUTOR_ADDRESS = getMakerIncentiveMerkleDistributorAddress();
export const LP_REWARDS_MERKLE_DISTRIBUTOR_ADDRESS = getLpRewardsMerkleDistributorAddress();

export const ADDRESSES_CONFIG = ADDRESSES;

