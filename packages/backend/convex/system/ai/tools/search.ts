import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { searchKnowledgeBase } from "../searchKnowledgeBase";

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
    const result = await searchKnowledgeBase(ctx, {
      orgId,
      query: args.query,
    });

    if (!result.hit) {
      return "ERROR: DATA_NOT_FOUND";
    }

    return result.text;
  },
});
