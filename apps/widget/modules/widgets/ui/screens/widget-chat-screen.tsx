"use client";

import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import { ArrowLeftIcon, Menu } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";

export const WidgetChatScreen = () => {
  const setConversationId = useSetAtom(conversationIdAtom);
  const setScreen = useSetAtom(screenAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || "")
  );

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button size={"icon"} variant={"ghost"} onClick={onBack}>
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button size={"icon"} variant={"ghost"}>
          <Menu />
        </Button>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4">
        {JSON.stringify(conversation)}
      </div>
    </>
  );
};
