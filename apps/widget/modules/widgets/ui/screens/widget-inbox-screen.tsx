"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { AlertTriangleIcon, ArrowLeft, Loader2 } from "lucide-react";
import {
  contactSessionIdFamily,
  errorMessageAtom,
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

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || "")
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
    }
  );
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
          {/* {conversations?.status === "LoadingFirstPage" && (
            <div className="flex flex-col gap-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-16 rounded-xl bg-accent-foreground animate-pulse"
                />
              ))}
            </div>
          )} */}
          {conversations?.status === "LoadingFirstPage" && (
            <div className="flex w-full justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
                className="w-full h-16 justify-between rounded-xl bg-accent-foreground"
              >
                <div className="flex flex-col w-full gap-y-2 overflow-hidden text-start">
                  <div className="flex w-full items-center justify-between gap-x-2">
                    <p className="text-muted-foreground text-xs">Chat</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(
                        new Date(conversation._creationTime)
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full gap-x-2">
                    <p className="truncate text-sm">
                      {conversation.lastMessage?.text}
                    </p>
                    <ConversationStatusIcon status={conversation.status} />
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
