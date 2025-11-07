CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`message` text NOT NULL,
	`type` enum('info','success','warning','error') NOT NULL DEFAULT 'info',
	`category` varchar(100),
	`relatedId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`actionUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `is_read_idx` ON `notifications` (`isRead`);