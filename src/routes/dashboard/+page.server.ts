import { eq } from 'drizzle-orm';
import { db } from '$lib/db/index.js';
import { categories, services } from '$lib/db/schema.js';
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

	type CategoryTotal = {
		categoryId: number;
		categoryName: string;
		categoryColor: string;
		total: number;
	};

	const monthData = Array.from({ length: 12 }, () => ({
		total: 0,
		byCategory: new Map<number, CategoryTotal>()
	}));

	for (const service of activeServices) {
		const months = getBillingMonths(service.frequency, service.billingMonth);
		for (const month of months) {
			const idx = month - 1;
			monthData[idx].total += service.amount;

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
		}
	}

	const months = monthData.map((data, i) => ({
		month: i + 1,
		monthName: MONTH_NAMES[i],
		total: data.total,
		byCategory: Array.from(data.byCategory.values()).sort((a, b) =>
			a.categoryName.localeCompare(b.categoryName)
		)
	}));

	return { months };
};
