import { iRouterAbi } from '../contracts/abis/viemAbiRouter';
import { BaseContractHelper } from './base-contract-helper';

export class RouterContract extends BaseContractHelper<typeof iRouterAbi> {
  abi() {
    return iRouterAbi;
  }
}
