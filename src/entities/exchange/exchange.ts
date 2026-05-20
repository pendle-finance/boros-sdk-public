import { FixedX18, getRateAtTick } from '@pendle/boros-offchain-math';
import { Address, Hex, PublicClient, WalletClient, erc20Abi, getContract } from 'viem';
import { getExplorerContractAddress, getMarketHubAddress, getRouterAddress } from '../../addresses';
import { MarketListItemResponse } from '../../backend/clients/generated/OpenApiSdk';
import { OpenApiSdk, getOpenApiSdk } from '../../backend/clients/module';
import { MarketStatus } from '../../common/types';
import { CROSS_MARKET_ID } from '../../constants';
import { ContractsFactory } from '../../contracts/contracts.factory';
import { ApproveAgentReq, RevokeAgentReq, functionEncoder } from '../../types';
import { MarketAccLib, OrderIdLib, bulkSignWithAgent } from '../../utils';
import { Agent } from '../agent';
import { publicClient } from './../publicClient';
import {
  BulkOrderRequest,
  BulkPlaceOrderParams,
  CancelOrdersParams,
  CashTransferParams,
  DepositParams,
  GetActiveOrdersFromContractParams,
  GetAgentExpiryTimeParams,
  GetAllMarketsFilters,
  GetOrderBookParams,
  GetOrdersPageParams,
  GetUserPositionsParams,
  PayTreasuryParams,
  PlaceOrderParams,
  SingleOrderRequest,
  WithdrawParams,
} from './types';
import { decodeLog } from './utils';

export const MIN_DESIRED_MATCH_RATE = FixedX18.fromRawValue(-(2n ** 127n)); // int128
export const MAX_DESIRED_MATCH_RATE = FixedX18.fromRawValue(2n ** 127n - 1n); // int128
export class Exchange {
  static readonly DEFAULT_SLIPPAGE = 0.05;

  private walletClient: WalletClient;
  private root: Address;
  private accountId: number;
  private openApiSdk: OpenApiSdk;
  private contractsFactory: ContractsFactory;
  private publicClient: PublicClient;
  private agent?: Agent;

  constructor(walletClient: WalletClient, root: Address, accountId: number, rpcUrls: string[], agent?: Agent) {
    this.walletClient = walletClient;
    this.root = root;
    this.accountId = accountId;
    this.openApiSdk = getOpenApiSdk();
    this.contractsFactory = new ContractsFactory(rpcUrls);
    this.publicClient = this.contractsFactory.getRpcClient();
    this.agent = agent;
  }

  private getAgentForSigning(): Agent | undefined {
    return this.agent;
  }

  setAgent(agent: Agent): void {
    this.agent = agent;
  }

  getAgent(): Agent | undefined {
    return this.agent;
  }

  async enterMarkets(cross: boolean, marketIds: number[], nonces?: bigint[]) {
    const { data: enterMarketsCalldataResponse } =
      await this.openApiSdk.calldataBuilderAgentExecutable.calldataBuilderAgentControllerBuildEnterMarkets({
        accountId: this.accountId,
        isCross: cross,
        marketIds,
      });
    const enterMarketsResponses = await this.bulkSignAndExecute(
      enterMarketsCalldataResponse.calls.map((call) => call.calldata as Hex),
      nonces
    );
    return enterMarketsResponses;
  }

  async exitMarkets(cross: boolean, marketIds: number[], nonces?: bigint[]) {
    const { data: exitMarketsCalldataResponse } =
      await this.openApiSdk.calldataBuilderAgentExecutable.calldataBuilderAgentControllerBuildExitMarkets({
        accountId: this.accountId,
        isCross: cross,
        marketIds,
      });
    const exitMarketsResponses = await this.bulkSignAndExecute(
      exitMarketsCalldataResponse.calls.map((call) => call.calldata as Hex),
      nonces
    );
    return exitMarketsResponses;
  }

  async bulkSignAndExecute(calldatas: Hex[], nonces?: bigint[], requireSuccess?: boolean, skipReceipt?: boolean) {
    const signs = await bulkSignWithAgent({
      root: this.root,
      accountId: this.accountId,
      calldatas,
      agent: this.getAgentForSigning(),
      nonces,
    });
    const { data: executeResponses } = await this.openApiSdk.sendTxs.sendTxsControllerBulkCalls({
      datas: signs.map((sign) => ({
        ...sign,
        message: {
          ...sign.message,
          nonce: sign.message.nonce.toString(),
        },
      })),
      requireSuccess,
      skipReceipt,
    });

    const txHash = executeResponses.find((txResponse) => !txResponse.error)?.txHash;
    if (txHash) {
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as Hex });
      const blockTimestamp = (await publicClient.getBlock({ blockNumber: receipt.blockNumber })).timestamp;
      const logGroups = [];
      let events = [];
      const decodedEvents = receipt.logs.map((log) => decodeLog(log));
      for (const event of decodedEvents) {
        if (
          event &&
          (event.eventName === 'TryAggregateCallSucceeded' || event.eventName === 'TryAggregateCallFailed')
        ) {
          events.push(event);
          logGroups.push([...events]);
          events = [];
        } else {
          events.push(event);
        }
      }

      const successExecuteResponses = executeResponses
        .map((txResponse, index) => ({
          txResponse,
          id: index,
        }))
        .filter((txResponse) => txResponse.txResponse.txHash !== undefined);

      const sentTxResponses = logGroups
        .filter((_events, index) => {
          const successExecuteResponse = successExecuteResponses.find(
            (successExecuteResponse) => successExecuteResponse.txResponse.index === index
          );
          return successExecuteResponse !== undefined;
        })
        .map((events, index) => {
          return {
            result: {
              executeResponse: successExecuteResponses[index].txResponse,
              events,
              blockTimestamp,
              blockNumber: receipt.blockNumber,
            },
            id: successExecuteResponses[index].id,
          };
        });

      const res = executeResponses.map((txResponse, index) => {
        if (txResponse.error) {
          return {
            error: txResponse.error,
          };
        }
        const executeResponse = sentTxResponses.filter((successTxResponse) => successTxResponse.id === index)[0];
        return executeResponse.result;
      });
      return res;
    }
    return executeResponses.map((txResponse) => ({
      error: txResponse.error,
    }));
  }

  async placeOrder(params: PlaceOrderParams) {
    const { marketAcc, marketId, side, size, limitTick, rate, tif, slippage, ammId, nonces } = params;
    const { data: placeOrderCalldataResponse } =
      await this.openApiSdk.calldataBuilderAgentExecutable.calldataBuilderAgentControllerBuildPlaceOrders({
        orderRequests: [
          {
            singleOrder: {
              marketAcc,
              marketId,
              side,
              size: size.toString(),
              ...(rate !== undefined ? { rate } : { limitTick: limitTick ?? 0 }),
              tif,
              slippage,
              ammId,
            },
          },
        ],
      });

    const placeOrderResponses = await this.bulkSignAndExecute(
      placeOrderCalldataResponse.calls.map((call) => call.calldata as Hex),
      nonces
    );

    const placeOrderResponse = placeOrderResponses[placeOrderResponses.length - 1];

    if ('error' in placeOrderResponse) {
      throw new Error(placeOrderResponse.error);
    }

    const limitOrderPlacedEvent = placeOrderResponse.events.find((event) => event?.eventName === 'LimitOrderPlaced');
    const otcSwapEvent = placeOrderResponse.events.find((event) => event?.eventName === 'OtcSwap');
    const marketOrdersFilledEvent = placeOrderResponse.events.find(
      (event) => event?.eventName === 'MarketOrdersFilled'
    );

    const filledSize = FixedX18.fromBigIntString(marketOrdersFilledEvent?.args.totalTrade.toString() ?? '0')
      .abs()
      .add(FixedX18.fromBigIntString(otcSwapEvent?.args.trade.toString() ?? '0').abs());
    const orderInfo = {
      side,
      placedSize: limitOrderPlacedEvent?.args.sizes[0],
      filledSize,
      orderId: limitOrderPlacedEvent?.args.orderIds[0],
      root: this.root,
      marketId,
      accountId: this.accountId,
      isCross: MarketAccLib.isCrossMarket(marketAcc),
      blockTimestamp: placeOrderResponse.blockTimestamp,
      marketAcc,
    };
    const results = {
      executeResponse: placeOrderResponse.executeResponse,
      result: {
        order: orderInfo,
        events: placeOrderResponse.events,
      },
    };
    return results;
  }

  async bulkPlaceOrders(request: BulkPlaceOrderParams, options?: { skipReceipt?: boolean }) {
    const { data: bulkPlaceOrderCalldataResponse } =
      await this.openApiSdk.calldataBuilderAgentExecutable.calldataBuilderAgentControllerBuildPlaceOrders({
        orderRequests: request.orderRequests.map((orderRequest) => {
          if ('size' in orderRequest) {
            const { size, ammId, ...rest } = orderRequest;
            return {
              singleOrder: {
                ...rest,
                size: size.toString(),
                ammId: ammId ?? 0,
              },
            };
          }
          return {
            bulkOrders: {
              accountId: this.accountId,
              cross: orderRequest.cross,
              bulks: orderRequest.bulks.map((bulk) => ({
                marketId: bulk.marketId,
                orders: {
                  ...bulk.orders,
                  sizes: bulk.orders.sizes.map((size) => size.toString()),
                },
                cancelData: {
                  ...bulk.cancelData,
                  ids: bulk.cancelData.ids.map((id) => id.toString()),
                },
                slippage: orderRequest.slippage,
              })),
            },
          };
        }),
      });
    const responses = await this.bulkSignAndExecute(
      bulkPlaceOrderCalldataResponse.calls.map((call) => call.calldata as Hex),
      request.nonces,
      false,
      options?.skipReceipt
    );
    const parseSingleOrderResult = (index: number) => {
      const singleOrderRequest = request.orderRequests[index] as SingleOrderRequest;
      const orderResponse = responses[index];
      if ('error' in orderResponse) {
        return {
          error: orderResponse.error,
        };
      }
      const limitOrderPlacedEvent = orderResponse.events.find((event) => event?.eventName === 'LimitOrderPlaced');
      const otcSwapEvent = orderResponse.events.find((event) => event?.eventName === 'OtcSwap');

      const marketOrdersFilledEvent = orderResponse.events.find((event) => event?.eventName === 'MarketOrdersFilled');

      const filledSize = FixedX18.fromBigIntString(marketOrdersFilledEvent?.args.totalTrade.toString() ?? '0')
        .abs()
        .add(FixedX18.fromBigIntString(otcSwapEvent?.args.trade.toString() ?? '0').abs());
      const orderInfo = {
        side: singleOrderRequest!,
        placedSize: limitOrderPlacedEvent?.args.sizes[0],
        filledSize,
        orderId: limitOrderPlacedEvent?.args.orderIds[0],
        root: this.root,
        marketId: singleOrderRequest.marketId,
        accountId: this.accountId,
        isCross: MarketAccLib.isCrossMarket(singleOrderRequest.marketAcc),
        blockTimestamp: orderResponse.blockTimestamp,
        marketAcc: singleOrderRequest.marketAcc,
      };
      return {
        executeResponse: orderResponse.executeResponse,
        blockNumber: orderResponse.blockNumber,
        result: {
          order: orderInfo,
          events: orderResponse.events,
        },
      };
    };
    const parseBulkOrderResult = (index: number) => {
      const bulkOrderRequest = request.orderRequests[index] as BulkOrderRequest;
      const orderResponse = responses[index];
      if ('error' in orderResponse) {
        return {
          error: orderResponse.error,
        };
      }
      if ('error' in orderResponse) return orderResponse;
      const limitOrderPlacedEvents = orderResponse.events.filter((event) => event?.eventName === 'LimitOrderPlaced');
      const limitOrderCancelledEvents = orderResponse.events.filter(
        (event) => event?.eventName === 'LimitOrderCancelled'
      );

      const cancelledOrderIds = limitOrderCancelledEvents.flatMap((event) =>
        event?.args?.orderIds.map((orderId) => orderId.toString())
      );
      const orderPlaced = limitOrderPlacedEvents.flatMap((event) => {
        return event.args.orderIds.map((orderId, id) => {
          const { side, tickIndex } = OrderIdLib.unpack(orderId);
          const size = event.args.sizes[id];
          const order = {
            orderId: orderId.toString(),
            side,
            size,
            limitTick: tickIndex,
          };
          return order;
        });
      });
      return {
        executeResponse: orderResponse.executeResponse,
        blockNumber: orderResponse.blockNumber,
        result: {
          events: orderResponse.events,
          orders: orderPlaced,
          cancelledOrderIds,
          blockTimestamp: orderResponse.blockTimestamp,
          root: this.root,
          accountId: this.accountId,
          isCross: bulkOrderRequest.cross,
        },
      };
    };

    const results = request.orderRequests.map((orderRequest, index) => {
      if ('size' in orderRequest) {
        return parseSingleOrderResult(index);
      }
      return parseBulkOrderResult(index);
    });
    return results;
  }

  async cancelOrders(params: CancelOrdersParams) {
    const { marketAcc, marketId, cancelAll, orderIds, nonces } = params;
    const { data: cancelOrderCalldataResponse } =
      await this.openApiSdk.calldataBuilderAgentExecutable.calldataBuilderAgentControllerBuildCancelOrders({
        markets: [
          {
            marketAcc,
            marketId,
            cancelAll,
            orderIds,
          },
        ],
      });

    const cancelOrderResponses = await this.bulkSignAndExecute(
      cancelOrderCalldataResponse.calls.map((call) => call.calldata as Hex),
      nonces
    );

    const cancelOrderResponse = cancelOrderResponses[cancelOrderResponses.length - 1];

    if ('error' in cancelOrderResponse) {
      throw new Error(cancelOrderResponse.error);
    }
    const event = cancelOrderResponse.events.filter((event) => event?.eventName === 'LimitOrderCancelled')[0];
    let cancelledOrderInfo;
    if (event?.eventName === 'LimitOrderCancelled') {
      cancelledOrderInfo = event.args;
    }
    const results = {
      executeResponse: cancelOrderResponse.executeResponse,
      result: {
        cancelledOrders: cancelledOrderInfo,
      },
    };
    return results;
  }

  async bulkCancelOrders(cancelOrderRequests: CancelOrdersParams[]) {
    const cancelOrderCalldataResponse = await Promise.all(
      cancelOrderRequests.map(async (cancelOrderRequest) => {
        return this.cancelOrders(cancelOrderRequest);
      })
    );
    return cancelOrderCalldataResponse;
  }

  async getGasBalance(): Promise<number> {
    const { data: getGasBalanceCalldataResponse } =
      await this.openApiSdk.accounts.accountsV2ControllerGetAccountGasBalance({
        root: this.root,
      });
    return getGasBalanceCalldataResponse.balanceInUSD;
  }

  async payTreasury(params: PayTreasuryParams) {
    const { nonces, isCross, marketId, usdAmount } = params;
    const { data: payTreasuryCalldataResponse } =
      await this.openApiSdk.calldataBuilderAgentExecutable.calldataBuilderAgentControllerBuildPayTreasury({
        accountId: this.accountId,
        isCross,
        marketId,
        amount: usdAmount.toString(),
      });

    const payTreasuryResponse = await this.bulkSignAndExecute(
      payTreasuryCalldataResponse.calls.map((call) => call.calldata as Hex),
      nonces
    );
    return payTreasuryResponse;
  }

  async scheduleCancel(_time?: number) {
    throw new Error('Not implemented');
  }

  async approveAgent(agent?: Agent, nonce?: bigint, expiry_s?: number) {
    const agentToUse = agent ?? this.agent ?? (await Agent.create(this.walletClient)).agent;

    // If no instance agent is set, set the agent for this instance
    if (!this.agent) {
      this.agent = agentToUse;
    }

    // set expired time to the next 7 days
    const expiredTime = expiry_s ?? Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const approveAgentData = await agentToUse.approveAgent(this.walletClient, expiredTime, nonce);

    const { data: approveAgentResponse } = await this.openApiSdk.sendTxs.sendTxsControllerApprove({
      approveAgentCalldata: approveAgentData,
    });

    return approveAgentResponse;
  }

  async deposit(params: DepositParams) {
    const { userAddress, tokenId, amount, accountId, marketId } = params;
    const marketAcc = MarketAccLib.pack(userAddress, accountId, tokenId, marketId);
    const [depositCalldataResponse, tokenAddress] = await Promise.all([
      this.openApiSdk.calldataBuilderUserSigned.calldataBuilderUserControllerBuildDeposit({
        marketAcc,
        amount: amount.toString(),
      }),
      params.tokenAddress
        ? params.tokenAddress
        : this.openApiSdk.assets.assetsControllerListAssets().then((res) => {
            const tokenAddress = res.data.results.find((asset) => asset.tokenId === tokenId)?.address!;
            return tokenAddress;
          }),
    ]);
    const tokenContract = getContract({
      abi: erc20Abi,
      address: tokenAddress as Address,
      client: this.walletClient,
    });

    const approvalhash = await tokenContract.write.approve([depositCalldataResponse.data.to as Address, amount], {
      account: this.walletClient.account!,
      chain: this.walletClient.chain,
      type: 'eip1559',
    });
    await publicClient.waitForTransactionReceipt({ hash: approvalhash, confirmations: 1 });
    const hash = await this.walletClient.sendTransaction({
      to: depositCalldataResponse.data.to as Address,
      data: depositCalldataResponse.data.calldata as Hex,
      account: this.walletClient.account!,
      chain: this.walletClient.chain,
      type: 'eip1559',
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
    return receipt;
  }

  async withdraw(params: WithdrawParams) {
    const { userAddress, tokenId, amount } = params;
    const { data: withdrawCalldataResponse } =
      await this.openApiSdk.calldataBuilderUserSigned.calldataBuilderUserControllerBuildRequestWithdrawal({
        root: userAddress,
        tokenId,
        amount: amount.toString(),
      });

    const hash = await this.walletClient.sendTransaction({
      to: withdrawCalldataResponse.to as Address,
      data: withdrawCalldataResponse.calldata as Hex,
      account: this.walletClient.account!,
      chain: this.walletClient.chain,
      type: 'eip1559',
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
    return receipt;
  }

  async cashTransfer(params: CashTransferParams) {
    const { marketId, isDeposit, amount, nonces } = params;
    const { data: cashTransferCalldataResponse } =
      await this.openApiSdk.calldataBuilderAgentExecutable.calldataBuilderAgentControllerBuildCashTransfer({
        accountId: this.accountId,
        marketId,
        direction: isDeposit ? 'CROSS_TO_ISOLATED' : 'ISOLATED_TO_CROSS',
        amount: amount.toString(),
      });
    const response = await this.bulkSignAndExecute(
      cashTransferCalldataResponse.calls.map((call) => call.calldata as Hex),
      nonces
    );
    return response;
  }

  async getAmmCutOffTimestamp(marketId: number) {
    const { data } = await this.openApiSdk.markets.marketsControllerGetMarketsByIds({ marketIds: String(marketId) });
    const [market] = data.results;
    if (!market) return undefined;
    const ammContract = this.contractsFactory.getAmmContract(market.extConfig?.ammAddress as Address);
    const ammState = await ammContract?.readState();
    return ammState ? Number(ammState.cutOffTimestamp) : undefined;
  }

  async getEnteredMarkets(user: Address) {
    const marketHubContract = this.contractsFactory.getMarketHubContract(getMarketHubAddress());
    const enteredMarkets = await marketHubContract.getEnteredMarkets(user);
    return enteredMarkets;
  }

  async getMarketData(marketId: number): Promise<{
    midApr: number;
    impliedApr: number;
    bestBidApr: number | undefined;
    bestBidTick: number | undefined;
    bestAskApr: number | undefined;
    bestAskTick: number | undefined;
    lastTradedApr: number;
    markApr: number;
    marketStatus: MarketStatus;
  }> {
    const { data: marketsByIds } = await this.openApiSdk.markets.marketsControllerGetMarketsByIds({
      marketIds: String(marketId),
    });
    const [market] = marketsByIds.results;
    if (!market) throw new Error(`Market ${marketId} not found`);

    const marketContract = this.contractsFactory.getMarketContract(market.address as Address);
    const explorerContract = this.contractsFactory.getExplorerContract(getExplorerContractAddress());
    const ammAddress = market.extConfig?.ammAddress;
    const ammContract = ammAddress ? this.contractsFactory.getAmmContract(ammAddress as Address) : undefined;
    const [
      marketInfo,
      bestBidTickAndApr,
      bestAskTickAndApr,
      ammState,
      ammImpliedRateBigInt,
      impliedRateData,
      marketConfig,
    ] = await Promise.all([
      explorerContract.getMarketInfo(market.marketId),
      marketContract.getBestBidTickAndApr(BigInt(market.imData.tickStep)),
      marketContract.getBestAskTickAndApr(BigInt(market.imData.tickStep)),
      ammContract ? ammContract.readState().catch(() => undefined) : undefined,
      ammContract ? ammContract.impliedRate().catch(() => undefined) : undefined,
      marketContract.getImpliedRateData(),
      marketContract.getMarketConfig(),
    ]);
    const beforeCutOff = ammState ? Number(ammState.cutOffTimestamp) > Number(ammState.latestFTime) : false;
    const { impliedApr, markApr } = marketInfo;

    let midApr = FixedX18.fromRawValue(impliedApr).toNumber();
    if (beforeCutOff && ammImpliedRateBigInt) {
      midApr = FixedX18.fromRawValue(ammImpliedRateBigInt).toNumber();
      if (bestBidTickAndApr) {
        midApr = Math.max(midApr, bestBidTickAndApr.apr.toNumber());
      }
      if (bestAskTickAndApr) {
        midApr = Math.min(midApr, bestAskTickAndApr.apr.toNumber());
      }
    } else if (bestBidTickAndApr && bestAskTickAndApr) {
      midApr = (bestBidTickAndApr.apr.toNumber() + bestAskTickAndApr.apr.toNumber()) / 2;
    }
    return {
      midApr,
      impliedApr: FixedX18.fromRawValue(impliedApr).toNumber(),
      bestBidApr: bestBidTickAndApr?.apr.toNumber(),
      bestBidTick: bestBidTickAndApr?.tick,
      bestAskApr: bestAskTickAndApr?.apr.toNumber(),
      bestAskTick: bestAskTickAndApr?.tick,
      lastTradedApr: FixedX18.fromRawValue(impliedRateData.lastTradedRate).toNumber(),
      markApr: FixedX18.fromRawValue(markApr).toNumber(),
      marketStatus: marketConfig.status,
    };
  }

  private static _getAllMarketsCache: { [key: string]: { value: MarketListItemResponse[]; timestamp: number } } = {};
  private static _getAllMarketsCacheTTL = 5 * 60 * 1000; // 5 minutes in ms

  public async getAllMarkets(filters?: GetAllMarketsFilters): Promise<MarketListItemResponse[]> {
    const cacheKey = JSON.stringify(filters ?? {});
    const now = Date.now();
    const cached = Exchange._getAllMarketsCache[cacheKey];
    if (cached && now - cached.timestamp < Exchange._getAllMarketsCacheTTL) {
      return cached.value;
    }
    const allResults: MarketListItemResponse[] = [];
    let resumeToken: string | undefined = undefined;
    do {
      const { data } = await this.openApiSdk.markets.marketsControllerListMarkets({
        limit: 200,
        resumeToken,
        isMatured: filters?.isMatured,
        isUiWhitelisted: filters?.isUiWhitelisted,
      });
      allResults.push(...data.results);
      resumeToken = data.resumeToken ?? undefined;
    } while (resumeToken);
    Exchange._getAllMarketsCache[cacheKey] = { value: allResults, timestamp: now };
    return allResults;
  }

  async getOrderBook(params: GetOrderBookParams) {
    const { marketId, tickSize } = params;
    const { data: getOrderBookCalldataResponse } = await this.openApiSdk.markets.marketsControllerGetOrderBook({
      marketId,
      tickSize,
    });
    return getOrderBookCalldataResponse;
  }

  async getUserPositions(params: GetUserPositionsParams) {
    const { marketId, userAddress, accountId, tokenId } = params;
    const explorerContract = this.contractsFactory.getExplorerContract(getExplorerContractAddress());
    const marketAcc = MarketAccLib.pack(userAddress ?? this.root, accountId ?? this.accountId, tokenId, marketId);
    const crossMarketAcc = MarketAccLib.pack(
      userAddress ?? this.root,
      accountId ?? this.accountId,
      tokenId,
      CROSS_MARKET_ID
    );
    const [userInfo, crossUserInfo] = await Promise.all([
      explorerContract.getUserInfo(marketAcc),
      marketId !== CROSS_MARKET_ID ? explorerContract.getUserInfo(crossMarketAcc) : undefined,
    ]);
    const userPositions = userInfo.positions.map((position) => {
      return {
        position,
        marketAcc,
      };
    });
    const crossUserPositions = crossUserInfo?.positions.map((position) => {
      return {
        position,
        marketAcc: crossMarketAcc,
      };
    });
    const positions = userPositions
      .concat(crossUserPositions ?? [])
      .filter((val) => (marketId !== CROSS_MARKET_ID ? val.position.marketId === marketId : true))
      .map((val) => ({
        ...val.position,
        marketAcc: val.marketAcc,
        isCross: MarketAccLib.isCrossMarket(val.marketAcc),
      }));
    return positions;
  }

  async getActiveOrdersFromContract(params: GetActiveOrdersFromContractParams) {
    const { marketId, userAddress, accountId, tokenId } = params;
    const explorerContract = this.contractsFactory.getExplorerContract(getExplorerContractAddress());
    const marketAcc = MarketAccLib.pack(userAddress ?? this.root, accountId ?? this.accountId, tokenId, marketId);
    const crossMarketAcc = MarketAccLib.pack(
      userAddress ?? this.root,
      accountId ?? this.accountId,
      tokenId,
      CROSS_MARKET_ID
    );
    const [userInfo, crossUserInfo, marketInfo, blockNumber] = await Promise.all([
      explorerContract.getUserInfo(marketAcc),
      marketId !== CROSS_MARKET_ID ? explorerContract.getUserInfo(crossMarketAcc) : undefined,
      explorerContract.getMarketInfo(marketId),
      this.publicClient.getBlockNumber(),
    ]);
    const positions = userInfo.positions
      .concat(crossUserInfo?.positions ?? [])
      .filter((position) => (marketId !== CROSS_MARKET_ID ? position.marketId === marketId : true));

    const limitOrders = positions.flatMap((position) => {
      const orders = position.orders;
      return orders.map((order) => {
        const { side, tickIndex } = OrderIdLib.unpack(order.id);
        const size = order.size;
        return {
          side,
          size,
          placedSized: undefined,
          unfilledSize: size,
          tick: tickIndex,
          impliedApr: getRateAtTick(BigInt(tickIndex), BigInt(marketInfo.tickStep)).toNumber(),
          orderId: order.id,
          root: userAddress ?? this.root,
          marketId: position.marketId,
          accountId: accountId ?? this.accountId,
          isCross: MarketAccLib.isCrossMarket(order.maker),
          status: 0,
          orderType: 0,
          marketAcc: order.maker,
        };
      });
    });

    return {
      results: limitOrders,
      total: limitOrders.length,
      blockNumber,
    };
  }

  async getOrdersPage(params?: GetOrdersPageParams) {
    const { root, accountId, marketId, isActive, orderType, resumeToken, limit } = params ?? {};
    const [{ data: ordersResponse }, blockNumber] = await Promise.all([
      this.openApiSdk.accounts.accountsV2ControllerGetOrders({
        root: root ?? this.root,
        accountId: accountId ?? this.accountId,
        marketId,
        isActive,
        orderType: orderType?.map(String).join(','),
        resumeToken,
        limit,
      }),
      this.publicClient.getBlockNumber(),
    ]);
    return {
      ...ordersResponse,
      blockNumber,
    };
  }

  async getAgentExpiryTime(params?: GetAgentExpiryTimeParams): Promise<number> {
    const agentAddress = params?.agentAddress ?? (await this.agent?.getAddress());
    if (!agentAddress) {
      throw new Error('agentAddress is required when no agent is set on this Exchange instance');
    }
    const { data } = await this.openApiSdk.agents.agentsV2ControllerGetAgentExpiryTime({
      root: params?.root ?? this.root,
      accountId: params?.accountId ?? this.accountId,
      agentAddress,
    });
    return data.expiryTime;
  }

  async getAssets() {
    const { data: getAssetsCalldataResponse } = await this.openApiSdk.assets.assetsControllerListAssets();
    return getAssetsCalldataResponse;
  }

  async approveAgentData(params: ApproveAgentReq) {
    const calldata = functionEncoder.approveAgent(params);
    return {
      from: params.root,
      to: getRouterAddress(),
      data: calldata,
    };
  }

  async revokeAgentData(params: RevokeAgentReq) {
    const calldata = functionEncoder.revokeAgent(params);
    return {
      from: params.root,
      to: getRouterAddress(),
      data: calldata,
    };
  }
}
