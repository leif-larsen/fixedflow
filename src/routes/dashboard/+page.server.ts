import { eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { categories, people, servicePeople, services } from '$lib/db/schema.js';
import { getBillingMonths } from '$lib/billingMonths.js';
import type { PageServerLoad } from './$types.js';

const MONTH_NAMES = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];

export const load: PageServerLoad = async () => {
	const today = new Date().toISOString().slice(0, 10);

	const rows = await db
		.select({
			serviceId: services.id,
			amount: services.amount,
			frequency: services.frequency,
			billingMonth: services.billingMonth,
			activeFrom: services.activeFrom,
			activeUntil: services.activeUntil,
			active: services.active,
			categoryId: categories.id,
			categoryName: categories.name,
			categoryColor: categories.color
		})
		.from(services)
		.innerJoin(categories, eq(services.categoryId, categories.id));

	const activeServices = rows.filter(
		(row) =>
			row.active === 1 &&
			row.activeFrom <= today &&
			(row.activeUntil === null || row.activeUntil >= today)
	);

	// Load people and service assignments
	const allPeople = await db.select().from(people);
	const allAssignments = await db.select().from(servicePeople);

	const servicePersonMap = new Map<number, number[]>();
	for (const a of allAssignments) {
		if (!servicePersonMap.has(a.serviceId)) servicePersonMap.set(a.serviceId, []);
		servicePersonMap.get(a.serviceId)!.push(a.personId);
	}

	const personMap = new Map(allPeople.map((p) => [p.id, p]));

	type CategoryTotal = {
		categoryId: number;
		categoryName: string;
		categoryColor: string;
		total: number;
	};

	type PersonTotal = {
		personId: number;
		personName: string;
		personColor: string;
		total: number;
	};

	const monthData = Array.from({ length: 12 }, () => ({
		total: 0,
		byCategory: new Map<number, CategoryTotal>(),
		byPerson: new Map<number, PersonTotal>()
	}));

	for (const service of activeServices) {
		const months = getBillingMonths(service.frequency, service.billingMonth);
		const assignedPersonIds = servicePersonMap.get(service.serviceId) ?? [];

		for (const month of months) {
			const idx = month - 1;
			monthData[idx].total += service.amount;

			// Category breakdown
			const existing = monthData[idx].byCategory.get(service.categoryId);
			if (existing) {
				existing.total += service.amount;
			} else {
				monthData[idx].byCategory.set(service.categoryId, {
					categoryId: service.categoryId,
					categoryName: service.categoryName,
					categoryColor: service.categoryColor,
					total: service.amount
				});
			}

			// Per-person breakdown (split equally among assigned people)
			if (assignedPersonIds.length > 0) {
				const share = service.amount / assignedPersonIds.length;
				for (const personId of assignedPersonIds) {
					const person = personMap.get(personId);
					if (!person) continue;
					const existingPerson = monthData[idx].byPerson.get(personId);
					if (existingPerson) {
						existingPerson.total += share;
					} else {
						monthData[idx].byPerson.set(personId, {
							personId,
							personName: person.name,
							personColor: person.color,
							total: share
						});
					}
				}
			}
		}
	}

	const months = monthData.map((data, i) => ({
		month: i + 1,
		monthName: MONTH_NAMES[i],
		total: data.total,
		byCategory: Array.from(data.byCategory.values()).sort((a, b) =>
			a.categoryName.localeCompare(b.categoryName)
		),
		byPerson: Array.from(data.byPerson.values()).sort((a, b) =>
			a.personName.localeCompare(b.personName)
		)
	}));

	return { months, hasPeople: allPeople.length > 0 };
};
