CREATE TABLE `dashboard_widgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`title` varchar(200) NOT NULL,
	`config` text NOT NULL,
	`position` int DEFAULT 0,
	`isVisible` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dashboard_widgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `data_imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` text NOT NULL,
	`type` enum('csv','excel','json','xml') NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`recordsProcessed` int DEFAULT 0,
	`recordsTotal` int,
	`errorLog` text,
	`config` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `data_imports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(500) NOT NULL,
	`originalName` varchar(500),
	`fileUrl` text NOT NULL,
	`fileKey` text NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`category` varchar(100),
	`tags` text,
	`ocrText` text,
	`ocrProcessed` boolean DEFAULT false,
	`source` enum('upload','email','onedrive','box','hubspot') DEFAULT 'upload',
	`sourceId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('onedrive','box','email','hubspot') NOT NULL,
	`name` varchar(200) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`config` text NOT NULL,
	`lastSyncAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `integrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`type` enum('financial','analytics','custom','data_analysis') NOT NULL,
	`description` text,
	`config` text,
	`fileUrl` text,
	`fileKey` text,
	`status` enum('generating','completed','failed') NOT NULL DEFAULT 'generating',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`status` enum('todo','in_progress','completed','cancelled') NOT NULL DEFAULT 'todo',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`dueDate` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int NOT NULL,
	`comment` text NOT NULL,
	`isInternal` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ticket_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text NOT NULL,
	`status` enum('open','in_progress','waiting','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`category` varchar(100),
	`assignedTo` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('income','expense','transfer') NOT NULL,
	`category` varchar(100),
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`description` text,
	`transactionDate` timestamp NOT NULL,
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`flagged` boolean DEFAULT false,
	`flagReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `user_idx` ON `dashboard_widgets` (`userId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `data_imports` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `data_imports` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `documents` (`category`);--> statement-breakpoint
CREATE INDEX `source_idx` ON `documents` (`source`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `integrations` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `integrations` (`type`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `reports` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `reports` (`type`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `tasks` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `tasks` (`status`);--> statement-breakpoint
CREATE INDEX `ticket_idx` ON `ticket_comments` (`ticketId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `ticket_comments` (`userId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `tickets` (`userId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `tickets` (`status`);--> statement-breakpoint
CREATE INDEX `assigned_idx` ON `tickets` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `transactions` (`userId`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `transactions` (`transactionDate`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `transactions` (`status`);