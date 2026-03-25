CREATE TABLE `people` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL DEFAULT '#6366f1',
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `service_people` (
	`service_id` integer NOT NULL REFERENCES `services`(`id`) ON DELETE CASCADE,
	`person_id` integer NOT NULL REFERENCES `people`(`id`) ON DELETE CASCADE,
	PRIMARY KEY(`service_id`, `person_id`)
);
