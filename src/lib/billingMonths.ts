/**
 * Returns the list of months (1–12) in which a service incurs a charge,
 * based on its frequency and billing month.
 */
export function getBillingMonths(
	frequency: 'monthly' | 'quarterly' | 'yearly',
	billingMonth: number
): number[] {
	if (frequency === 'monthly') {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	}

	if (frequency === 'yearly') {
		return [billingMonth];
	}

	// quarterly: billing_month, +3, +6, +9 (mod 12, 1-based)
	const months: number[] = [];
	for (let i = 0; i < 4; i++) {
		months.push(((billingMonth - 1 + i * 3) % 12) + 1);
	}
	return months;
}
