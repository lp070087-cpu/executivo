CREATE TABLE `client_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `request_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`sender` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
