CREATE TABLE `inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`warehouseId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sku` varchar(100) NOT NULL,
	`name` varchar(500) NOT NULL,
	`description` text,
	`category` varchar(200),
	`unitPrice` int NOT NULL,
	`costPrice` int,
	`unit` varchar(50) DEFAULT 'pcs',
	`reorderLevel` int DEFAULT 10,
	`imageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `purchase_order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` int NOT NULL,
	`receivedQuantity` int DEFAULT 0,
	CONSTRAINT `purchase_order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poNumber` varchar(100) NOT NULL,
	`supplierId` int,
	`supplierName` varchar(300),
	`status` enum('draft','pending','approved','received','cancelled') NOT NULL DEFAULT 'draft',
	`orderDate` timestamp NOT NULL DEFAULT (now()),
	`expectedDate` timestamp,
	`receivedDate` timestamp,
	`totalAmount` int,
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchase_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchase_orders_poNumber_unique` UNIQUE(`poNumber`)
);
--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`warehouseId` int NOT NULL,
	`movementType` enum('in','out','transfer','adjustment') NOT NULL,
	`quantity` int NOT NULL,
	`referenceType` varchar(100),
	`referenceId` int,
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stock_movements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `warehouses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`location` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `warehouses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `product_idx` ON `inventory` (`productId`);--> statement-breakpoint
CREATE INDEX `warehouse_idx` ON `inventory` (`warehouseId`);--> statement-breakpoint
CREATE INDEX `sku_idx` ON `products` (`sku`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `po_idx` ON `purchase_order_items` (`poId`);--> statement-breakpoint
CREATE INDEX `po_number_idx` ON `purchase_orders` (`poNumber`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `purchase_orders` (`status`);--> statement-breakpoint
CREATE INDEX `product_idx` ON `stock_movements` (`productId`);--> statement-breakpoint
CREATE INDEX `warehouse_idx` ON `stock_movements` (`warehouseId`);