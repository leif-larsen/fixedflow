import { describe, it, expect } from 'vitest';
import { getBillingMonths } from './billingMonths.js';

describe('getBillingMonths', () => {
	describe('monthly', () => {
		it('returns all 12 months regardless of billingMonth', () => {
			expect(getBillingMonths('monthly', 1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
			expect(getBillingMonths('monthly', 6)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
			expect(getBillingMonths('monthly', 12)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		});
	});

	describe('yearly', () => {
		it('returns only the billing month', () => {
			expect(getBillingMonths('yearly', 1)).toEqual([1]);
			expect(getBillingMonths('yearly', 6)).toEqual([6]);
			expect(getBillingMonths('yearly', 12)).toEqual([12]);
		});
	});

	describe('quarterly', () => {
		it('returns 4 months starting from billingMonth=1', () => {
			expect(getBillingMonths('quarterly', 1)).toEqual([1, 4, 7, 10]);
		});

		it('returns 4 months starting from billingMonth=3', () => {
			expect(getBillingMonths('quarterly', 3)).toEqual([3, 6, 9, 12]);
		});

		it('wraps around year boundary when billingMonth=11', () => {
			expect(getBillingMonths('quarterly', 11)).toEqual([11, 2, 5, 8]);
		});

		it('wraps around year boundary when billingMonth=12', () => {
			expect(getBillingMonths('quarterly', 12)).toEqual([12, 3, 6, 9]);
		});

		it('wraps around year boundary when billingMonth=10', () => {
			expect(getBillingMonths('quarterly', 10)).toEqual([10, 1, 4, 7]);
		});

		it('returns exactly 4 months', () => {
			for (let m = 1; m <= 12; m++) {
				expect(getBillingMonths('quarterly', m)).toHaveLength(4);
			}
		});

		it('all returned months are in range 1–12', () => {
			for (let m = 1; m <= 12; m++) {
				const months = getBillingMonths('quarterly', m);
				for (const month of months) {
					expect(month).toBeGreaterThanOrEqual(1);
					expect(month).toBeLessThanOrEqual(12);
				}
			}
		});
	});
});
