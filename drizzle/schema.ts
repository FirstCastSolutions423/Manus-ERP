import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tasks and To-Do items
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo", "in_progress", "completed", "cancelled"]).default("todo").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Financial transactions
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["income", "expense", "transfer"]).notNull(),
  category: varchar("category", { length: 100 }),
  amount: int("amount").notNull(), // Store as cents to avoid decimal issues
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  description: text("description"),
  transactionDate: timestamp("transactionDate").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  flagged: boolean("flagged").default(false), // For discrepancy detection
  flagReason: text("flagReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  dateIdx: index("date_idx").on(table.transactionDate),
  statusIdx: index("status_idx").on(table.status),
}));

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Reports
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  type: mysqlEnum("type", ["financial", "analytics", "custom", "data_analysis"]).notNull(),
  description: text("description"),
  config: text("config"), // JSON configuration for report parameters
  fileUrl: text("fileUrl"), // S3 URL for generated report
  fileKey: text("fileKey"), // S3 key for file management
  status: mysqlEnum("status", ["generating", "completed", "failed"]).default("generating").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  typeIdx: index("type_idx").on(table.type),
}));

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Documents and files
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  originalName: varchar("originalName", { length: 500 }),
  fileUrl: text("fileUrl").notNull(), // S3 URL
  fileKey: text("fileKey").notNull(), // S3 key
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"), // in bytes
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array of tags
  ocrText: text("ocrText"), // Extracted text from OCR
  ocrProcessed: boolean("ocrProcessed").default(false),
  source: mysqlEnum("source", ["upload", "email", "onedrive", "box", "hubspot"]).default("upload"),
  sourceId: varchar("sourceId", { length: 255 }), // External ID from source
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  categoryIdx: index("category_idx").on(table.category),
  sourceIdx: index("source_idx").on(table.source),
}));

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Support tickets
 */
export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "waiting", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  category: varchar("category", { length: 100 }),
  assignedTo: int("assignedTo"), // User ID of assigned admin
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
  assignedIdx: index("assigned_idx").on(table.assignedTo),
}));

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

/**
 * Ticket comments
 */
export const ticketComments = mysqlTable("ticket_comments", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId").notNull(),
  comment: text("comment").notNull(),
  isInternal: boolean("isInternal").default(false), // Internal notes vs public comments
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ticketIdx: index("ticket_idx").on(table.ticketId),
  userIdx: index("user_idx").on(table.userId),
}));

export type TicketComment = typeof ticketComments.$inferSelect;
export type InsertTicketComment = typeof ticketComments.$inferInsert;

/**
 * Data imports
 */
export const dataImports = mysqlTable("data_imports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  type: mysqlEnum("type", ["csv", "excel", "json", "xml"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  recordsProcessed: int("recordsProcessed").default(0),
  recordsTotal: int("recordsTotal"),
  errorLog: text("errorLog"),
  config: text("config"), // JSON configuration for import mapping
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

export type DataImport = typeof dataImports.$inferSelect;
export type InsertDataImport = typeof dataImports.$inferInsert;

/**
 * External integrations configuration
 */
export const integrations = mysqlTable("integrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["onedrive", "box", "email", "hubspot"]).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  config: text("config").notNull(), // JSON encrypted configuration
  lastSyncAt: timestamp("lastSyncAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  typeIdx: index("type_idx").on(table.type),
}));

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = typeof integrations.$inferInsert;

/**
 * Dashboard widgets configuration
 */
export const dashboardWidgets = mysqlTable("dashboard_widgets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 100 }).notNull(), // chart type or widget type
  title: varchar("title", { length: 200 }).notNull(),
  config: text("config").notNull(), // JSON configuration for widget
  position: int("position").default(0), // For ordering
  isVisible: boolean("isVisible").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
}));

export type DashboardWidget = typeof dashboardWidgets.$inferSelect;
export type InsertDashboardWidget = typeof dashboardWidgets.$inferInsert;
