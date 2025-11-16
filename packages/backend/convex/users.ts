import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const addUser = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = await ctx.db.insert("users", {
      name: args.name,
    });
    return userId;
  },
});
