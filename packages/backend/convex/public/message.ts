import { internal } from "../_generated/api";
import { action, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { search } from "../system/ai/tools/search";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSession.getOne,
      { contactSessionId: args.contactSessionId }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid or expired",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: args.threadId }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found for the given thread ID",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Cannot send message to a resolved conversation",
      });
    }

    if (conversation.status === "escalated") {
      await supportAgent.saveMessage(ctx, {
        threadId: args.threadId,
        userId: args.contactSessionId,
        prompt: args.prompt,
      });
      return;
    }

    await ctx.runMutation(internal.system.contactSession.refresh, {
      contactSessionId: args.contactSessionId,
    });

    // Subscription
    const subscription = await ctx.runQuery(
      internal.system.subscriptions.getByOrganizationId,
      { organizationId: conversation.organizationId }
    );

    if (!subscription || subscription.status !== "active") {
      await ctx.runMutation(internal.system.conversations.escalate, {
        threadId: args.threadId,
      });
      return;
    }

    await supportAgent.generateText(
      ctx,
      {
        threadId: args.threadId,
        userId: args.contactSessionId,
      },
      {
        prompt: args.prompt,
        tools: {
          resolveConversation,
          escalateConversation,
          search,
        },
      }
    );
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid or expired",
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});
