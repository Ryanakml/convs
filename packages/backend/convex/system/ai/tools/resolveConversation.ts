import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import { USER_MESSAGE_METADATA } from "../../../lib/messageVisibility";

export const resolveConversation = createTool({
  description: "Resolve a conversation.",
  args: z.object({}),
  handler: async (ctx, _args) => {
    if (!ctx.threadId) {
      return "missing thread id";
    }

    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      userId: ctx.userId || "system",
      message: {
        role: "assistant",
        content: "The conversation has been marked as resolved.",
      },
    });

    return "Conversation marked as resolved.";
  },
});
