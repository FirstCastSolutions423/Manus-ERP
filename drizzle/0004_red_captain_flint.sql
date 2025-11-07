CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`date` timestamp NOT NULL,
	`checkIn` timestamp,
	`checkOut` timestamp,
	`status` enum('present','absent','late','half_day','on_leave') NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(200) NOT NULL,
	`lastName` varchar(200) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`company` varchar(300),
	`jobTitle` varchar(200),
	`accountId` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` varchar(100) NOT NULL,
	`userId` int,
	`firstName` varchar(200) NOT NULL,
	`lastName` varchar(200) NOT NULL,
	`email` varchar(320),
	`phone` varchar(50),
	`department` varchar(200),
	`position` varchar(200),
	`managerId` int,
	`hireDate` timestamp,
	`status` enum('active','on_leave','terminated') NOT NULL DEFAULT 'active',
	`salary` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_employeeId_unique` UNIQUE(`employeeId`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(200),
	`lastName` varchar(200),
	`company` varchar(300),
	`email` varchar(320),
	`phone` varchar(50),
	`source` varchar(100),
	`status` enum('new','contacted','qualified','unqualified','converted') NOT NULL DEFAULT 'new',
	`score` int DEFAULT 0,
	`assignedTo` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`leaveType` enum('vacation','sick','personal','unpaid') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`days` int NOT NULL,
	`reason` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`approvedBy` int,
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(500) NOT NULL,
	`accountName` varchar(300),
	`contactId` int,
	`stage` enum('prospecting','qualification','proposal','negotiation','closed_won','closed_lost') NOT NULL DEFAULT 'prospecting',
	`amount` int,
	`probability` int DEFAULT 50,
	`expectedCloseDate` timestamp,
	`actualCloseDate` timestamp,
	`assignedTo` int NOT NULL,
	`notes` text,
	`lostReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`assignedTo` int,
	`status` enum('todo','in_progress','review','completed') NOT NULL DEFAULT 'todo',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`estimatedHours` int,
	`actualHours` int DEFAULT 0,
	`dueDate` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(500) NOT NULL,
	`description` text,
	`clientName` varchar(300),
	`status` enum('planning','in_progress','on_hold','completed','cancelled') NOT NULL DEFAULT 'planning',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`startDate` timestamp,
	`endDate` timestamp,
	`budget` int,
	`actualCost` int DEFAULT 0,
	`projectManager` int,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `time_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`projectId` int,
	`taskId` int,
	`date` timestamp NOT NULL,
	`hours` int NOT NULL,
	`description` text,
	`billable` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `time_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `employee_idx` ON `attendance` (`employeeId`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `attendance` (`date`);--> statement-breakpoint
CREATE INDEX `employee_id_idx` ON `employees` (`employeeId`);--> statement-breakpoint
CREATE INDEX `department_idx` ON `employees` (`department`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `assigned_idx` ON `leads` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `employee_idx` ON `leave_requests` (`employeeId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `leave_requests` (`status`);--> statement-breakpoint
CREATE INDEX `stage_idx` ON `opportunities` (`stage`);--> statement-breakpoint
CREATE INDEX `assigned_idx` ON `opportunities` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `project_idx` ON `project_tasks` (`projectId`);--> statement-breakpoint
CREATE INDEX `assigned_idx` ON `project_tasks` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE INDEX `manager_idx` ON `projects` (`projectManager`);--> statement-breakpoint
CREATE INDEX `employee_idx` ON `time_entries` (`employeeId`);--> statement-breakpoint
CREATE INDEX `project_idx` ON `time_entries` (`projectId`);