import { groq } from "@ai-sdk/groq";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import rag from "../rag";

export const search = createTool({
  description:
    "search the knowledge base for relevant information to help answer user questions.",
  args: z.object({
    query: z
      .string()
      .describe("The search query to find relevant information."),
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "No thread ID found in context.";
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: ctx.threadId,
      }
    );

    if (!conversation) {
      return "No conversation found for the given thread ID.";
    }

    const orgId = conversation.organizationId;

    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });

    const contextText = searchResult.text;

    const response = await generateText({
      model: groq("llama-3.1-8b-instant"),
      messages: [
        {
          role: "system",
          content: `You are a helpful and friendly AI customer support agent for "Convs".
          
          INSTRUCTIONS:
          1. Answer the user's question based ONLY on the context provided below.
          2. Do NOT mention "search results", "context", "files", or "documents". 
          3. Do NOT say "I understand your question" or "Based on the info". Just answer directly and naturally.
          4. If the answer is not in the context, politely say you don't know without mentioning "context".`,
        },
        {
          role: "user",
          content: `Question: "${args.query}"\n\nContext Information:\n${contextText}`,
        },
      ],
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });
    return response.text;
  },
});
