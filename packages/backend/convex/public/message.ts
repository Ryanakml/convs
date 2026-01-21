import { internal } from "../_generated/api";
import { action, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { searchKnowledgeBase } from "../system/ai/searchKnowledgeBase";
import {
  getMessageVisibility,
  INTERNAL_MESSAGE_METADATA,
  isInternalMessage,
  USER_MESSAGE_METADATA,
} from "../lib/messageVisibility";
import {
  classifyIntent,
  detectLocale,
  getClarifyingQuestion,
  getEscalationResponse,
  getGreetingResponse,
  getLastResortResponse,
  getOtherResponse,
  getPricingResponse,
  getRequestHumanResponse,
  getSensitiveEscalationResponse,
  getTroubleshootingResponse,
  hasEscalationTrigger,
  isLastBotMessageLastResort,
  isLastBotMessageClarification,
  hasEscalationOffer,
  type Intent,
  type ClassificationResult,
} from "../system/ai/supportRouting";

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
        userId: String(args.contactSessionId),
        message: {
          role: "user",
          content: args.prompt,
        },
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

    const locale = detectLocale(args.prompt);
    const classification: ClassificationResult = classifyIntent(args.prompt);
    const intent = classification.intent;
    const shouldEscalateNow = hasEscalationTrigger(args.prompt);

    const previousMessages = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: {
        numItems: 50,
        cursor: null,
      },
    });

    // Extract bot messages for context awareness
    const botMessages = previousMessages.page
      .filter(
        (m: any) => m.message?.role === "assistant" || m.role === "assistant"
      )
      .map((m: any) => ({
        role: "assistant",
        content: m.message?.content || m.content || "",
      }));

    const supportLogs = previousMessages.page
      .filter((message: any) => {
        const visibility = getMessageVisibility(message);
        if (visibility) return visibility === "internal";
        const content =
          typeof message?.message?.content === "string"
            ? message.message.content
            : typeof message?.content === "string"
              ? message.content
              : null;
        return Boolean(content && content.startsWith("[support_log]"));
      })
      .map((message: any) => message?.message ?? message)
      .map((message: any) => {
        const content =
          typeof message?.content === "string" ? message.content : null;
        if (!content || !content.startsWith("[support_log]")) {
          return null;
        }
        try {
          return JSON.parse(content.replace("[support_log]", ""));
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Array<{ type?: string }>;

    const searchMissCount = supportLogs.filter(
      (log) => log?.type === "search_miss"
    ).length;
    const troubleshootingAttempts = supportLogs.filter(
      (log) => log?.type === "troubleshooting_attempt"
    ).length;

    await supportAgent.saveMessage(ctx, {
      threadId: args.threadId,
      userId: String(args.contactSessionId),
      message: {
        role: "user",
        content: args.prompt,
      },
    });

    let responseText = "";
    let didSearch = false;
    let didEscalate = false;
    let searchHit: boolean | null = null;

    if (shouldEscalateNow) {
      responseText = getEscalationResponse(locale);
      await ctx.runMutation(internal.system.conversations.escalate, {
        threadId: args.threadId,
      });
      didEscalate = true;
    } else {
      switch (intent) {
        case "REQUEST_HUMAN": {
          // Explicit request for human - escalate immediately
          responseText = getRequestHumanResponse(locale);
          await ctx.runMutation(internal.system.conversations.escalate, {
            threadId: args.threadId,
          });
          didEscalate = true;
          break;
        }
        case "CONFIRMATION_YES": {
          // User confirmed - check context
          const hadLastResort = isLastBotMessageLastResort(botMessages);
          const hadEscalationOffer = hasEscalationOffer(botMessages);

          // If last bot message offered escalation in ANY form, escalate immediately
          // Use both primary detection AND fallback detection for safety
          if (hadLastResort || hadEscalationOffer) {
            responseText = ""; // Silent escalation (user already confirmed)
            await ctx.runMutation(internal.system.conversations.escalate, {
              threadId: args.threadId,
            });
            didEscalate = true;
            await supportAgent.saveMessage(ctx, {
              threadId: args.threadId,
              userId: "system",
              message: {
                role: "system",
                content: `[support_log]${JSON.stringify({
                  type: "confirmation_escalate",
                  reason: "user_confirmed_escalation",
                  contextDetection: {
                    hadLastResort,
                    hadEscalationOffer,
                  },
                })}`,
                providerOptions: { meta: { visibility: "internal" } },
              },
            });
          } else if (botMessages.length > 0) {
            // If we have bot messages but no escalation context detected,
            // it's safer to escalate anyway (user said yes to something)
            // This prevents false negatives when context detection is uncertain
            responseText = "";
            await ctx.runMutation(internal.system.conversations.escalate, {
              threadId: args.threadId,
            });
            didEscalate = true;
            await supportAgent.saveMessage(ctx, {
              threadId: args.threadId,
              userId: "system",
              message: {
                role: "system",
                content: `[support_log]${JSON.stringify({
                  type: "confirmation_escalate",
                  reason: "fallback_escalation_for_confirmation_yes",
                  lastBotMessage:
                    botMessages.length > 0
                      ? botMessages[botMessages.length - 1]?.content.substring(
                          0,
                          100
                        )
                      : "none",
                })}`,
                providerOptions: { meta: { visibility: "internal" } },
              },
            });
          } else {
            // No bot messages history, treat as general ack
            responseText = getOtherResponse(locale);
          }
          break;
        }
        case "CONFIRMATION_NO": {
          // User rejected escalation - continue conversation
          responseText = "Baik, ada yang lain yang bisa saya bantu?"; // ID by default, use locale if needed
          break;
        }
        case "GENERAL_CONVERSATION": {
          // Handle greetings and general acks - NO searching, NO escalation
          responseText = getGreetingResponse(locale);
          break;
        }
        case "FACTUAL_KB": {
          didSearch = true;
          const result = await searchKnowledgeBase(ctx, {
            orgId: conversation.organizationId,
            query: args.prompt,
          });
          searchHit = result.hit;

          if (result.hit) {
            // KB found with good confidence
            responseText = result.text;
          } else if (classification.confidence < 0.5) {
            // Low confidence on KB classification itself
            // Try fallback: ask for clarification FIRST before escalating
            responseText = getClarifyingQuestion(args.prompt, locale);
            await supportAgent.saveMessage(ctx, {
              threadId: args.threadId,
              userId: "system",
              message: {
                role: "system",
                content: `[support_log]${JSON.stringify({
                  type: "low_confidence_clarify",
                  intent,
                  classificationConfidence: classification.confidence,
                })}`,
                providerOptions: { meta: { visibility: "internal" } },
              },
            });
          } else if (searchMissCount >= 2) {
            // KB search failed multiple times AND user still having issues
            responseText = getEscalationResponse(locale);
            await ctx.runMutation(internal.system.conversations.escalate, {
              threadId: args.threadId,
            });
            didEscalate = true;
          } else {
            // First KB search miss: offer clarification + last resort option
            responseText = getLastResortResponse(locale);
            await supportAgent.saveMessage(ctx, {
              threadId: args.threadId,
              userId: "system",
              message: {
                role: "system",
                content: `[support_log]${JSON.stringify({
                  type: "search_miss",
                  intent,
                  searchScore: result.score,
                  searchResults: result.numResults,
                })}`,
                providerOptions: { meta: { visibility: "internal" } },
              },
            });
          }
          break;
        }
        case "TROUBLESHOOTING": {
          if (troubleshootingAttempts >= 2) {
            responseText = getEscalationResponse(locale);
            await ctx.runMutation(internal.system.conversations.escalate, {
              threadId: args.threadId,
            });
            didEscalate = true;
          } else {
            responseText = getTroubleshootingResponse(locale);
            await supportAgent.saveMessage(ctx, {
              threadId: args.threadId,
              userId: "system",
              message: {
                role: "system",
                content: `[support_log]${JSON.stringify({
                  type: "troubleshooting_attempt",
                  intent,
                })}`,
                providerOptions: { meta: { visibility: "internal" } },
              },
            });
          }
          break;
        }
        case "PRICING_NEGOTIATION": {
          responseText = getPricingResponse(locale);
          await ctx.runMutation(internal.system.conversations.escalate, {
            threadId: args.threadId,
          });
          didEscalate = true;
          break;
        }
        case "SENSITIVE_ACCOUNT_ACTION": {
          didSearch = true;
          const result = await searchKnowledgeBase(ctx, {
            orgId: conversation.organizationId,
            query: args.prompt,
          });
          searchHit = result.hit;

          if (result.hit) {
            responseText = result.text;
          } else {
            responseText = getSensitiveEscalationResponse(locale);
            await ctx.runMutation(internal.system.conversations.escalate, {
              threadId: args.threadId,
            });
            didEscalate = true;
          }
          break;
        }
        default: {
          responseText = getOtherResponse(locale);
        }
      }
    }

    if (responseText.trim() !== "") {
      await supportAgent.saveMessage(ctx, {
        threadId: args.threadId,
        userId: "system",
        message: {
          role: "assistant",
          content: responseText,
        },
      });
    }

    await supportAgent.saveMessage(ctx, {
      threadId: args.threadId,
      userId: "system",
      message: {
        role: "system",
        content: `[support_log]${JSON.stringify({
          type: "intent_log",
          intent,
          classificationConfidence: classification.confidence,
          classificationReason: classification.reason,
          contextAware: {
            hadLastResortMessage: isLastBotMessageLastResort(botMessages),
            hadClarificationMessage: isLastBotMessageClarification(botMessages),
            hadEscalationOffer: hasEscalationOffer(botMessages),
            botMessagesCount: botMessages.length,
          },
          didSearch,
          didEscalate,
          searchHit,
        })}`,
        providerOptions: { meta: { visibility: "internal" } },
      },
    });

    console.log("support.intent", {
      threadId: args.threadId,
      intent,
      classificationConfidence: classification.confidence,
      classificationReason: classification.reason,
      didSearch,
      didEscalate,
      searchHit,
    });
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

    return {
      ...paginated,
      page: paginated.page.filter(
        (message: any) => !isInternalMessage(message)
      ),
    };
  },
});
