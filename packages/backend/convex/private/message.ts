import { components, internal } from "../_generated/api";
import { action, mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export const enhanceResponse = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Auth Check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    // 2. Validate Thread & Permission (Security)
    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: args.threadId }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.organizationId !== identity.orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization",
      });
    }

    const currentDraft = args.prompt.trim();
    if (!currentDraft) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Prompt cannot be empty",
      });
    }

    // 3. Panggil AI secara Stateless (Tanpa Agent Class yang save history)
    // Kita kasih instruksi spesifik agar dia bertindak sebagai editor
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: `You are an expert customer support editor. 
      Your task is to rewrite the user's draft to be more empathetic, professional, and concise. 
      Do NOT add new facts. Do NOT output conversational filler (like "Here is the rewrite:"). 
      Just output the rewritten message directly.`,
      prompt: currentDraft,
    });

    return text.trim();
  },
});

export const create = mutation({
  args: {
    prompt: v.string(),
    conversationId: v.id("conversations"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity is not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization ID found in user identity",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found for the given thread ID",
      });
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization Id",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Cannot send message to a resolved conversation",
      });
    }

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      agentName: identity.familyName || "default",
      message: {
        role: "assistant",
        content: args.prompt,
      },
    });
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity is not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization ID found in user identity",
      });
    }

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization Id",
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});
