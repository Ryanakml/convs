"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { AvatarWithBadge } from "@workspace/ui/components/dicebear-avatar";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { cn } from "@workspace/ui/lib/utils";
import {
  Loader2,
  MenuIcon,
  MoreHorizontalIcon,
  SendHorizontal,
  Wand2Icon,
} from "lucide-react";
import { format } from "date-fns/format";

const formSchema = z.object({
  message: z.string().trim().min(1, "Message is required"),
});

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const createMessage = useMutation(api.private.message.create);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.private.message.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 20 }
  );

  const sorted = useMemo(
    () =>
      [...(messages ?? [])].sort((a, b) => a._creationTime - b._creationTime),
    [messages]
  );

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
    observerEnabled: true,
  });

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoadingMore && !isLoadingFirstPage) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sorted.length, isLoadingMore, isLoadingFirstPage]);

  const contactSessionId =
    conversation?.contactSessionId ?? conversation?.contactSession?._id;
  const botSeed =
    conversation?.threadId || conversation?._id || conversationId || "bot";

  function getRole(msg: any) {
    const messageRole = msg?.message?.role ?? msg?.role;

    if (messageRole === "user") return "user";
    if (
      messageRole === "assistant" ||
      messageRole === "bot" ||
      messageRole === "system" ||
      messageRole === "tool"
    ) {
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

  const isFirstPageLoading = status === "LoadingFirstPage";
  const isResolved = conversation?.status === "resolved";
  const isEscalated = conversation?.status === "escalated";
  const canReply = Boolean(isEscalated && !isResolved);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!canReply) return;

    try {
      await createMessage({
        prompt: data.message.trim(),
        conversationId,
      });
      form.reset({ message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <AvatarWithBadge
            seed={conversation.contactSession._id || "contact"}
            size={36}
            badgeImageUrl="/logo.png"
            badgeClassName="border-background"
          />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold leading-tight">
              {conversation.contactSession.name || "Unknown contact"}
            </p>
            <p className="text-xs text-muted-foreground">
              {conversation.contactSession.email || "No email"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "capitalize",
              conversation.status === "resolved" &&
                "border-green-500 text-green-700",
              conversation.status === "escalated" &&
                "border-yellow-500 text-yellow-700",
              conversation.status === "unresolved" &&
                "border-red-500 text-red-700"
            )}
          >
            {conversation.status}
          </Badge>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
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

          {isFirstPageLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading conversation...
            </div>
          )}

          {sorted.map((msg: any) => {
            const role = getRole(msg);
            const rawText =
              msg.text ??
              (typeof msg.message?.content === "string"
                ? msg.message.content
                : msg.content);

            if (!rawText || rawText.trim() === "") return null;

            const isCustomer = role === "user";
            const isMySide = !isCustomer;

            return (
              <div
                key={msg._id}
                className={cn(
                  "flex w-full gap-3 items-start",
                  isMySide ? "justify-end" : "justify-start"
                )}
              >
                {!isMySide && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-primary-foreground">👤</span>
                  </div>
                )}

                <div className="max-w-[70%] space-y-1">
                  <div
                    className={cn(
                      "inline-block rounded-2xl px-4 py-2 text-sm shadow-sm whitespace-pre-wrap break-words",
                      isMySide
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-white text-foreground rounded-bl-md border"
                    )}
                  >
                    {rawText}
                  </div>
                  <p
                    className={cn(
                      "text-[11px] text-muted-foreground",
                      isMySide && "text-right"
                    )}
                  >
                    {format(new Date(msg._creationTime), "HH:mm")}
                  </p>
                </div>

                {isMySide && (
                  <AvatarWithBadge
                    seed={botSeed}
                    size={36}
                    badgeImageUrl="/logo.png"
                    badgeClassName="border-background"
                  />
                )}
              </div>
            );
          })}

          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t bg-background p-4">
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!canReply || form.formState.isSubmitting}
                      placeholder={
                        isResolved
                          ? "Conversation is resolved"
                          : isEscalated
                            ? "Type your response as an operator..."
                            : "Waiting for escalation..."
                      }
                      className="min-h-[56px] resize-none rounded-2xl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="gap-2"
                disabled={!canReply}
              >
                <Wand2Icon className="h-4 w-4" />
                Enhance
              </Button>
              <div className="flex items-center gap-2">
                {!canReply && (
                  <p className="text-xs text-muted-foreground">
                    {isResolved
                      ? "Resolved conversations are read-only."
                      : "Respond once this conversation is escalated."}
                  </p>
                )}
                <Button
                  type="submit"
                  size="icon"
                  className="h-[44px] w-[44px] rounded-full"
                  disabled={
                    !canReply ||
                    !form.formState.isValid ||
                    form.formState.isSubmitting
                  }
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
