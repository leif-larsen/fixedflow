import { fail, redirect } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { people } from '$lib/db/schema.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	const allPeople = await db.select().from(people).orderBy(asc(people.name));
	return { people: allPeople };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') ?? '').toString().trim();
		const color = (data.get('color') ?? '#6366f1').toString().trim();

		if (!name) {
			return fail(422, { errors: { name: 'Name is required' }, name, color });
		}
		if (name.length > 50) {
			return fail(422, { errors: { name: 'Name must be 50 characters or less' }, name, color });
		}

		await db.insert(people).values({
			name,
			color,
			createdAt: new Date().toISOString()
		});

		redirect(303, '/people');
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt((data.get('id') ?? '').toString(), 10);

		if (!isNaN(id)) {
			await db.delete(people).where(eq(people.id, id));
		}

		redirect(303, '/people');
	}
};
