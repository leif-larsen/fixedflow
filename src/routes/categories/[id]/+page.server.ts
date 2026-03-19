import { error, fail, redirect } from '@sveltejs/kit';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { categories, services } from '$lib/db/schema.js';
import { validateServiceForm } from '$lib/validateService.js';
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
	deleteService: async ({ request, params }) => {
		const id = parseInt(params.id, 10);

		const data = await request.formData();
		const serviceId = parseInt((data.get('id') ?? '').toString(), 10);

		if (!isNaN(serviceId)) {
			await db.delete(services).where(and(eq(services.id, serviceId), eq(services.categoryId, id)));
		}

		redirect(303, `/categories/${id}`);
	},

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

		const now = new Date().toISOString();

		await db.insert(services).values({
			categoryId: id,
			name,
			amount,
			currency: 'EUR',
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
