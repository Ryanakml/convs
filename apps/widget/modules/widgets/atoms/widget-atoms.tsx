import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { WidgetScreen } from "../types";
import { Id } from "@workspace/backend/_generated/dataModel";

// Basic widget state atom
export const screenAtom = atom<WidgetScreen>("loading");

export const errorMessageAtom = atom<string | null>(null);

export const loadingMessageAtom = atom<string | null>(null);

export const organizationIdAtom = atom<string | null>(null);

export const contactSessionIdFamily = atomFamily((organizationIdAtom: string) =>
  atomWithStorage<Id<"contactSessions"> | null>(
    `{CONTACT_SESSION_KEY}_${organizationIdAtom}`,
    null
  )
);

export const conversationIdAtom = atom<Id<"conversations"> | null>(null);
