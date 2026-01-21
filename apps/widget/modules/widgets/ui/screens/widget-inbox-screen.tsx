"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import {
  contactSessionIdFamily,
  organizationIdAtom,
  screenAtom,
  conversationIdAtom,
} from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || ""),
  );

  const setConversationId = useSetAtom(conversationIdAtom);

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    {
      initialNumItems: 10,
    },
  );

  const getVisibility = (message: any) => {
    return (
      message?.providerOptions?.meta?.visibility ??
      message?.message?.providerOptions?.meta?.visibility ??
      message?.meta?.visibility
    );
  };

  const getLastMessageText = (lastMessage: any) => {
    if (getVisibility(lastMessage) === "internal") return "";
    const rawText =
      lastMessage?.text ??
      (typeof lastMessage?.message?.content === "string"
        ? lastMessage.message.content
        : lastMessage?.content);
    if (!rawText) return "";
    return rawText;
  };
  return (
    <>
      <div className="flex flex-col h-full">
        <WidgetHeader>
          <div className="flex items-center gap-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setScreen("selection")}
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="text-lg font-medium">Inbox</p>
          </div>
        </WidgetHeader>

        <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
          {conversations?.status === "LoadingFirstPage" && (
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
              <div className="relative flex flex-col w-full p-2 min-w-0">
                <div className="w-full space-y-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg p-4"
                    >
                      <Skeleton className="w-10 h-10 shrink-0 rounded-full" />
                      <div className="min-w-10 flex-1">
                        <div className="flex w-full items-center gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                        </div>
                        <div className="mt-2">
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {conversations?.results.length > 0 &&
            conversations?.results.map((conversation) => (
              <Button
                key={conversation._id}
                onClick={() => {
                  setConversationId(conversation._id);
                  setScreen("chat");
                }}
                variant="outline"
                // Perubahan: Hapus bg-accent-foreground, ganti ke bg-card, tambah padding p-4
                className="w-full h-20 justify-start rounded-xl bg-card hover:bg-accent p-4 mb-2 transition-colors border shadow-sm"
              >
                <div className="flex flex-col w-full gap-y-1 overflow-hidden text-start">
                  <div className="flex w-full items-center justify-between gap-x-2">
                    {/* Warna teks diubah ke primary agar lebih terbaca */}
                    <p className="text-primary font-medium text-xs">Chat</p>
                    <p className="text-muted-foreground text-[10px]">
                      {formatDistanceToNow(
                        new Date(conversation._creationTime),
                        { addSuffix: true },
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full gap-x-2">
                    {/* Preview pesan dibuat lebih kontras */}
                    <p className="truncate text-sm text-foreground/80 font-normal">
                      {getLastMessageText(conversation.lastMessage) ||
                        "New conversation"}
                    </p>
                    <div className="shrink-0">
                      <ConversationStatusIcon status={conversation.status} />
                    </div>
                  </div>
                </div>
              </Button>
            ))}
        </div>
      </div>

      <WidgetFooter />
    </>
  );
};
