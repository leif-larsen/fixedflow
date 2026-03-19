import { error, fail, redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { categories, services } from '$lib/db/schema.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		error(404, 'Not found');
	}

	const [category] = await db.select().from(categories).where(eq(categories.id, id));

	if (!category) {
		error(404, 'Not found');
	}

	const categoryServices = await db
		.select()
		.from(services)
		.where(eq(services.categoryId, id))
		.orderBy(asc(services.name));

	return { category, services: categoryServices };
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const id = parseInt(params.id, 10);

		if (isNaN(id)) {
			error(404, 'Not found');
		}

		const data = await request.formData();
		const name = (data.get('name') ?? '').toString().trim();
		const amountRaw = (data.get('amount') ?? '').toString().trim();
		const frequency = (data.get('frequency') ?? '').toString().trim();
		const billingMonthRaw = (data.get('billingMonth') ?? '').toString().trim();
		const activeFrom = (data.get('activeFrom') ?? '').toString().trim();

		const errors: Record<string, string> = {};

		if (!name) {
			errors.name = 'Name is required.';
		}

		const amount = parseFloat(amountRaw);
		if (!amountRaw || isNaN(amount) || amount <= 0) {
			errors.amount = 'Amount must be a positive number.';
		}

		if (!['monthly', 'quarterly', 'yearly'].includes(frequency)) {
			errors.frequency = 'Frequency must be monthly, quarterly, or yearly.';
		}

		const billingMonth = parseInt(billingMonthRaw, 10);
		if (isNaN(billingMonth) || billingMonth < 1 || billingMonth > 12) {
			errors.billingMonth = 'Billing month must be between 1 and 12.';
		}

		if (!activeFrom || isNaN(Date.parse(activeFrom))) {
			errors.activeFrom = 'Active from must be a valid date.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(422, { errors, name, amount: amountRaw, frequency, billingMonth: billingMonthRaw, activeFrom });
		}

		const now = new Date().toISOString();

		await db.insert(services).values({
			categoryId: id,
			name,
			amount,
			currency: 'NOK',
			frequency: frequency as 'monthly' | 'quarterly' | 'yearly',
			billingMonth,
			activeFrom,
			activeUntil: null,
			notes: null,
			createdAt: now,
			updatedAt: now
		});

		redirect(303, `/categories/${id}`);
	}
};
