"use client"; // next js app router, make this file a client component

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
import { api } from "@workspace/backend/_generated/api"; // a function to access convex backend function or components
import { useAction, usePaginatedQuery, useQuery } from "convex/react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowLeftIcon,
  Loader2,
  Menu,
  Phone,
  SendHorizontal,
} from "lucide-react";
import { format } from "date-fns/format";

import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { AvatarWithBadge } from "@workspace/ui/components/dicebear-avatar";
import { WidgetHeader } from "../components/widget-header";

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
  // Read global state with jotai atoms useAtomValue and useSetAtom to change value temporarily
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const setScreen = useSetAtom(screenAtom);

  const onBack = () => setScreen("selection");

  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || ""),
  );

  // Create local state with useState
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // store previous messages with useRef
  const endRef = useRef<HTMLDivElement | null>(null); // automatically scroll to the buttom when new message arrives (triggered )
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // to focus the textarea when screen load

  // Fetch data from backend with convex
  // 1. Define server action which is sending messafe to backend
  const sendMessage = useAction(api.public.message.create);

  // 2. Fetch current conversation with useQuery just if we have conversationId and contactSessionId ready and setted
  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? { conversationId, contactSessionId }
      : "skip",
  );

  // get threadId and statuses from conversation
  const threadId = conversation?.threadId;
  const isResolved = conversation?.status === "resolved";
  const isEscalated = conversation?.status === "escalated";
  const canSend = !isResolved;
  const botSeed = threadId || conversation?._id || "support-bot";

  // 3. fetch messages with usePaginationQuery for chunked loading just if we have threadId and contactSessionId ready and setted
  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.public.message.getMany,
    threadId && contactSessionId ? { threadId, contactSessionId } : "skip",
    { initialNumItems: 20 },
  );

  // 4. Sort messages by createdAt ascending
  //if message empty, use empty array, ...copy and dont mutate original data
  const sorted = [...(messages ?? [])].sort(
    // sort order by creation time ascending
    (a, b) => a._creationTime - b._creationTime,
  );

  // Initialize infinite scroll hook
  const {
    topElementRef,
    handleLoadMore,
    isLoadingMore,
    canLoadMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status,
    loadMore,
    loadSize: 20,
    observerEnabled: !isResolved,
  });

  // Side Effect with use Effect, auto focus and autoscroll
  // 1. auto scroll to button when new message arrives
  useEffect(() => {
    // Only scroll to bottom if we are NOT loading more (historical messages)
    // and if it's a new message or initial load.
    // Simple heuristic: if we are loading more, don't scroll to bottom.
    if (!isLoadingMore && !isLoadingFirstPage) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sorted.length, isLoadingMore, isLoadingFirstPage]); // run this effect when sorted messages change

  // 2. Auto focus textarea when screen load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []); // run this empty array if component mount only

  // Navigation handlers - REMOVED (no back navigation needed)

  // Sending message handler
  // 1. Create send handler
  const handleSend = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault(); // prevent reload form submit behavior

    // validate all message conditions before sending
    if (
      // if message is empty or
      !message.trim() ||
      // if conversation is not ready or
      !threadId ||
      // if session is not ready or
      !contactSessionId ||
      // if previous message is still sending
      isSending ||
      // if conversation is resolved
      isResolved
    )
      // then just stop the function here
      return;

    // extract cleaned message, not spaced in end or start
    const prompt = message.trim(); // get trimmed message

    // ui handler when message is sending
    setMessage(""); // clear input message
    setIsSending(true); // set sending state to true

    // call the server
    try {
      await sendMessage({
        prompt,
        threadId,
        contactSessionId,
      }); // this will call cenvex action to send user message, thrigger ai response, update databse. and will taked again by usePaginationQuery to update messages
    } catch (error) {
      // error handling
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false); // set sending state to false when done or stop the spinner
      textareaRef.current?.focus(); // refocus textarea after sending, so user can type again
    }
  };

  // handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // enter not create new line
      handleSend(e); // call send handler
    }
  };

  // handler who send message when button clicked
  function getRole(msg: MessageData): "user" | "assistant" {
    const messageRole = msg?.message?.role ?? msg?.role;

    // Strategy 1: Check explicit role labels from backend
    if (messageRole === "user") return "user";
    if (messageRole === "assistant" || messageRole === "bot") {
      return "assistant";
    }

    // Strategy 2: Check ownership by session ID
    // Convert both to strings to ensure comparison works
    if (contactSessionId && msg.contactSessionId) {
      if (String(msg.contactSessionId) === String(contactSessionId)) {
        return "user";
      }
    }

    // Strategy 2b: Convex messages carry userId; match it to the session
    if (contactSessionId && msg.userId) {
      if (String(msg.userId) === String(contactSessionId)) {
        return "user";
      }
    }

    // Strategy 3: Check if message has userId
    if (msg.userId && !msg.tool) {
      return "user";
    }

    // Default: Treat as bot message
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

  // Show loading skeleton
  // we have conversationId. we know which conversation to load, but we dont have conversation data yet. so
  // we show spinning loader to indicate loading state
  const isFirstPageLoading = status === "LoadingFirstPage";

  if (conversationId && (!conversation || isFirstPageLoading)) {
    return (
      <div className="max-w-2xl w-full mx-auto p-4 h-screen flex flex-col">
        <WidgetHeader className="flex items-center justify-between border-b">
          <div className="flex items-center gap-x-2">
            <Button size="icon" variant="ghost" onClick={onBack}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <p className="font-medium">Chat</p>
          </div>
          <Button size="icon" variant="ghost">
            <Menu className="h-4 w-4" />
          </Button>
        </WidgetHeader>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Loading conversation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Chat UI
  return (
    // 1. Main container structure
    <div className="max-w-2xl w-full mx-auto p-4 h-screen flex flex-col">
      {/* 2. Header with back button and title */}
      <WidgetHeader className="flex items-center justify-between border-b">
        <div className="flex items-center gap-x-2">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <p className="font-medium">Chat</p>
            {(isResolved || isEscalated) && (
              <p className="text-xs text-muted-foreground">
                {isResolved ? "Resolved" : "Escalated"}
              </p>
            )}
          </div>
        </div>
        <Button size="icon" variant="ghost">
          <Menu className="h-4 w-4" />
        </Button>
      </WidgetHeader>

      {/* 2. Messages Container */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 p-4 mb-4 overflow-y-auto bg-gray-50">
          {/* Infinite Scroll Trigger */}
          {!isLoadingFirstPage && sorted.length > 0 && (
            <InfiniteScrollTrigger
              ref={topElementRef}
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              loadMoreText="Load previous messages"
              noMoreText="No more messages"
            />
          )}

          {/* Empty State if no conversation yet */}
          {sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-xl">💬</span>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Start a conversation
              </p>
              <p className="text-xs text-muted-foreground">
                Send a message to begin chatting
              </p>
            </div>
          )}
          {/* Render messages */}
          {sorted.map((msg) => {
            if (!shouldRenderMessage(msg as MessageData)) return null;
            // Determine role, the main function to know if the message is from user or bot
            const role = getRole(msg as MessageData);
            const rawText = getRawText(msg as MessageData);

            // if the message is from user, function is to determine what icon and position of message
            const isUser = role === "user";

            return (
              // Wrap every bubble message
              <div
                key={msg._id}
                className={cn(
                  "flex w-full gap-3 mb-4 items-start",
                  isUser ? "justify-end" : "justify-start", // This logic is for left-right alignment
                )}
              >
                {/* Avatar Bot */}
                {!isUser && (
                  <div className="flex-shrink-0">
                    <AvatarWithBadge
                      seed={botSeed}
                      size={36}
                      badgeImageUrl="/logo.png"
                      badgeClassName="border-background"
                    />
                  </div>
                )}

                {/* Bubble Area */}
                <div className="max-w-[75%] space-y-1">
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap break-words mt-1",
                      isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/80 text-foreground rounded-bl-md",
                    )}
                  >
                    {rawText}
                  </div>
                  <p
                    className={cn(
                      "text-[11px] text-muted-foreground",
                      isUser && "text-right",
                    )}
                  >
                    {format(new Date(msg._creationTime), "HH:mm")}
                  </p>
                </div>

                {/* Avatar User */}
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-primary-foreground">👤</span>
                  </div>
                )}
              </div>
            );
          })}
          {/* Sending Indicator for bot (....) */}
          {isSending && (
            <div className="flex w-full gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <AvatarWithBadge
                  seed={botSeed}
                  size={36}
                  badgeImageUrl="/logo.png"
                  badgeClassName="border-background"
                />
              </div>
              <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm bg-muted/80">
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          {/* call useRef function to automatically scroll to bottom after message generated */}
          <div ref={endRef} />
        </div>
      </div>

      {/* 3. Input Area */}
      <div className="border-t bg-background">
        {/* Inner container */}
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Form to handle submit */}
          <form className="flex items-end gap-2" onSubmit={handleSend}>
            {/* wrap textarea input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef} // auto focus again after sending
                onKeyDown={handleKeyDown}
                value={message}
                onChange={(e) => setMessage(e.target.value)} // update message state on change
                placeholder={
                  isEscalated
                    ? "Escalated to an operator. You can still send updates."
                    : isResolved
                      ? "This conversation is resolved."
                      : "Type your message..."
                } // input placeholder
                disabled={!canSend || isSending} // disable input if conversation is resolved
                className="min-h-[52px] max-h-[200px] resize-none pr-12 rounded-xl"
                rows={1}
              />
            </div>
            {/* Send button */}
            <Button
              type="submit" // trigger onSubmit=handleSend after clicked
              size="icon" // icon size button
              disabled={!message.trim() || !threadId || !canSend || isSending} // disable button if message is empty or conversation is resolved or message is sending or threadId not ready
              className="h-[52px] w-[52px] rounded-xl flex-shrink-0"
            >
              {/* if sending then load the loader icon else show send icon */}
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5" />
              )}
            </Button>
          </form>
          {/* Resolved Notice */}
          <div>
            {(isResolved || isEscalated) && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {isResolved
                  ? "This conversation has been resolved. You can no longer send messages."
                  : "This conversation has been escalated. A human operator will respond here; the bot has been disabled."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
