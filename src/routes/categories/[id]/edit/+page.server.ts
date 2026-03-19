import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { categories } from '$lib/db/schema.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
	const categoryId = parseInt(params.id, 10);

	if (isNaN(categoryId)) {
		error(404, 'Not found');
	}

	const [category] = await db.select().from(categories).where(eq(categories.id, categoryId));

	if (!category) {
		error(404, 'Not found');
	}

	return { category };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const categoryId = parseInt(params.id, 10);

		if (isNaN(categoryId)) {
			error(404, 'Not found');
		}

		const data = await request.formData();
		const name = (data.get('name') ?? '').toString().trim();
		const color = (data.get('color') ?? '').toString().trim();

		const errors: Record<string, string> = {};

		if (!name) {
			errors.name = 'Name is required.';
		} else if (name.length > 50) {
			errors.name = 'Name must be 50 characters or fewer.';
		}

		if (!color) {
			errors.color = 'Colour is required.';
		} else if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
			errors.color = 'Colour must be a valid hex colour (e.g. #ff0000).';
		}

		if (Object.keys(errors).length > 0) {
			return fail(422, { errors, name, color });
		}

		const [existing] = await db.select().from(categories).where(eq(categories.id, categoryId));

		if (!existing) {
			error(404, 'Not found');
		}

		await db.update(categories).set({ name, color }).where(eq(categories.id, categoryId));

		redirect(303, '/');
	}
};
