import { mutation, query } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import type { MessageDoc } from "@convex-dev/agent";

export const getMany = query({
  args: {
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNDEFINED",
        message: "Contact session is invalid or expired",
      });
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_contact_session_id", (q) =>
        q.eq("contactSessionId", args.contactSessionId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationWithLastMessage = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null },
        });

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }

        return {
          _id: conversation._id,
          _creationTime: conversation._creationTime,
          status: conversation.status,
          threadId: conversation.threadId,
          organizationId: conversation.organizationId,
          lastMessage,
        };
      })
    );

    return {
      ...conversations,
      page: conversationWithLastMessage,
    };
  },
});

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

    if (conversation.contactSessionId !== args.contactSessionId) {
      throw new ConvexError({
        code: "UNDEFINED",
        message: "Conversation does not belong to the contact session",
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

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    });

    console.log("threadId from supportAgent:", threadId);

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: sessions._id,
      status: "unresolved",
      organizationId: args.organizationId,
      threadId,
    });
    return conversationId;
  },
});
