import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { TRPCError } from "@trpc/server";
import { extractTextFromImage, analyzeDocument, detectAccountingDiscrepancies } from "./ocr";
import { generateFinancialReport, generateAnalyticsReport, generateDataAnalysisReport } from "./reportGenerator";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Dashboard & Analytics
  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      return db.getDashboardStats(ctx.user.id);
    }),
    widgets: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserDashboardWidgets(ctx.user.id);
    }),
    createWidget: protectedProcedure
      .input(z.object({
        type: z.string(),
        title: z.string(),
        config: z.string(),
        position: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createDashboardWidget({
          userId: ctx.user.id,
          ...input,
        });
      }),
    updateWidget: protectedProcedure
      .input(z.object({
        id: z.number(),
        type: z.string().optional(),
        title: z.string().optional(),
        config: z.string().optional(),
        position: z.number().optional(),
        isVisible: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateDashboardWidget(id, ctx.user.id, updates);
      }),
    deleteWidget: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteDashboardWidget(input.id, ctx.user.id);
      }),
  }),

  // Tasks & To-Do
  tasks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserTasks(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTask({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["todo", "in_progress", "completed", "cancelled"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        dueDate: z.date().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateTask(id, ctx.user.id, updates);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteTask(input.id, ctx.user.id);
      }),
  }),

  // Financial Transactions
  transactions: router({
    list: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return db.getUserTransactions(ctx.user.id, input?.startDate, input?.endDate);
      }),
    flagged: protectedProcedure.query(async ({ ctx }) => {
      return db.getFlaggedTransactions(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["income", "expense", "transfer"]),
        category: z.string().optional(),
        amount: z.number(),
        currency: z.string().optional(),
        description: z.string().optional(),
        transactionDate: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTransaction({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        type: z.enum(["income", "expense", "transfer"]).optional(),
        category: z.string().optional(),
        amount: z.number().optional(),
        description: z.string().optional(),
        status: z.enum(["pending", "completed", "failed", "cancelled"]).optional(),
        flagged: z.boolean().optional(),
        flagReason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateTransaction(id, ctx.user.id, updates);
      }),
  }),

  // Reports
  reports: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserReports(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        type: z.enum(["financial", "analytics", "custom", "data_analysis"]),
        description: z.string().optional(),
        config: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createReport({
          userId: ctx.user.id,
          ...input,
        });
      }),
    generate: protectedProcedure
      .input(z.object({
        reportId: z.number(),
        type: z.enum(["financial", "analytics", "custom", "data_analysis"]),
      }))
      .mutation(async ({ ctx, input }) => {
        let content = "";
        
        if (input.type === "financial") {
          content = await generateFinancialReport(ctx.user.id);
        } else if (input.type === "analytics") {
          content = await generateAnalyticsReport(ctx.user.id);
        }
        
        // Update report status
        await db.updateReport(input.reportId, {
          status: "completed",
        });
        
        return { content };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["generating", "completed", "failed"]).optional(),
        fileUrl: z.string().optional(),
        fileKey: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateReport(id, updates);
      }),
  }),

  // OCR & Analysis
  ocr: router({
    extractText: protectedProcedure
      .input(z.object({ imageUrl: z.string() }))
      .mutation(async ({ input }) => {
        const text = await extractTextFromImage(input.imageUrl);
        return { text };
      }),
    analyzeDocument: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
        documentType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return analyzeDocument(input.imageUrl, input.documentType);
      }),
    detectDiscrepancies: protectedProcedure
      .query(async ({ ctx }) => {
        const transactions = await db.getUserTransactions(ctx.user.id);
        const discrepancies = await detectAccountingDiscrepancies(transactions);
        
        // Flag transactions with discrepancies
        for (const disc of discrepancies) {
          await db.updateTransaction(disc.transactionId, ctx.user.id, {
            flagged: true,
            flagReason: disc.reason,
          });
        }
        
        return discrepancies;
      }),
  }),

  // Documents & Files
  documents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserDocuments(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        originalName: z.string().optional(),
        fileUrl: z.string(),
        fileKey: z.string(),
        mimeType: z.string().optional(),
        fileSize: z.number().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        source: z.enum(["upload", "email", "onedrive", "box", "hubspot"]).optional(),
        sourceId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createDocument({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        ocrText: z.string().optional(),
        ocrProcessed: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateDocument(id, ctx.user.id, updates);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return db.deleteDocument(input.id, ctx.user.id);
      }),
  }),

  // Tickets
  tickets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserTickets(ctx.user.id);
    }),
    all: adminProcedure.query(async () => {
      return db.getAllTickets();
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTicket({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["open", "in_progress", "waiting", "resolved", "closed"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        assignedTo: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateTicket(id, updates);
      }),
    comments: protectedProcedure
      .input(z.object({ ticketId: z.number() }))
      .query(async ({ input }) => {
        return db.getTicketComments(input.ticketId);
      }),
    addComment: protectedProcedure
      .input(z.object({
        ticketId: z.number(),
        comment: z.string(),
        isInternal: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createTicketComment({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  // Data Imports
  dataImports: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserDataImports(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        fileKey: z.string(),
        type: z.enum(["csv", "excel", "json", "xml"]),
        config: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createDataImport({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
        recordsProcessed: z.number().optional(),
        recordsTotal: z.number().optional(),
        errorLog: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateDataImport(id, updates);
      }),
  }),

  // Integrations
  integrations: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserIntegrations(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["onedrive", "box", "email", "hubspot"]),
        name: z.string(),
        config: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return db.createIntegration({
          userId: ctx.user.id,
          ...input,
        });
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        isActive: z.boolean().optional(),
        config: z.string().optional(),
        lastSyncAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return db.updateIntegration(id, ctx.user.id, updates);
      }),
  }),
});

export type AppRouter = typeof appRouter;
