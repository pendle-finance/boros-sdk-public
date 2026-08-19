import { Hex } from 'viem';
import { OpenApiSdk, getOpenApiSdk } from '../../backend/clients/module';
import { Account, Side, TimeInForce } from '../../types';
import { signCancelStopOrderV2Request, signStopOrderRequest } from '../../utils';
import { ListStopOrdersParams, PlaceStopOrderParams } from './types';

/**
 * Take-profit / stop-loss orders on `open-api`. Reads need only the API signing key; writes
 * also need `setInternalAgent()` to have run with an agent approved on the account.
 */
export class StopOrders {
  private readonly injectedSdk?: OpenApiSdk;

  // No accountId: every route packs the account from the API key's root plus a fixed sub-account 0.
  // Accepting one here would be silently dropped by the backend and read as account 0.
  constructor(openApiSdk?: OpenApiSdk) {
    this.injectedSdk = openApiSdk;
  }

  // Read per call, not captured: setOpenApiSigningKey() works by invalidating the module
  // cache, and every endpoint here needs the key, so a captured client would 401 forever.
  private get openApiSdk(): OpenApiSdk {
    return this.injectedSdk ?? getOpenApiSdk();
  }

  async list(params: ListStopOrdersParams = {}) {
    const { data } = await this.openApiSdk.stopOrders.stopOrdersControllerGetStopOrders(params);
    return data;
  }

  async get(orderId: Hex) {
    const { data } = await this.openApiSdk.stopOrders.stopOrdersControllerGetStopOrder({ orderId });
    return data;
  }

  /** Builds the struct to sign. Only useful on its own to inspect or sign elsewhere — `place()` does this step. */
  async prepare(params: PlaceStopOrderParams) {
    const { data } = await this.openApiSdk.stopOrders.stopOrdersControllerPrepareTpslStopOrder({
      marketId: params.marketId,
      isCross: params.isCross,
      side: params.side,
      type: params.type,
      closePosition: params.closePosition ?? false,
      // Ignored by the backend when closePosition is set, but the query field is required.
      size: (params.size ?? 0n).toString(),
      stopApr: params.stopApr,
    });
    return data;
  }

  /** prepare -> sign with the agent -> submit. Returns the order hash, which is the `orderId`. */
  async place(params: PlaceStopOrderParams): Promise<Hex> {
    const { req, offchainCondition } = await this.prepare(params);

    const { agent, signature, orderHash } = await signStopOrderRequest({
      req: {
        account: req.account as Account,
        cross: req.cross,
        marketId: req.marketId,
        side: req.side as Side,
        tif: req.tif as TimeInForce,
        size: BigInt(req.size),
        tick: req.tick,
        reduceOnly: req.reduceOnly,
        salt: req.salt,
        expiry: req.expiry,
      },
      offchainCondition: offchainCondition as Hex,
    });

    const { data } = await this.openApiSdk.stopOrders.stopOrdersControllerPlaceStopOrder({
      agent,
      placeMsg: { actionHash: orderHash },
      placeSignature: signature,
      // `account` and `hashedOffchainCondition` are deliberately absent: the backend packs the
      // first from the API key's root and derives the second from `offchainCondition` below.
      request: {
        cross: req.cross,
        marketId: req.marketId,
        side: req.side,
        tif: req.tif,
        size: req.size,
        tick: req.tick,
        reduceOnly: req.reduceOnly,
        salt: req.salt,
        expiry: req.expiry,
      },
      offchainCondition,
      type: params.type,
      closePosition: params.closePosition ?? false,
    });

    return data.orderHash as Hex;
  }

  /** All-or-nothing: the request fails if any id is unknown, already finalised, or another account's. */
  async cancel(orderIds: Hex[]) {
    const { agent, signature } = await signCancelStopOrderV2Request({ orderIds });
    const { data } = await this.openApiSdk.stopOrders.stopOrdersControllerCancelStopOrders({
      agent,
      orderIds,
      cancelSignature: signature,
    });
    return data;
  }
}
