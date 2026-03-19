import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	color: text('color').notNull(),
	icon: text('icon').notNull(),
	createdAt: text('created_at').notNull()
});

export const services = sqliteTable('services', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	categoryId: integer('category_id')
		.notNull()
		.references(() => categories.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	amount: real('amount').notNull(),
	currency: text('currency').notNull().default('EUR'),
	frequency: text('frequency', { enum: ['monthly', 'quarterly', 'yearly'] }).notNull(),
	billingMonth: integer('billing_month').notNull().default(1),
	activeFrom: text('active_from').notNull(),
	activeUntil: text('active_until'),
	notes: text('notes'),
	active: integer('active').notNull().default(1),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});
