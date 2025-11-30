import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a conversation.",
  args: z.object({}),
  handler: async (ctx, _args) => {
    if (!ctx.threadId) {
      return "missing thread id";
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "The conversation has been marked as escalated.",
      },
    });

    return "Conversation marked as escalated.";
  },
});
