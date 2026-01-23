import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { WidgetScreen } from "../types";
import { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { ThemeConfig, defaultTheme } from "../theme/theme";

// Basic widget state atom
export const screenAtom = atom<WidgetScreen>("loading");

// Theme atom - centralized theme configuration
export const themeAtom = atom<ThemeConfig>(defaultTheme);

export const errorMessageAtom = atom<string | null>(null);

export const loadingMessageAtom = atom<string | null>(null);

export const organizationIdAtom = atom<string | null>(null);

export const contactSessionIdFamily = atomFamily((organizationIdAtom: string) =>
  atomWithStorage<Id<"contactSessions"> | null>(
    `{CONTACT_SESSION_KEY}_${organizationIdAtom}`,
    null,
  ),
);

export const conversationIdAtom = atom<Id<"conversations"> | null>(null);

export const widgetSettingsAtom = atom<Doc<"widgetSettings"> | null>(null);

export const vapiSecretsAtom = atom<{
  publicApiKey: string;
} | null>(null);

export const hasVapiSecretsAtom = atom((get) => get(vapiSecretsAtom) !== null);

// Greeting notification state
export const showGreetingAtom = atom<boolean>(false);
export const greetingMessageAtom = atom<string>(
  "Hi there! 👋 How can we help?",
);
export const unreadCountAtom = atom<number>(0);
export const hasUnreadMessageAtom = atomWithStorage<boolean>(
  "convs_has_unread",
  false,
);
