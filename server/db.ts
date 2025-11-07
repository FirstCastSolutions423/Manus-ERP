import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  tasks, InsertTask,
  transactions, InsertTransaction,
  reports, InsertReport,
  documents, InsertDocument,
  tickets, InsertTicket,
  ticketComments, InsertTicketComment,
  dataImports, InsertDataImport,
  integrations, InsertIntegration,
  dashboardWidgets, InsertDashboardWidget,
  notifications, InsertNotification,
  products, InsertProduct,
  warehouses, InsertWarehouse,
  inventory, InsertInventory,
  purchaseOrders, InsertPurchaseOrder,
  purchaseOrderItems, InsertPurchaseOrderItem,
  stockMovements, InsertStockMovement,
  leads, InsertLead,
  opportunities, InsertOpportunity,
  contacts, InsertContact,
  employees, InsertEmployee,
  attendance, InsertAttendance,
  leaveRequests, InsertLeaveRequest,
  projects, InsertProject,
  projectTasks, InsertProjectTask,
  timeEntries, InsertTimeEntry
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ User Management ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ Tasks ============

export async function getUserTasks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
}

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(task);
  return result;
}

export async function updateTask(id: number, userId: number, updates: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(tasks).set(updates).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

export async function deleteTask(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
}

// ============ Transactions ============

export async function getUserTransactions(userId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(transactions.userId, userId)];
  if (startDate) conditions.push(gte(transactions.transactionDate, startDate));
  if (endDate) conditions.push(lte(transactions.transactionDate, endDate));
  
  return db.select().from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.transactionDate));
}

export async function createTransaction(transaction: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(transactions).values(transaction);
}

export async function getFlaggedTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions)
    .where(and(eq(transactions.userId, userId), eq(transactions.flagged, true)))
    .orderBy(desc(transactions.transactionDate));
}

export async function updateTransaction(id: number, userId: number, updates: Partial<InsertTransaction>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(transactions).set(updates).where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
}

// ============ Reports ============

export async function getUserReports(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt));
}

export async function createReport(report: InsertReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reports).values(report);
}

export async function updateReport(id: number, updates: Partial<InsertReport>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(reports).set(updates).where(eq(reports.id, id));
}

// ============ Documents ============

export async function getUserDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.createdAt));
}

export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(documents).values(document);
}

export async function updateDocument(id: number, userId: number, updates: Partial<InsertDocument>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(documents).set(updates).where(and(eq(documents.id, id), eq(documents.userId, userId)));
}

export async function deleteDocument(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(documents).where(and(eq(documents.id, id), eq(documents.userId, userId)));
}

// ============ Tickets ============

export async function getUserTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
}

export async function getAllTickets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tickets).orderBy(desc(tickets.createdAt));
}

export async function createTicket(ticket: InsertTicket) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(tickets).values(ticket);
}

export async function updateTicket(id: number, updates: Partial<InsertTicket>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(tickets).set(updates).where(eq(tickets.id, id));
}

export async function getTicketComments(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ticketComments).where(eq(ticketComments.ticketId, ticketId)).orderBy(desc(ticketComments.createdAt));
}

export async function createTicketComment(comment: InsertTicketComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(ticketComments).values(comment);
}

// ============ Data Imports ============

export async function getUserDataImports(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dataImports).where(eq(dataImports.userId, userId)).orderBy(desc(dataImports.createdAt));
}

export async function createDataImport(dataImport: InsertDataImport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(dataImports).values(dataImport);
}

export async function updateDataImport(id: number, updates: Partial<InsertDataImport>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(dataImports).set(updates).where(eq(dataImports.id, id));
}

// ============ Integrations ============

export async function getUserIntegrations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(integrations).where(eq(integrations.userId, userId)).orderBy(desc(integrations.createdAt));
}

export async function createIntegration(integration: InsertIntegration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(integrations).values(integration);
}

export async function updateIntegration(id: number, userId: number, updates: Partial<InsertIntegration>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(integrations).set(updates).where(and(eq(integrations.id, id), eq(integrations.userId, userId)));
}

// ============ Dashboard Widgets ============

export async function getUserDashboardWidgets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dashboardWidgets).where(eq(dashboardWidgets.userId, userId)).orderBy(dashboardWidgets.position);
}

export async function createDashboardWidget(widget: InsertDashboardWidget) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(dashboardWidgets).values(widget);
}

export async function updateDashboardWidget(id: number, userId: number, updates: Partial<InsertDashboardWidget>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(dashboardWidgets).set(updates).where(and(eq(dashboardWidgets.id, id), eq(dashboardWidgets.userId, userId)));
}

export async function deleteDashboardWidget(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(dashboardWidgets).where(and(eq(dashboardWidgets.id, id), eq(dashboardWidgets.userId, userId)));
}

// ============ Analytics ============

export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [taskStats] = await db.select({
    total: sql<number>`COUNT(*)`,
    completed: sql<number>`SUM(CASE WHEN ${tasks.status} = 'completed' THEN 1 ELSE 0 END)`,
    inProgress: sql<number>`SUM(CASE WHEN ${tasks.status} = 'in_progress' THEN 1 ELSE 0 END)`,
  }).from(tasks).where(eq(tasks.userId, userId));

  const [transactionStats] = await db.select({
    total: sql<number>`COUNT(*)`,
    totalIncome: sql<number>`SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END)`,
    totalExpense: sql<number>`SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END)`,
    flagged: sql<number>`SUM(CASE WHEN ${transactions.flagged} = 1 THEN 1 ELSE 0 END)`,
  }).from(transactions).where(eq(transactions.userId, userId));

  const [ticketStats] = await db.select({
    total: sql<number>`COUNT(*)`,
    open: sql<number>`SUM(CASE WHEN ${tickets.status} = 'open' THEN 1 ELSE 0 END)`,
    resolved: sql<number>`SUM(CASE WHEN ${tickets.status} = 'resolved' THEN 1 ELSE 0 END)`,
  }).from(tickets).where(eq(tickets.userId, userId));

  const [documentStats] = await db.select({
    total: sql<number>`COUNT(*)`,
  }).from(documents).where(eq(documents.userId, userId));

  return {
    tasks: taskStats,
    transactions: transactionStats,
    tickets: ticketStats,
    documents: documentStats,
  };
}

// ============ Notifications ============

export async function getUserNotifications(userId: number, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(notifications.userId, userId)];
  if (unreadOnly) conditions.push(eq(notifications.isRead, false));
  
  return db.select().from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const [result] = await db.select({
    count: sql<number>`COUNT(*)`
  }).from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  
  return result?.count || 0;
}

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(notifications).values(notification);
}

export async function markNotificationAsRead(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

export async function deleteNotification(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(notifications)
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
}

// ============ Inventory & Supply Chain ============

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isActive, true));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(products).values(product);
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(updates).where(eq(products.id, id));
}

export async function getInventoryByProduct(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inventory).where(eq(inventory.productId, productId));
}

export async function getAllPurchaseOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchaseOrders).orderBy(desc(purchaseOrders.createdAt));
}

export async function createPurchaseOrder(po: InsertPurchaseOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(purchaseOrders).values(po);
}

// ============ CRM & Sales ============

export async function getAllLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(leads).values(lead);
}

export async function updateLead(id: number, updates: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(leads).set(updates).where(eq(leads.id, id));
}

export async function getAllOpportunities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
}

export async function createOpportunity(opp: InsertOpportunity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(opportunities).values(opp);
}

export async function updateOpportunity(id: number, updates: Partial<InsertOpportunity>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(opportunities).set(updates).where(eq(opportunities.id, id));
}

export async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function createContact(contact: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(contacts).values(contact);
}

// ============ HR & Employees ============

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees).where(eq(employees.status, "active"));
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [employee] = await db.select().from(employees).where(eq(employees.id, id));
  return employee;
}

export async function createEmployee(employee: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(employees).values(employee);
}

export async function updateEmployee(id: number, updates: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(employees).set(updates).where(eq(employees.id, id));
}

export async function getEmployeeAttendance(employeeId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(attendance.employeeId, employeeId)];
  if (startDate) conditions.push(gte(attendance.date, startDate));
  if (endDate) conditions.push(lte(attendance.date, endDate));
  
  return db.select().from(attendance).where(and(...conditions)).orderBy(desc(attendance.date));
}

export async function createAttendance(record: InsertAttendance) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(attendance).values(record);
}

export async function getAllLeaveRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leaveRequests).orderBy(desc(leaveRequests.createdAt));
}

export async function createLeaveRequest(request: InsertLeaveRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(leaveRequests).values(request);
}

export async function updateLeaveRequest(id: number, updates: Partial<InsertLeaveRequest>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(leaveRequests).set(updates).where(eq(leaveRequests.id, id));
}

// ============ Project Management ============

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  return project;
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(projects).values(project);
}

export async function updateProject(id: number, updates: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(projects).set(updates).where(eq(projects.id, id));
}

export async function getProjectTasks(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectTasks).where(eq(projectTasks.projectId, projectId));
}

export async function createProjectTask(task: InsertProjectTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(projectTasks).values(task);
}

export async function updateProjectTask(id: number, updates: Partial<InsertProjectTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(projectTasks).set(updates).where(eq(projectTasks.id, id));
}

export async function getTimeEntries(employeeId?: number, projectId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (employeeId) conditions.push(eq(timeEntries.employeeId, employeeId));
  if (projectId) conditions.push(eq(timeEntries.projectId, projectId));
  
  if (conditions.length === 0) {
    return db.select().from(timeEntries).orderBy(desc(timeEntries.date));
  }
  
  return db.select().from(timeEntries).where(and(...conditions)).orderBy(desc(timeEntries.date));
}

export async function createTimeEntry(entry: InsertTimeEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(timeEntries).values(entry);
}
