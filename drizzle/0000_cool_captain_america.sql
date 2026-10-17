CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`category` text NOT NULL,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`date` text NOT NULL,
	`passengers` integer NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'Novo' NOT NULL,
	`created_at` text NOT NULL
);
