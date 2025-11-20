"use client";

import { useState } from "react";
import { ChevronRightIcon, MessageSquareIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useSetAtom, useAtomValue } from "jotai";
import {
  screenAtom,
  organizationIdAtom,
  contactSessionIdFamily,
  errorMessageAtom,
  conversationIdAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export const WidgetSelectionScreen = () => {
  const setConversationId = useSetAtom(conversationIdAtom);
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || "")
  );

  const [isPending, setIsPending] = useState(false);

  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversation = async () => {
    setIsPending(true);
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Organization ID is missing");
      return;
    }

    try {
      const conversationId = await createConversation({
        organizationId,
        contactSessionId,
      });

      setConversationId(conversationId);

      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col gap-y-2">
          <p className="text-3xl font-semibold">Hi there!</p>
          <p className="text-lg text-muted-foreground">Lets get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
        <Button
          className="w-full h-16 justify-between rounded-xl bg-accent-foreground"
          variant={"outline"}
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareIcon className="size-4" />
            <span>Start a chat</span>
          </div>
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </>
  );
};
