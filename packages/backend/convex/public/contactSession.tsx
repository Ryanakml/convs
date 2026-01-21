import { mutation } from "../_generated/server";
import { v } from "convex/values";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timeZone: v.optional(v.string()),
        timeZoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION_MS;

    const contactSessionId = await ctx.db.insert("contactSessions", {
      name: args.name,
      email: args.email,
      organizationId: args.organizationId,
      expiresAt,
      metadata: args.metadata,
    });

    return contactSessionId;
  },
});

export const createAnonymous = mutation({
  args: {
    organizationId: v.string(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timeZone: v.optional(v.string()),
        timeZoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION_MS;

    // Generate anonymous ID using Web Crypto (global) or Math.random
    // Convex makes Math.random() deterministic and safe to use in mutations
    const anonymousId = Math.random().toString(36).substring(2, 10);
    const anonymousName = `Guest${anonymousId.toUpperCase()}`;
    const anonymousEmail = `guest-${anonymousId}@convs.local`;

    const contactSessionId = await ctx.db.insert("contactSessions", {
      name: anonymousName,
      email: anonymousEmail,
      organizationId: args.organizationId,
      expiresAt,
      metadata: args.metadata,
      isAnonymous: true,
    });

    return contactSessionId;
  },
});

export const validate = mutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession) {
      return {
        valid: false,
        reason: "contact session not found",
      };
    }
    if (contactSession.expiresAt < Date.now()) {
      return {
        valid: false,
        reason: "contact session expired",
      };
    }
    return {
      valid: true,
      contactSession,
    };
  },
});
