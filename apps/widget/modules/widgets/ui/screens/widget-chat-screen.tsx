"use client";

import { useEffect, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  conversationIdAtom,
  contactSessionIdFamily,
  screenAtom,
  organizationIdAtom,
  widgetSettingsAtom,
  hasVapiSecretsAtom,
} from "../../atoms/widget-atoms";
import { api } from "@workspace/backend/_generated/api";
import { useAction, usePaginatedQuery, useQuery } from "convex/react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, Phone, SendHorizontal } from "lucide-react";
import { format } from "date-fns/format";
import { AvatarWithBadge } from "@workspace/ui/components/dicebear-avatar";
import { useVapi } from "../../hooks/use-vapi";
import { useNotifications } from "../../hooks/use-notifications";
import { useTheme } from "../../hooks/use-theme";

interface MessageData {
  _id: string;
  _creationTime: number;
  threadId?: string;
  contactSessionId?: string;
  userId?: string;
  tool?: boolean;
  role?: string;
  text?: string;
  content?: string | Array<Record<string, unknown>>;
  message?: {
    role?: string;
    content?: string | Array<Record<string, unknown>>;
    providerOptions?: Record<string, Record<string, unknown>>;
  };
  providerOptions?: {
    meta?: {
      visibility?: "user" | "internal";
    };
  };
}

export const WidgetChatScreen = () => {
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  let widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const setScreen = useSetAtom(screenAtom);
  const theme = useTheme();

  // 🔍 DEBUG: Log theme saat component render
  useEffect(() => {
    console.log("[ChatScreen] 🎨 Component rendered with theme:", theme);
    console.log("[ChatScreen] 🔍 Background:", theme.colors.background);
    console.log("[ChatScreen] 🔍 Primary:", theme.colors.primary);
  }, [theme]);

  // Fallback for development/testing
  if (!widgetSettings?.vapiSettings?.assistantId) {
    widgetSettings = {
      ...widgetSettings,
      vapiSettings: {
        assistantId: "test-assistant-id",
        phoneNumber: "",
      },
    } as unknown as typeof widgetSettings;
  }

  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || ""),
  );

  const { startCall: startVapiCall, isConnecting } = useVapi();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Clear unread when chat screen opens
  const { markAsRead } = useNotifications();
  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  useEffect(() => {
    const shouldShow = !!widgetSettings?.vapiSettings?.assistantId;
    console.log("Chat Screen Debug:", {
      hasVapiSecrets,
      vapiSettings: widgetSettings?.vapiSettings,
      assistantId: widgetSettings?.vapiSettings?.assistantId,
      shouldShowButton: shouldShow,
      widgetSettings: JSON.stringify(widgetSettings),
    });
  }, [hasVapiSecrets, widgetSettings]);

  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = useAction(api.public.message.create);
  const sendBotGreeting = useAction(api.public.message.sendBotGreeting);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? { conversationId, contactSessionId }
      : "skip",
  );

  const threadId = conversation?.threadId;
  const isResolved = conversation?.status === "resolved";
  const isEscalated = conversation?.status === "escalated";
  const canSend = !isResolved;
  const botSeed = threadId || conversation?._id || "support-bot";

  const { results: messages, status } = usePaginatedQuery(
    api.public.message.getMany,
    threadId && contactSessionId ? { threadId, contactSessionId } : "skip",
    { initialNumItems: 20 },
  );

  const sorted = [...(messages ?? [])].sort(
    (a, b) => a._creationTime - b._creationTime,
  );

  const isFirstPageLoading = status === "LoadingFirstPage";

  useEffect(() => {
    if (!isFirstPageLoading) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sorted.length, isFirstPageLoading]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  // Send initial bot greeting when chat opens for the first time
  useEffect(() => {
    if (
      threadId &&
      contactSessionId &&
      sorted.length === 0 &&
      !isFirstPageLoading
    ) {
      console.log("[Widget] Sending initial bot greeting...");

      // Send greeting after a short delay to ensure UI is ready
      const timer = setTimeout(() => {
        sendBotGreeting({
          greetingText:
            "Halo! 👋 Ada yang bisa saya bantu? Silakan tuliskan pertanyaan atau masalah Anda.",
          threadId,
          contactSessionId,
        }).catch((err) => console.error("Error sending greeting:", err));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    threadId,
    contactSessionId,
    sorted.length,
    isFirstPageLoading,
    sendBotGreeting,
  ]);

  const handleSend = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();

    if (
      !message.trim() ||
      !threadId ||
      !contactSessionId ||
      isSending ||
      isResolved
    )
      return;

    const prompt = message.trim();
    setMessage("");
    setIsSending(true);

    try {
      await sendMessage({
        prompt,
        threadId,
        contactSessionId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  function getRole(msg: MessageData): "user" | "assistant" {
    const messageRole = msg?.message?.role ?? msg?.role;

    if (messageRole === "user") return "user";
    if (messageRole === "assistant" || messageRole === "bot") {
      return "assistant";
    }

    if (contactSessionId && msg.contactSessionId) {
      if (String(msg.contactSessionId) === String(contactSessionId)) {
        return "user";
      }
    }

    if (contactSessionId && msg.userId) {
      if (String(msg.userId) === String(contactSessionId)) {
        return "user";
      }
    }

    if (msg.userId && !msg.tool) {
      return "user";
    }

    return "assistant";
  }

  function getVisibility(msg: MessageData): "user" | "internal" | undefined {
    const visibility =
      msg?.providerOptions?.meta?.visibility ??
      (typeof msg?.message === "object"
        ? msg.message?.providerOptions?.meta?.visibility
        : undefined);

    if (visibility === "user" || visibility === "internal") {
      return visibility;
    }
    return undefined;
  }

  function getRawText(msg: MessageData): string | undefined {
    const content =
      msg.text ??
      (typeof msg.message?.content === "string"
        ? msg.message.content
        : typeof msg.content === "string"
          ? msg.content
          : undefined);
    return content;
  }

  function shouldRenderMessage(msg: MessageData): boolean {
    const messageRole = msg?.message?.role ?? msg?.role;
    if (messageRole === "system" || messageRole === "tool") return false;
    if (msg?.tool) return false;

    const visibility = getVisibility(msg);
    if (visibility === "internal") return false;

    const rawText = getRawText(msg);
    if (!rawText || rawText.trim() === "") return false;
    return true;
  }

  if (conversationId && (!conversation || isFirstPageLoading)) {
    return (
      <div
        className="w-full h-screen flex flex-col"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2
              className="h-6 w-6 animate-spin"
              style={{ color: theme.colors.mutedForeground }}
            />
            <p
              className="text-sm"
              style={{ color: theme.colors.mutedForeground }}
            >
              Loading conversation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Simplified Header with Phone Call Button */}
      <div
        className="border-b px-4 py-3 flex items-center justify-between"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.components.header.bg,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <AvatarWithBadge
              seed={botSeed}
              size={40}
              badgeImageUrl="/logo.png"
              badgeClassName="border-white"
            />
          </div>
          <div className="flex-1">
            <p
              className="font-semibold"
              style={{ color: theme.colors.foreground }}
            >
              Mike
            </p>
            <p
              className="text-xs"
              style={{ color: theme.colors.mutedForeground }}
            >
              {isResolved ? "Resolved" : isEscalated ? "Escalated" : "Active"}
            </p>
          </div>
        </div>
        {/* Phone button - always visible if assistant configured */}
        {widgetSettings?.vapiSettings?.assistantId ? (
          <Button
            size="icon"
            variant="ghost"
            style={{
              color: theme.colors.primary,
            }}
            disabled={isConnecting || !hasVapiSecrets}
            onClick={() => {
              if (!hasVapiSecrets) {
                console.warn("Vapi secrets not loaded");
                return;
              }
              startVapiCall();
              setScreen("voice");
            }}
            title="Start Voice Call"
          >
            <Phone className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundColor: theme.colors.background,
          gap: theme.spacing.messageGap,
        }}
      >
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: theme.colors.primary + "15", // 15% opacity
              }}
            >
              <span className="text-xl">💬</span>
            </div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: theme.colors.foreground }}
            >
              Start a conversation
            </p>
            <p
              className="text-xs"
              style={{ color: theme.colors.mutedForeground }}
            >
              Send a message to begin chatting
            </p>
          </div>
        )}

        {sorted.map((msg) => {
          if (!shouldRenderMessage(msg as MessageData)) return null;

          const role = getRole(msg as MessageData);
          const rawText = getRawText(msg as MessageData);
          const isUser = role === "user";

          return (
            <div
              key={msg._id}
              className={cn(
                "flex gap-3 items-start",
                isUser ? "justify-end" : "justify-start",
              )}
            >
              {!isUser && (
                <div className="flex-shrink-0">
                  <AvatarWithBadge
                    seed={botSeed}
                    size={32}
                    badgeImageUrl="/logo.png"
                    badgeClassName="border-white"
                  />
                </div>
              )}

              <div className={cn("max-w-xs", isUser && "text-right")}>
                <div
                  className="px-3 py-2 rounded-lg text-sm break-words"
                  style={
                    isUser
                      ? {
                          backgroundColor: theme.colors.userMessage.bg,
                          color: theme.colors.userMessage.text,
                          borderBottomRightRadius: "0",
                        }
                      : {
                          backgroundColor: theme.colors.assistantMessage.bg,
                          color: theme.colors.assistantMessage.text,
                          borderBottomLeftRadius: "0",
                        }
                  }
                >
                  {rawText}
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  {format(new Date(msg._creationTime), "HH:mm")}
                </p>
              </div>

              {isUser && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                  style={{
                    backgroundColor: theme.colors.userMessage.bg,
                    color: theme.colors.userMessage.text,
                  }}
                >
                  👤
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0">
              <AvatarWithBadge
                seed={botSeed}
                size={32}
                badgeImageUrl="/logo.png"
                badgeClassName="border-white"
              />
            </div>
            <div
              className="px-3 py-2 rounded-lg rounded-bl-none"
              style={{
                backgroundColor: theme.colors.assistantMessage.bg,
                color: theme.colors.assistantMessage.text,
              }}
            >
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: theme.colors.assistantMessage.text + "99",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: theme.colors.assistantMessage.text + "99",
                    animationDelay: "150ms",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: theme.colors.assistantMessage.text + "99",
                    animationDelay: "300ms",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div
        className="border-t p-4"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        }}
      >
        <form className="flex items-end gap-2" onSubmit={handleSend}>
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              onKeyDown={handleKeyDown}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isEscalated
                  ? "Operator is responding..."
                  : isResolved
                    ? "Conversation resolved"
                    : "Type your message..."
              }
              disabled={!canSend || isSending}
              className="min-h-[44px] max-h-[120px] resize-none rounded-lg"
              style={{
                backgroundColor: theme.components.input.bg,
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
              rows={1}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || !threadId || !canSend || isSending}
            className="h-10 w-10 flex-shrink-0"
            style={
              !message.trim() || !threadId || !canSend || isSending
                ? {
                    backgroundColor: theme.components.button.disabled.bg,
                    color: theme.components.button.disabled.text,
                  }
                : {
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }
            }
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
