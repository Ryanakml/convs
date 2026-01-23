import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  subscription: defineTable({
    organizationId: v.string(),
    status: v.string(),
  }).index("by_organization_id", ["organizationId"]),

  widgetSettings: defineTable({
    organizationId: v.string(),
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
    // Theme configuration for widget customization
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
  }).index("by_organization_id", ["organizationId"]),

  plugins: defineTable({
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    secretName: v.string(),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_organization_id_and_service", ["organizationId", "service"]),
  conversations: defineTable({
    threadId: v.string(),
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved"),
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),

  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    isAnonymous: v.optional(v.boolean()),
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
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_expires_at", ["expiresAt"]),

  users: defineTable({
    name: v.string(),
  }),
});
