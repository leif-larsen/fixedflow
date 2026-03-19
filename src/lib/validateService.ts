export interface ServiceFormErrors {
	name?: string;
	amount?: string;
	frequency?: string;
	billingMonth?: string;
	activeFrom?: string;
}

export function validateServiceForm(data: {
	name: string;
	amountRaw: string;
	frequency: string;
	billingMonthRaw: string;
	activeFrom: string;
}): { errors: ServiceFormErrors; amount: number; billingMonth: number } {
	const errors: ServiceFormErrors = {};

	if (!data.name) {
		errors.name = 'Name is required.';
	}

	const amount = parseFloat(data.amountRaw);
	if (!data.amountRaw || isNaN(amount) || amount <= 0) {
		errors.amount = 'Amount must be a positive number.';
	}

	if (!['monthly', 'quarterly', 'yearly'].includes(data.frequency)) {
		errors.frequency = 'Frequency must be monthly, quarterly, or yearly.';
	}

	const billingMonth = parseInt(data.billingMonthRaw, 10);
	if (isNaN(billingMonth) || billingMonth < 1 || billingMonth > 12) {
		errors.billingMonth = 'Billing month must be between 1 and 12.';
	}

	if (!data.activeFrom || isNaN(Date.parse(data.activeFrom))) {
		errors.activeFrom = 'Active from must be a valid date.';
	}

	return { errors, amount, billingMonth };
}
