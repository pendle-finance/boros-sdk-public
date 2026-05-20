import { Address, PublicClient } from 'viem';
import { arbitrum } from 'viem/chains';
import { toAddress } from '../../addresses';
import { AssetItemResponse } from '../../backend/clients/generated/OpenApiSdk';
import { ERC20 } from '../../contracts/erc20';
import { applySlippage } from '../../utils/slippage';

export class Token {
  constructor(
    public readonly chainId: number,
    public readonly address: Address,
    public readonly decimals: number,
    public readonly symbol: string,
    public readonly name: string,
    public readonly priceUSD?: number,
    public readonly tokenId?: number,
    public readonly dstTokenId?: number
  ) {}

  static createFromBorosCore(token: AssetItemResponse & { chainId?: number; dstTokenId?: number }): Token {
    return new Token(
      token.chainId ?? arbitrum.id,
      toAddress(token.address),
      token.decimals,
      token.symbol,
      token.name,
      Number(token.usdPrice),
      token.tokenId,
      token.dstTokenId
    );
  }

  async balanceOf(address: Address, params: { client: PublicClient }): Promise<TokenAmount> {
    const erc20 = ERC20.create(this.address, { client: params.client, multicall: undefined });
    const balance = await erc20.balanceOf(address);
    return new TokenAmount(this, balance);
  }

  async allowance(address: Address, spender: Address, params: { client: PublicClient }): Promise<TokenAmount> {
    const erc20 = ERC20.create(this.address, { client: params.client, multicall: undefined });
    const allowance = await erc20.allowance(address, spender);
    return new TokenAmount(this, allowance);
  }
}

export class TokenAmount {
  constructor(
    public readonly token: Token,
    public readonly amount: bigint
  ) {}

  static createFromBorosCore(token: AssetItemResponse, amount: string): TokenAmount {
    return new TokenAmount(Token.createFromBorosCore(token), BigInt(amount));
  }

  slipDown(slippage: number): TokenAmount {
    return new TokenAmount(this.token, applySlippage(this.amount, slippage));
  }
}
