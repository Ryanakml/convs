import { mutation, query } from "../_generated/server";
import { v, ConvexError } from "convex/values";

async function validateContactSession(ctx: any, contactSessionId: string) {
  const sessions = await ctx.db.get(contactSessionId);

  if (!sessions || sessions.expiresAt < Date.now()) {
    throw new ConvexError({
      code: "UNDEFINED",
      message: "Contact session is invalid or expired",
    });
  }

  return sessions;
}

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    await validateContactSession(ctx, args.contactSessionId);

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "UNDEFINED",
        message: "Conversation not found",
      });
    }

    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const sessions = await validateContactSession(ctx, args.contactSessionId);

    const threadId = "123";

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: sessions._id,
      status: "unresolved",
      organizationId: args.organizationId,
      threadId,
    });
    return conversationId;
  },
});
