import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const upsert = internalMutation({
  args: {
    organizationId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const existingSubscription = await ctx.db
      .query("subscription")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();

    if (existingSubscription) {
      await ctx.db.patch(existingSubscription._id, {
        status: args.status,
      });
    } else {
      await ctx.db.insert("subscription", {
        organizationId: args.organizationId,
        status: args.status,
      });
    }
  },
});

export const getByOrganizationId = internalQuery({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscription")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();
  },
});
