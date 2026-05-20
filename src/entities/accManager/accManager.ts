import { Address, Hex, WalletClient, encodeFunctionData } from 'viem';
import { getRouterAddress } from '../../addresses';
import { iRouterAbi } from '../../contracts/abis/viemAbis';
import { Account, SetAccManagerStruct } from '../../types/common';
import { getUserAddressFromWalletClient, signSetAccManagerMessage } from '../../utils';
import { publicClient } from '../publicClient';

export class AccManager {
  private static async createSetAccManagerMessage(
    userAddress: Address,
    accManagerAddress: Address,
    nonce?: bigint
  ): Promise<SetAccManagerStruct> {
    return {
      root: userAddress,
      accountId: 0,
      accManager: accManagerAddress,
      nonce: nonce ?? BigInt(Date.now() * 1000),
    };
  }

  static async setAccManager(userWalletClient: WalletClient, accManagerAddress: Address, nonce?: bigint): Promise<Hex> {
    const userAddress = await getUserAddressFromWalletClient(userWalletClient);
    const setAccManagerStruct = await AccManager.createSetAccManagerMessage(userAddress, accManagerAddress, nonce);
    const setAccManagerSignature = await signSetAccManagerMessage(userWalletClient, setAccManagerStruct);
    return AccManager.getSetAccManagerData(setAccManagerStruct, setAccManagerSignature);
  }

  private static getSetAccManagerData(setAccManagerStruct: SetAccManagerStruct, signature: Hex): Hex {
    const data = encodeFunctionData({
      abi: iRouterAbi,
      functionName: 'setAccManager',
      args: [setAccManagerStruct, signature],
    });
    return data;
  }

  static async getAccManager(account: Account): Promise<Address> {
    const accManagerAddress = await publicClient.readContract({
      address: getRouterAddress(),
      abi: iRouterAbi,
      functionName: 'accountManager',
      args: [account],
    });
    return accManagerAddress;
  }
}
