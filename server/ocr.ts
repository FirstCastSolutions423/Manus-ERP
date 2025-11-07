import { invokeLLM } from "./_core/llm";

/**
 * Extract text from images using vision-capable LLM
 */
export async function extractTextFromImage(imageUrl: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this image. Return only the extracted text, no additional commentary."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : "";
  } catch (error) {
    console.error("[OCR] Failed to extract text:", error);
    throw new Error("Failed to extract text from image");
  }
}

/**
 * Analyze document and extract structured data
 */
export async function analyzeDocument(imageUrl: string, documentType?: string): Promise<{
  text: string;
  metadata: Record<string, any>;
}> {
  try {
    const prompt = documentType 
      ? `Analyze this ${documentType} document. Extract all text and identify key information like dates, amounts, names, and other relevant metadata.`
      : "Analyze this document. Extract all text and identify any key information like dates, amounts, names, addresses, or other structured data.";

    const response = await invokeLLM({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "high" }
            }
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "document_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              text: { type: "string", description: "All extracted text from the document" },
              metadata: {
                type: "object",
                description: "Structured metadata extracted from the document",
                properties: {
                  dates: { type: "array", items: { type: "string" } },
                  amounts: { type: "array", items: { type: "string" } },
                  names: { type: "array", items: { type: "string" } },
                  other: { type: "object", additionalProperties: true }
                },
                required: [],
                additionalProperties: true
              }
            },
            required: ["text", "metadata"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No response from LLM");

    return JSON.parse(content);
  } catch (error) {
    console.error("[OCR] Failed to analyze document:", error);
    throw new Error("Failed to analyze document");
  }
}

/**
 * Detect accounting discrepancies in financial data
 */
export async function detectAccountingDiscrepancies(transactions: Array<{
  id: number;
  type: string;
  amount: number;
  category?: string | null;
  description?: string | null;
  transactionDate: Date;
}>): Promise<Array<{
  transactionId: number;
  reason: string;
  severity: "low" | "medium" | "high";
}>> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a financial auditor. Analyze transactions and identify potential discrepancies, unusual patterns, or anomalies."
        },
        {
          role: "user",
          content: `Analyze these transactions and identify any discrepancies:\n\n${JSON.stringify(transactions, null, 2)}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "discrepancy_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              discrepancies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    transactionId: { type: "number" },
                    reason: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                  },
                  required: ["transactionId", "reason", "severity"],
                  additionalProperties: false
                }
              }
            },
            required: ["discrepancies"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') return [];

    const result = JSON.parse(content);
    return result.discrepancies || [];
  } catch (error) {
    console.error("[Analysis] Failed to detect discrepancies:", error);
    return [];
  }
}
