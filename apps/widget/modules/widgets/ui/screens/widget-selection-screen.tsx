"use client";

import { useState } from "react";
import {
  ChevronRightIcon,
  MessageSquareIcon,
  MicIcon,
  PhoneIcon,
} from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useSetAtom, useAtomValue } from "jotai";
import {
  screenAtom,
  organizationIdAtom,
  contactSessionIdFamily,
  errorMessageAtom,
  conversationIdAtom,
  widgetSettingsAtom,
  hasVapiSecretsAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const setConversationId = useSetAtom(conversationIdAtom);
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);

  let widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);

  // Fallback for development/testing
  if (!widgetSettings?.vapiSettings?.assistantId) {
    widgetSettings = {
      ...widgetSettings,
      vapiSettings: {
        assistantId: "test-assistant-id",
        phoneNumber: "",
      },
    } as any;
  }

  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdFamily(organizationId || ""),
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
        {/* Start a Chat */}
        <Button
          className="w-full h-16 justify-between rounded-xl bg-card hover:bg-accent px-4 border shadow-sm transition-all"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MessageSquareIcon className="size-5 text-primary" />
            </div>
            <span className="font-medium text-sm text-foreground">
              Start a chat
            </span>
          </div>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Button>

        {/* Voice Chat */}
        {widgetSettings?.vapiSettings?.assistantId && (
          <Button
            className="w-full h-16 justify-between rounded-xl bg-card hover:bg-accent px-4 border shadow-sm transition-all mt-2"
            variant="outline"
            onClick={() => setScreen("voice")}
            disabled={isPending || !hasVapiSecrets}
          >
            <div className="flex items-center gap-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MicIcon className="size-5 text-primary" />
              </div>
              <span className="font-medium text-sm text-foreground">
                Start Voice Call
              </span>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </Button>
        )}

        {/* Contact Us */}
        {widgetSettings?.vapiSettings?.phoneNumber && (
          <Button
            className="w-full h-16 justify-between rounded-xl bg-card hover:bg-accent px-4 border shadow-sm transition-all mt-2"
            variant="outline"
            onClick={() => setScreen("contact")}
            disabled={isPending || !hasVapiSecrets}
          >
            <div className="flex items-center gap-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <PhoneIcon className="size-5 text-primary" />
              </div>
              <span className="font-medium text-sm text-foreground">
                Contact Us
              </span>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      <WidgetFooter />
    </>
  );
};
