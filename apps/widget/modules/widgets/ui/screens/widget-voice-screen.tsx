"use client";

import { useSetAtom } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, MicIcon, PhoneIcon, XIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useVapi } from "../../hooks/use-vapi";
import { WidgetHeader } from "../components/widget-header";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const {
    isConnected,
    isSpeaking,
    transcriptMessages,
    startCall,
    endCall,
    isConnecting,
  } = useVapi();

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScreen("chat")}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-medium">Voice</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 h-full flex-col overflow-hidden">
        {transcriptMessages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
            <div className="flex items-center justify-center rounded-full border bg-white p-3">
              <MicIcon className="size-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Transcript will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4">
            {transcriptMessages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-muted-foreground rounded-bl-none",
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t bg-background p-4">
        <div className="flex flex-col items-center gap-y-4">
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-3 rounded-full animate-pulse",
                  isSpeaking ? "bg-green-500" : "bg-red-500",
                )}
              />
              <span className="text-xs text-muted-foreground">
                {isSpeaking
                  ? "Assistant Speaking..."
                  : "Assistant Listening..."}
              </span>
            </div>
          )}
          <div className="flex w-full justify-center">
            {isConnected ? (
              <Button
                size="lg"
                variant="ghost"
                onClick={() => endCall()}
                className="w-full"
              >
                <XIcon className="h-4 w-4" />
                End Call
              </Button>
            ) : (
              <Button
                className="w-full"
                size="lg"
                variant="ghost"
                onClick={() => startCall()}
                disabled={isConnecting}
              >
                <PhoneIcon className="h-4 w-4" />
                Start Call
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
