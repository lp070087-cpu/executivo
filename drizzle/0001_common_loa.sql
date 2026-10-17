CREATE TABLE `request_events` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`description` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `requests` ADD `pickup_time` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `requests` ADD `notes` text DEFAULT '' NOT NULL;