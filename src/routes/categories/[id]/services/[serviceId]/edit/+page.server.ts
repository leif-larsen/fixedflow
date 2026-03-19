import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { categories, services } from '$lib/db/schema.js';
import { validateServiceForm } from '$lib/validateService.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const categoryId = parseInt(params.id, 10);
	const serviceId = parseInt(params.serviceId, 10);

	if (isNaN(categoryId) || isNaN(serviceId)) {
		error(404, 'Not found');
	}

	const [category] = await db.select().from(categories).where(eq(categories.id, categoryId));

	if (!category) {
		error(404, 'Not found');
	}

	const [service] = await db.select().from(services).where(eq(services.id, serviceId));

	if (!service || service.categoryId !== categoryId) {
		error(404, 'Not found');
	}

	return { category, service };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const categoryId = parseInt(params.id, 10);
		const serviceId = parseInt(params.serviceId, 10);

		if (isNaN(categoryId) || isNaN(serviceId)) {
			error(404, 'Not found');
		}

		const data = await request.formData();
		const name = (data.get('name') ?? '').toString().trim();
		const amountRaw = (data.get('amount') ?? '').toString().trim();
		const frequency = (data.get('frequency') ?? '').toString().trim();
		const billingMonthRaw = (data.get('billingMonth') ?? '').toString().trim();
		const activeFrom = (data.get('activeFrom') ?? '').toString().trim();

		const { errors, amount, billingMonth } = validateServiceForm({
			name,
			amountRaw,
			frequency,
			billingMonthRaw,
			activeFrom
		});

		if (Object.keys(errors).length > 0) {
			return fail(422, { errors, name, amount: amountRaw, frequency, billingMonth: billingMonthRaw, activeFrom });
		}

		const [existing] = await db.select().from(services).where(eq(services.id, serviceId));

		if (!existing || existing.categoryId !== categoryId) {
			error(404, 'Not found');
		}

		await db
			.update(services)
			.set({
				name,
				amount,
				frequency: frequency as 'monthly' | 'quarterly' | 'yearly',
				billingMonth,
				activeFrom,
				updatedAt: new Date().toISOString()
			})
			.where(eq(services.id, serviceId));

		redirect(303, `/categories/${categoryId}`);
	}
};
