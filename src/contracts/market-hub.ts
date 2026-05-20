import { Address } from 'viem';
import { MulticallOptions } from '../multicall/multicall';
import { iMarketHubAbi } from './abis/viemAbis';
import { BaseContractHelper } from './base-contract-helper';

export class MarketHub extends BaseContractHelper<typeof iMarketHubAbi> {
  abi() {
    return iMarketHubAbi;
  }

  async getEnteredMarkets(user: Address, multicallOptions?: MulticallOptions) {
    const enteredMarkets = await this.contract.read.getEnteredMarkets(user, multicallOptions);
    return enteredMarkets;
  }
}
