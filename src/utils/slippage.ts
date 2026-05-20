import { FixedX18 } from '@pendle/boros-offchain-math';

/**
 * Apply slippage to an amount, returning the minimum acceptable amount.
 * @param amount - The original amount as bigint
 * @param slippage - The slippage percentage (e.g., 0.01 for 1%)
 * @returns The slipped-down amount as bigint
 */
export function applySlippage(amount: bigint, slippage: number): bigint {
  return FixedX18.fromRawValue(amount).mulDown(FixedX18.fromNumber(1 - slippage)).value;
}
