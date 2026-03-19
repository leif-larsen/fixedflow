import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { categories } from '$lib/db/schema.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const allCategories = await db.select().from(categories);
	return { categories: allCategories };
};

export const actions: Actions = {
	create: async ({ request }) => {
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

		await db.insert(categories).values({
			name,
			color,
			icon: '',
			createdAt: new Date().toISOString()
		});

		redirect(303, '/');
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt((data.get('id') ?? '').toString(), 10);

		if (!isNaN(id)) {
			// Associated services are removed automatically via ON DELETE CASCADE
			// (foreign_keys pragma is enabled in src/lib/db/index.ts)
			await db.delete(categories).where(eq(categories.id, id));
		}

		redirect(303, '/');
	}
};
