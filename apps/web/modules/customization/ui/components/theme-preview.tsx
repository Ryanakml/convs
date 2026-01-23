"use client";

import { AvatarWithBadge } from "@workspace/ui/components/dicebear-avatar";
import { Phone, SendHorizontal } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { ThemeColors, ThemeComponents } from "../../type";

interface ThemePreviewProps {
  colors: ThemeColors;
  components: ThemeComponents;
}

export const ThemePreview = ({ colors, components }: ThemePreviewProps) => {
  return (
    <div
      className="flex flex-col h-full rounded-lg border overflow-hidden shadow-sm"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header - matches widget-chat-screen.tsx layout */}
      <div
        className="border-b px-4 py-3 flex items-center justify-between"
        style={{
          borderColor: colors.border,
          backgroundColor: components.header.bg,
        }}
      >
        {/* Left side: Avatar + Text info */}
        <div className="flex items-center gap-3 flex-1">
          <AvatarWithBadge
            seed="preview-bot"
            size={40}
            badgeImageUrl="/logo.png"
            badgeClassName="border-white"
          />
          <div className="flex-1">
            <p
              className="font-semibold text-sm"
              style={{ color: components.header.textColor }}
            >
              Mike
            </p>
            <p className="text-xs" style={{ color: colors.mutedForeground }}>
              Active
            </p>
          </div>
        </div>

        {/* Right side: Call button (top right corner) */}
        <Button
          size="icon"
          variant="ghost"
          style={{
            color: colors.primary,
          }}
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Container - matches widget styling */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        style={{ backgroundColor: colors.background }}
      >
        {/* Bot Message 1 */}
        <div className="flex gap-3 items-start">
          <AvatarWithBadge
            seed="preview-bot"
            size={32}
            badgeImageUrl="/logo.png"
            badgeClassName="border-white"
          />
          <div
            className="px-3 py-2 rounded-lg max-w-xs text-sm"
            style={{
              backgroundColor: colors.assistantMessage.bg,
              color: colors.assistantMessage.text,
            }}
          >
            Hi there! How can I help you today?
          </div>
        </div>

        {/* User Message 1 */}
        <div className="flex justify-end">
          <div
            className="px-3 py-2 rounded-lg max-w-xs text-sm"
            style={{
              backgroundColor: colors.userMessage.bg,
              color: colors.userMessage.text,
            }}
          >
            I need help with my account
          </div>
        </div>

        {/* Bot Message 2 */}
        <div className="flex gap-3 items-start">
          <AvatarWithBadge
            seed="preview-bot"
            size={32}
            badgeImageUrl="/logo.png"
            badgeClassName="border-white"
          />
          <div
            className="px-3 py-2 rounded-lg max-w-xs text-sm"
            style={{
              backgroundColor: colors.assistantMessage.bg,
              color: colors.assistantMessage.text,
            }}
          >
            Sure! What specific issue are you experiencing?
          </div>
        </div>

        {/* User Message 2 */}
        <div className="flex justify-end">
          <div
            className="px-3 py-2 rounded-lg max-w-xs text-sm"
            style={{
              backgroundColor: colors.userMessage.bg,
              color: colors.userMessage.text,
            }}
          >
            I forgot my password
          </div>
        </div>
      </div>

      {/* Input Section - matches widget-chat-screen.tsx */}
      <div
        className="border-t px-4 py-3 flex gap-2"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Textarea
          placeholder="Type your message..."
          rows={1}
          className="resize-none text-sm"
          style={{
            backgroundColor: components.input.bg,
            borderColor: colors.border,
            color: components.input.textColor,
          }}
        />
        <Button
          size="sm"
          style={{
            backgroundColor: components.button.primary.bg,
            color: components.button.primary.text,
          }}
          className="hover:opacity-90"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
