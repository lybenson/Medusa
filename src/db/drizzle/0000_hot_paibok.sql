CREATE TABLE `sentence_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `sentences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original` text NOT NULL,
	`translation` text NOT NULL,
	`grammar` text,
	`group_id` integer DEFAULT 1,
	`learned` integer DEFAULT false,
	`deleted` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original` text NOT NULL,
	`translation` text NOT NULL,
	`sentence_id` integer,
	`deleted` integer DEFAULT false,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sentences_original_unique` ON `sentences` (`original`);--> statement-breakpoint
CREATE UNIQUE INDEX `words_original_sentence_id_unique` ON `words` (`original`,`sentence_id`);