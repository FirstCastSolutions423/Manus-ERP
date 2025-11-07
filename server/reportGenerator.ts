import { invokeLLM } from "./_core/llm";
import * as db from "./db";

/**
 * Generate a financial report based on transactions
 */
export async function generateFinancialReport(userId: number, config?: {
  startDate?: Date;
  endDate?: Date;
  includeCharts?: boolean;
}): Promise<string> {
  try {
    const transactions = await db.getUserTransactions(
      userId,
      config?.startDate,
      config?.endDate
    );

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a financial analyst. Generate comprehensive financial reports with insights and recommendations."
        },
        {
          role: "user",
          content: `Generate a detailed financial report based on these transactions:\n\n${JSON.stringify(transactions, null, 2)}\n\nInclude:\n- Summary of income and expenses\n- Category breakdown\n- Trends and patterns\n- Key insights and recommendations`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : "Failed to generate report";
  } catch (error) {
    console.error("[Report] Failed to generate financial report:", error);
    throw new Error("Failed to generate financial report");
  }
}

/**
 * Generate an analytics report
 */
export async function generateAnalyticsReport(userId: number): Promise<string> {
  try {
    const stats = await db.getDashboardStats(userId);

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a business analyst. Generate comprehensive analytics reports with actionable insights."
        },
        {
          role: "user",
          content: `Generate an analytics report based on these statistics:\n\n${JSON.stringify(stats, null, 2)}\n\nInclude:\n- Key performance indicators\n- Trends and patterns\n- Areas for improvement\n- Strategic recommendations`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : "Failed to generate report";
  } catch (error) {
    console.error("[Report] Failed to generate analytics report:", error);
    throw new Error("Failed to generate analytics report");
  }
}

/**
 * Generate a custom data analysis report
 */
export async function generateDataAnalysisReport(
  data: any[],
  analysisType: string,
  customPrompt?: string
): Promise<string> {
  try {
    const prompt = customPrompt || `Analyze this data and provide insights for ${analysisType}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a data analyst. Analyze data and provide clear, actionable insights."
        },
        {
          role: "user",
          content: `${prompt}\n\nData:\n${JSON.stringify(data, null, 2)}`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : "Failed to generate report";
  } catch (error) {
    console.error("[Report] Failed to generate data analysis report:", error);
    throw new Error("Failed to generate data analysis report");
  }
}
