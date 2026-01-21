"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAction,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { AvatarWithBadge } from "@workspace/ui/components/dicebear-avatar";
import { Button } from "@workspace/ui/components/button";
import { ConversataionStatusButton } from "../components/conversation-status-button";
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
  MoreHorizontalIcon,
  SendHorizontal,
  Wand2Icon,
} from "lucide-react";
import { format } from "date-fns/format";
import { Skeleton } from "@workspace/ui/components/skeleton";

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

  const messageValue = form.watch("message");
  const hasMessage = messageValue && messageValue.trim().length > 0;

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
      messageRole === "bot"
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

  const TOOL_TAG_PATTERN = /<\s*search\b[\s\S]*?>/i;

  function getRawText(msg: any) {
    return (
      msg.text ??
      (typeof msg.message?.content === "string"
        ? msg.message.content
        : msg.content)
    );
  }

  function shouldRenderMessage(msg: any) {
    const messageRole = msg?.message?.role ?? msg?.role;
    if (messageRole === "system" || messageRole === "tool") return false;
    if (msg?.tool) return false;

    const rawText = getRawText(msg);
    if (!rawText || rawText.trim() === "") return false;
    if (TOOL_TAG_PATTERN.test(rawText)) return false;
    return true;
  }

  const isFirstPageLoading = status === "LoadingFirstPage";
  const isResolved = conversation?.status === "resolved";
  const isEscalated = conversation?.status === "escalated";
  const canReply = Boolean(isEscalated && !isResolved);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const updateStatus = useMutation(api.private.conversations.updateStatus);

  const [isEnhancing, setIsEnhancing] = useState(false);
  const enhanceResponse = useAction(api.private.message.enhanceResponse);
  const handleEnhanceResponse = async () => {
    // Ambil value langsung dari watch atau getValues
    const currentValue = form.getValues("message").trim();
    const threadId = conversation?.threadId;

    if (!threadId || !currentValue) return;

    setIsEnhancing(true);
    try {
      const response = await enhanceResponse({
        prompt: currentValue,
        threadId,
      });

      // Update form dengan hasil enhance
      form.setValue("message", response, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      console.error("Failed to enhance response:", error);
      // Optional: Kasih toast error disini
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleChangeStatus = async (
    nextStatus: "unresolved" | "escalated" | "resolved"
  ) => {
    if (!conversation) return;
    setIsUpdatingStatus(true);
    try {
      await updateStatus({
        conversationId: conversation._id,
        status: nextStatus,
      });
    } catch (error) {
      console.error("Failed to update conversation status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  if (conversation === undefined) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              {/* Nama & Email Skeleton */}
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Button & Menu Skeleton */}
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-hidden bg-muted/30 p-4">
          {Array.from({ length: 8 }).map((_, index) => {
            // Logic selang-seling (Kiri - Kanan)
            const isMySide = index % 2 === 0;

            return (
              <div
                key={index}
                className={cn(
                  "flex items-end gap-3 w-full",
                  isMySide ? "justify-end" : "justify-start"
                )}
              >
                {!isMySide && (
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                )}

                <div
                  className={cn(
                    "space-y-1 max-w-[70%]",
                    isMySide && "items-end flex flex-col"
                  )}
                >
                  <Skeleton
                    className={cn(
                      "h-10 rounded-2xl",
                      isMySide ? "rounded-br-sm" : "rounded-bl-sm"
                    )}
                    // Lebar random biar terlihat natural
                    style={{ width: `${Math.random() * 100 + 100}px` }}
                  />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t bg-background p-4">
          <div className="space-y-3">
            {/* Textarea Skeleton */}
            <Skeleton className="h-[56px] w-full rounded-2xl" />

            <div className="flex items-center justify-between gap-2">
              {/* Enhance Button Skeleton */}
              <Skeleton className="h-8 w-32" />

              <div className="flex items-center gap-2">
                {/* Send Button Skeleton */}
                <Skeleton className="h-[44px] w-[44px] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (conversation === null) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground">
        Conversation not found.
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
          <ConversataionStatusButton
            status={conversation.status}
            onChange={handleChangeStatus}
            isLoading={isUpdatingStatus}
          />
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

          {isFirstPageLoading ? (
            <div className="flex w-full flex-col gap-4">
              {Array.from({ length: 8 }).map((_, index) => {
                const isMySide = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-end gap-3 w-full",
                      isMySide ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isMySide && (
                      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    )}

                    <div
                      className={cn(
                        "space-y-1 max-w-[70%]",
                        isMySide && "items-end flex flex-col"
                      )}
                    >
                      <Skeleton
                        className={cn(
                          "h-10 rounded-2xl",
                          isMySide ? "rounded-br-sm" : "rounded-bl-sm"
                        )}
                        style={{ width: `${Math.random() * 100 + 100}px` }}
                      />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            sorted.map((msg: any) => {
              if (!shouldRenderMessage(msg)) return null;
              const role = getRole(msg);
              const rawText = getRawText(msg);

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
                      <span className="text-sm text-primary-foreground">
                        👤
                      </span>
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
            })
          )}

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
                className="gap-2 text-xs md:text-sm"
                disabled={!canReply || isEnhancing || !hasMessage}
                onClick={handleEnhanceResponse}
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2Icon className="h-4 w-4" />
                    Enhance Response
                  </>
                )}
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
