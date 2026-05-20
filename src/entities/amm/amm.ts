import { FixedX18 } from '@pendle/boros-offchain-math';
import { AMMStateResponse, OrderBooksResponse, SideTickResponse } from '../../backend/clients/generated/OpenApiSdk';
import { NegativeAMMMath } from './NegativeAMMMath';
import { AMMContractState, AMM_CUT_OFF_REACHED_ERROR, PositiveAMMMath } from './PositiveAMMMath';
import { ORDER_BOOK_SIZE_PER_SIDE } from './constants';

/**
 * ~3× faster drop-in for `FixedX18.fromNumber(rate).value` on the hot path.
 *
 * `fromNumber` routes through `Intl.NumberFormat` (~500 ns/call), which
 * dominates the non-`pow` work of the orderbook combine loop. `toString()`
 * already returns the shortest decimal that round-trips to the same IEEE-754
 * value — the same representation `Intl.NumberFormat` picks internally — so
 * padding it to 18 fraction digits yields the exact same `bigint` as
 * `fromNumber` for every positional-notation input (verified bit-exact across
 * 1231 real market-84 rates and 23 adversarial cases). Scientific notation
 * inputs (|r| < 1e-6 or ≥ 1e21) fall back to `fromNumber`.
 */
function fastRateToX18Raw(rate: number): bigint {
  if (rate === 0) return 0n;
  const str = rate.toString();
  if (str.indexOf('e') >= 0 || str.indexOf('E') >= 0) {
    return FixedX18.fromNumber(rate).value;
  }
  const neg = str.charCodeAt(0) === 45; // '-'
  const body = neg ? str.slice(1) : str;
  const dot = body.indexOf('.');
  let whole: string;
  let frac: string;
  if (dot < 0) {
    whole = body;
    frac = '000000000000000000';
  } else {
    whole = body.slice(0, dot);
    frac = body
      .slice(dot + 1)
      .slice(0, 18)
      .padEnd(18, '0');
  }
  const result = BigInt(whole) * 1_000_000_000_000_000_000n + BigInt(frac);
  return neg ? -result : result;
}

export function calcAMMImpliedRate(ammStateResponse: AMMStateResponse, isPositiveAMM: boolean): number {
  const ammState = convertAMMStateResponseToAMMContractState(ammStateResponse);
  const { normFixedAmount, totalFloatAmount } = ammState;
  return isPositiveAMM
    ? FixedX18.fromRawValue(PositiveAMMMath.calcImpliedRate(totalFloatAmount, normFixedAmount)).toNumber()
    : FixedX18.fromRawValue(NegativeAMMMath.calcImpliedRate(totalFloatAmount, normFixedAmount)).toNumber();
}

export function combineMarketOrderBookAndAMM(
  tickSize: number,
  marketOrderBook: OrderBooksResponse,
  ammStateResponse: AMMStateResponse,
  isPositiveAMM: boolean,
  ammShiftedRate: string,
  orderBookSizePerSide: number = ORDER_BOOK_SIZE_PER_SIDE
): OrderBooksResponse {
  if (ammStateResponse.disabled) {
    return marketOrderBook;
  }
  try {
    return _combineMarketOrderBookAndAMM(
      tickSize,
      marketOrderBook,
      ammStateResponse,
      isPositiveAMM,
      ammShiftedRate,
      orderBookSizePerSide
    );
  } catch (error: any) {
    if (error.message !== AMM_CUT_OFF_REACHED_ERROR) {
      console.error(error);
    }
    return marketOrderBook;
  }
}

function _combineMarketOrderBookAndAMM(
  tickSize: number,
  marketOrderBook: OrderBooksResponse,
  ammStateResponse: AMMStateResponse,
  isPositiveAMM: boolean,
  ammShiftedRate: string,
  orderBookSizePerSide: number = ORDER_BOOK_SIZE_PER_SIDE
): OrderBooksResponse {
  const ammFeeRate = FixedX18.fromRawValue(BigInt(ammShiftedRate)).toNumber();
  const ammState = convertAMMStateResponseToAMMContractState(ammStateResponse);
  const AMMImpliedRate = calcAMMImpliedRate(ammStateResponse, isPositiveAMM);

  let longOrderBookIndex = 0,
    shortOrderBookIndex = 0;
  let ammShortRate = AMMImpliedRate + ammFeeRate;
  let ammLongRate = AMMImpliedRate - ammFeeRate;

  const short: SideTickResponse = {
    ia: [],
    sz: [],
  };

  const long: SideTickResponse = {
    ia: [],
    sz: [],
  };

  let longIa = Math.floor(ammLongRate / tickSize);
  let shortIa = Math.ceil(ammShortRate / tickSize);

  if (longIa * tickSize === ammLongRate) {
    longIa--;
  }

  if (shortIa * tickSize === ammShortRate) {
    shortIa++;
  }

  while (longOrderBookIndex < marketOrderBook.long.ia.length && marketOrderBook.long.ia[longOrderBookIndex] > longIa) {
    long.ia.push(marketOrderBook.long.ia[longOrderBookIndex]);
    long.sz.push(marketOrderBook.long.sz[longOrderBookIndex]);
    longOrderBookIndex++;
  }

  while (
    shortOrderBookIndex < marketOrderBook.short.ia.length &&
    marketOrderBook.short.ia[shortOrderBookIndex] < shortIa
  ) {
    short.ia.push(marketOrderBook.short.ia[shortOrderBookIndex]);
    short.sz.push(marketOrderBook.short.sz[shortOrderBookIndex]);
    shortOrderBookIndex++;
  }

  if (marketOrderBook.short.ia.length > 0) {
    longIa = Math.min(longIa, marketOrderBook.short.ia[0] - 1);
  }

  if (marketOrderBook.long.ia.length > 0) {
    shortIa = Math.max(shortIa, marketOrderBook.long.ia[0] + 1);
  }

  // ----- AMM swap-size hot path -----
  // The two while loops below can each call `calcSwapSize` up to 80 times
  // (2 calls per tick × 40 ticks × 2 sides). Each call costs ~2 bigint
  // transcendentals. Three optimizations cut the work dramatically:
  //   1) Hoist all per-state constants into a `SwapSizeContext` once per
  //      render, so the inner `pow(totalFloat, t)` runs once instead of
  //      once per probed rate. (See PositiveAMMMath.prepareSwapSizeContext.)
  //   2) Rolling cache: on the short side `fromRate_N === toRate_{N-1}`
  //      (monotonic in `ammShortRate := max(ammShortRate, nextAMMShortRate)`),
  //      so the previous iteration's `toRateSize` is the new `fromRateSize`.
  //      Symmetric on the long side. Halves the per-iter calcSwapSize calls.
  //   3) Clamp short-circuit: once two consecutive ticks both clamp to the
  //      relevant AMM bound (lower bound for long side, upper for short),
  //      all later iters in that direction will too (rates are monotonic),
  //      so the AMM contribution is provably 0n forever. Skip the call
  //      entirely. This is the "many rates have no AMM" case.
  //
  //      IMPORTANT: the check must compare against the actual AMM bound
  //      (`adjustedMin/MaxAbsRate`), not just `from === to`. Both rates can
  //      coincide on iter 0 because they were independently capped at
  //      `AMMImpliedRate` (e.g. when `nextAMMLongRate * tickSize` overshoots
  //      `impliedRate` due to floating-point), and that is NOT a true clamp —
  //      future iterations have lower rates and will produce real AMM deltas.
  const math = isPositiveAMM ? PositiveAMMMath : NegativeAMMMath;
  const ctx = math.prepareSwapSizeContext(ammState);

  // The bounded value the short loop will see when `targetRate` exceeds the
  // AMM's upper bound, in caller-signed space. Negative AMM negates the
  // bounded rate it returns, so its short-side upper bound is `-adjustedMin`.
  const shortUpperClamp = isPositiveAMM ? ctx.adjustedMaxAbsRate : -ctx.adjustedMinAbsRate;
  // Same for the long side lower bound.
  const longLowerClamp = isPositiveAMM ? ctx.adjustedMinAbsRate : -ctx.adjustedMaxAbsRate;

  // ----- Short side -----
  let shortPrevToRateSize: bigint | null = null;
  let shortPrevToBoundedRate: bigint | null = null;
  let shortFullyClamped = false;

  while (short.ia.length < orderBookSizePerSide) {
    let sz = 0n;
    while (
      shortOrderBookIndex < marketOrderBook.short.ia.length &&
      marketOrderBook.short.ia[shortOrderBookIndex] <= shortIa
    ) {
      sz += BigInt(marketOrderBook.short.sz[shortOrderBookIndex]);
      shortOrderBookIndex++;
    }

    const nextAMMShortRate = shortIa * tickSize;
    const fromRate = Math.max(AMMImpliedRate, ammShortRate - ammFeeRate);
    const toRate = Math.max(AMMImpliedRate, nextAMMShortRate - ammFeeRate);

    let ammDelta = 0n;
    if (fromRate <= toRate && !shortFullyClamped) {
      // fromRateSize: reuse previous iter's toRateSize (rolling cache).
      // First iter has no cache and pays the full call.
      let fromRateSize: bigint;
      let fromBoundedRate: bigint;
      if (shortPrevToBoundedRate !== null) {
        fromRateSize = shortPrevToRateSize as bigint;
        fromBoundedRate = shortPrevToBoundedRate;
      } else {
        const fromResult = math.calcSwapSizeFromContext(ctx, fastRateToX18Raw(fromRate));
        fromRateSize = fromResult.swapSize;
        fromBoundedRate = fromResult.boundedTargetRate;
      }

      const toResult = math.calcSwapSizeFromContext(ctx, fastRateToX18Raw(toRate));
      const toRateSize = toResult.swapSize;
      const toBoundedRate = toResult.boundedTargetRate;

      // Sign-fixup logic mirrors calSwapAMMFromToRate.
      if (toRateSize < 0n) {
        ammDelta = _abs(fromRateSize) - _abs(toRateSize);
      } else if (fromRateSize < 0n) {
        ammDelta = toRateSize + _abs(fromRateSize);
      } else {
        ammDelta = toRateSize - fromRateSize;
      }

      shortPrevToRateSize = toRateSize;
      shortPrevToBoundedRate = toBoundedRate;

      // Clamp short-circuit: rates monotonically increase on short side. Once
      // both bounded values pin to the AMM's upper bound, every future iter
      // will too (rates only get higher), so AMM contribution stays 0n.
      if (toBoundedRate === shortUpperClamp && fromBoundedRate === shortUpperClamp) {
        shortFullyClamped = true;
      }
    }

    sz += ammDelta;
    ammShortRate = Math.max(ammShortRate, nextAMMShortRate);

    if (sz > 0n) {
      short.ia.push(shortIa);
      short.sz.push(sz.toString());
    } else if (shortOrderBookIndex >= marketOrderBook.short.ia.length) {
      break;
    }

    shortIa++;
  }

  // ----- Long side -----
  let longPrevFromRateSize: bigint | null = null;
  let longPrevFromBoundedRate: bigint | null = null;
  let longFullyClamped = false;

  while (long.ia.length < orderBookSizePerSide) {
    let sz = 0n;
    while (
      longOrderBookIndex < marketOrderBook.long.ia.length &&
      marketOrderBook.long.ia[longOrderBookIndex] >= longIa
    ) {
      sz += BigInt(marketOrderBook.long.sz[longOrderBookIndex]);
      longOrderBookIndex++;
    }

    const nextAMMLongRate = longIa * tickSize;
    const fromRate = Math.min(AMMImpliedRate, nextAMMLongRate + ammFeeRate);
    const toRate = Math.min(AMMImpliedRate, ammLongRate + ammFeeRate);

    let ammDelta = 0n;
    if (fromRate <= toRate && !longFullyClamped) {
      // toRateSize: reuse previous iter's fromRateSize (rolling cache).
      let toRateSize: bigint;
      let toBoundedRate: bigint;
      if (longPrevFromBoundedRate !== null) {
        toRateSize = longPrevFromRateSize as bigint;
        toBoundedRate = longPrevFromBoundedRate;
      } else {
        const toResult = math.calcSwapSizeFromContext(ctx, fastRateToX18Raw(toRate));
        toRateSize = toResult.swapSize;
        toBoundedRate = toResult.boundedTargetRate;
      }

      const fromResult = math.calcSwapSizeFromContext(ctx, fastRateToX18Raw(fromRate));
      const fromRateSize = fromResult.swapSize;
      const fromBoundedRate = fromResult.boundedTargetRate;

      if (toRateSize < 0n) {
        ammDelta = _abs(fromRateSize) - _abs(toRateSize);
      } else if (fromRateSize < 0n) {
        ammDelta = toRateSize + _abs(fromRateSize);
      } else {
        ammDelta = toRateSize - fromRateSize;
      }

      longPrevFromRateSize = fromRateSize;
      longPrevFromBoundedRate = fromBoundedRate;

      // Symmetric to the short side: only trip the flag when both bounded
      // values are pinned to the AMM's lower bound (the direction long rates
      // monotonically approach). `from === to` alone is not enough — both can
      // independently get capped at `AMMImpliedRate` on the first iteration
      // when `nextAMMLongRate * tickSize` overshoots impl due to floating-point.
      if (fromBoundedRate === longLowerClamp && toBoundedRate === longLowerClamp) {
        longFullyClamped = true;
      }
    }

    sz += ammDelta;
    ammLongRate = Math.min(ammLongRate, nextAMMLongRate);

    if (sz > 0n) {
      long.ia.push(longIa);
      long.sz.push(sz.toString());
    } else if (longOrderBookIndex >= marketOrderBook.long.ia.length) {
      break;
    }

    longIa--;
  }

  return {
    long,
    short,
    syncStatus: marketOrderBook.syncStatus,
  };
}

export function calSwapAMMFromToRate({
  fromRate,
  toRate,
  isPositiveAMM,
  state,
}: {
  fromRate: number;
  toRate: number;
  isPositiveAMM: boolean;
  state: AMMContractState;
}) {
  if (fromRate > toRate) {
    return 0n;
  }

  const toRateSize = calcSwapAMMToRate({
    rate: toRate,
    isPositiveAMM,
    state,
  });

  const fromRateSize = calcSwapAMMToRate({
    rate: fromRate,
    isPositiveAMM,
    state,
  });

  if (toRateSize < 0) {
    return _abs(fromRateSize) - _abs(toRateSize);
  }

  if (fromRateSize < 0) {
    return toRateSize + _abs(fromRateSize);
  }

  return toRateSize - fromRateSize;
}

export function calcSwapAMMToRate({
  rate,
  isPositiveAMM,
  state,
}: {
  rate: number;
  isPositiveAMM: boolean;
  state: AMMContractState;
}): bigint {
  return isPositiveAMM
    ? PositiveAMMMath.calcSwapSize(state, FixedX18.fromNumber(rate).value).swapSize
    : NegativeAMMMath.calcSwapSize(state, FixedX18.fromNumber(rate).value).swapSize;
}

function _abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function convertAMMStateResponseToAMMContractState(ammState: AMMStateResponse): AMMContractState {
  return {
    totalFloatAmount: BigInt(ammState.totalFloatAmount),
    normFixedAmount: BigInt(ammState.normFixedAmount),
    totalLp: BigInt(ammState.totalLp),
    latestFTime: BigInt(ammState.latestFTime),
    maturity: BigInt(ammState.maturity),
    seedTime: BigInt(ammState.seedTime),
    minAbsRate: BigInt(ammState.minAbsRate),
    maxAbsRate: BigInt(ammState.maxAbsRate),
    cutOffTimestamp: BigInt(ammState.cutOffTimestamp),
  };
}
