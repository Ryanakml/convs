import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const upsert = mutation({
  args: {
    greetMessage: v.string(),
    defaultSuggestion: v.object({
      suggestion1: v.optional(v.string()),
      suggestion2: v.optional(v.string()),
      suggestion3: v.optional(v.string()),
    }),
    vapiSettings: v.object({
      assistantId: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    }),
    // Theme settings for widget customization
    themeSettings: v.optional(
      v.object({
        colors: v.object({
          primary: v.string(),
          primaryForeground: v.string(),
          secondary: v.string(),
          secondaryForeground: v.string(),
          background: v.string(),
          foreground: v.string(),
          userMessage: v.object({
            bg: v.string(),
            text: v.string(),
          }),
          assistantMessage: v.object({
            bg: v.string(),
            text: v.string(),
          }),
          border: v.string(),
          mutedForeground: v.string(),
          muted: v.string(),
        }),
        components: v.object({
          header: v.object({
            bg: v.string(),
            borderColor: v.string(),
            textColor: v.string(),
          }),
          input: v.object({
            bg: v.string(),
            borderColor: v.string(),
            textColor: v.string(),
            placeholderColor: v.string(),
          }),
          button: v.object({
            primary: v.object({
              bg: v.string(),
              text: v.string(),
              hover: v.string(),
            }),
            ghost: v.object({
              bg: v.string(),
              text: v.string(),
              hover: v.string(),
            }),
            disabled: v.object({
              bg: v.string(),
              text: v.string(),
            }),
          }),
          avatar: v.object({
            bg: v.string(),
            border: v.string(),
          }),
          indicator: v.object({
            speaking: v.string(),
            listening: v.string(),
          }),
        }),
        spacing: v.object({
          messageGap: v.string(),
          padding: v.string(),
          borderRadius: v.string(),
        }),
        animations: v.object({
          enabled: v.boolean(),
          transitionDuration: v.string(),
        }),
      }),
    ),
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

    console.log(
      "[Backend upsert] 📦 Received theme settings:",
      args.themeSettings,
    );
    console.log("[Backend upsert] 🏪 Organization ID:", orgId);

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization ID found in user identity",
      });
    }

    const existingWidgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .unique();

    console.log(
      "[Backend upsert] 🔍 Existing settings found:",
      !!existingWidgetSettings,
    );
    if (existingWidgetSettings) {
      console.log(
        "[Backend upsert] 🔄 Patching existing record with ID:",
        existingWidgetSettings._id,
      );
      console.log("[Backend upsert] ✅ Using correct organizationId:", orgId);

      await ctx.db.patch(existingWidgetSettings._id, {
        greetMessage: args.greetMessage,
        defaultSuggestion: args.defaultSuggestion,
        vapiSettings: args.vapiSettings,
        ...(args.themeSettings && { themeSettings: args.themeSettings }),
      });

      console.log("[Backend upsert] ✅ Record patched successfully!");
    } else {
      console.log("[Backend upsert] ➕ Creating new record for orgId:", orgId);

      await ctx.db.insert("widgetSettings", {
        organizationId: orgId,
        greetMessage: args.greetMessage,
        defaultSuggestion: args.defaultSuggestion,
        vapiSettings: args.vapiSettings,
        ...(args.themeSettings && { themeSettings: args.themeSettings }),
      });

      console.log("[Backend upsert] ✅ New record inserted!");
    }

    return existingWidgetSettings;
  },
});

export const getOne = query({
  args: {},
  handler: async (ctx) => {
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

    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .unique();

    return widgetSettings;
  },
});
