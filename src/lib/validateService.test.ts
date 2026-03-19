import { describe, it, expect } from 'vitest';
import { validateServiceForm } from './validateService.js';

const valid = {
	name: 'Netflix',
	amountRaw: '9.99',
	frequency: 'monthly',
	billingMonthRaw: '1',
	activeFrom: '2024-01-01'
};

describe('validateServiceForm', () => {
	it('returns no errors for valid input', () => {
		const { errors } = validateServiceForm(valid);
		expect(errors).toEqual({});
	});

	it('errors on empty name', () => {
		const { errors } = validateServiceForm({ ...valid, name: '' });
		expect(errors.name).toBe('Name is required.');
	});

	it('errors on zero amount', () => {
		const { errors } = validateServiceForm({ ...valid, amountRaw: '0' });
		expect(errors.amount).toBe('Amount must be a positive number.');
	});

	it('errors on negative amount', () => {
		const { errors } = validateServiceForm({ ...valid, amountRaw: '-5' });
		expect(errors.amount).toBe('Amount must be a positive number.');
	});

	it('errors on non-numeric amount', () => {
		const { errors } = validateServiceForm({ ...valid, amountRaw: 'abc' });
		expect(errors.amount).toBe('Amount must be a positive number.');
	});

	it('errors on empty amount', () => {
		const { errors } = validateServiceForm({ ...valid, amountRaw: '' });
		expect(errors.amount).toBe('Amount must be a positive number.');
	});

	it('errors on invalid frequency', () => {
		const { errors } = validateServiceForm({ ...valid, frequency: 'weekly' });
		expect(errors.frequency).toBe('Frequency must be monthly, quarterly, or yearly.');
	});

	it('accepts all valid frequency values', () => {
		for (const frequency of ['monthly', 'quarterly', 'yearly']) {
			const { errors } = validateServiceForm({ ...valid, frequency });
			expect(errors.frequency).toBeUndefined();
		}
	});

	it('errors on billingMonth below 1', () => {
		const { errors } = validateServiceForm({ ...valid, billingMonthRaw: '0' });
		expect(errors.billingMonth).toBe('Billing month must be between 1 and 12.');
	});

	it('errors on billingMonth above 12', () => {
		const { errors } = validateServiceForm({ ...valid, billingMonthRaw: '13' });
		expect(errors.billingMonth).toBe('Billing month must be between 1 and 12.');
	});

	it('errors on non-numeric billingMonth', () => {
		const { errors } = validateServiceForm({ ...valid, billingMonthRaw: 'jan' });
		expect(errors.billingMonth).toBe('Billing month must be between 1 and 12.');
	});

	it('errors on invalid activeFrom date', () => {
		const { errors } = validateServiceForm({ ...valid, activeFrom: 'not-a-date' });
		expect(errors.activeFrom).toBe('Active from must be a valid date.');
	});

	it('errors on empty activeFrom', () => {
		const { errors } = validateServiceForm({ ...valid, activeFrom: '' });
		expect(errors.activeFrom).toBe('Active from must be a valid date.');
	});

	it('parses amount correctly on valid input', () => {
		const { amount } = validateServiceForm({ ...valid, amountRaw: '12.50' });
		expect(amount).toBe(12.5);
	});

	it('parses billingMonth correctly on valid input', () => {
		const { billingMonth } = validateServiceForm({ ...valid, billingMonthRaw: '6' });
		expect(billingMonth).toBe(6);
	});
});
