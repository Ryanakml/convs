"use client";

import { useSetAtom } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, MicIcon, PhoneIcon, XIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useVapi } from "../../hooks/use-vapi";
import { useTheme } from "../../hooks/use-theme";
import { WidgetHeader } from "../components/widget-header";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const theme = useTheme();
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
            style={{
              color: theme.colors.primary,
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p
            className="text-lg font-medium"
            style={{ color: theme.colors.foreground }}
          >
            Voice
          </p>
        </div>
      </WidgetHeader>
      <div
        className="flex flex-1 h-full flex-col overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        {transcriptMessages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-y-4">
            <div
              className="flex items-center justify-center rounded-full border p-3"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              }}
            >
              <MicIcon
                className="size-6"
                style={{ color: theme.colors.mutedForeground }}
              />
            </div>
            <p
              className="text-xs"
              style={{ color: theme.colors.mutedForeground }}
            >
              Transcript will appear here
            </p>
          </div>
        ) : (
          <div
            className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4"
            style={{ gap: theme.spacing.messageGap }}
          >
            {transcriptMessages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2 text-sm"
                  style={
                    msg.role === "user"
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
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className="border-t bg-background p-4"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        }}
      >
        <div
          className="flex flex-col items-center gap-y-4"
          style={{ gap: theme.spacing.messageGap }}
        >
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-3 rounded-full animate-pulse",
                  isSpeaking ? "bg-green-500" : "bg-red-500",
                )}
                style={{
                  backgroundColor: isSpeaking
                    ? theme.components.indicator.speaking
                    : theme.components.indicator.listening,
                }}
              />
              <span
                className="text-xs"
                style={{ color: theme.colors.mutedForeground }}
              >
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
                style={{
                  backgroundColor: theme.components.button.ghost.bg,
                  color: theme.components.button.ghost.text,
                }}
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
                style={
                  isConnecting
                    ? {
                        backgroundColor: theme.components.button.disabled.bg,
                        color: theme.components.button.disabled.text,
                      }
                    : {
                        backgroundColor: theme.components.button.ghost.bg,
                        color: theme.components.button.ghost.text,
                      }
                }
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
