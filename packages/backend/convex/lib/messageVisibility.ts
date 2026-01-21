export type MessageVisibility = "user" | "internal";

export const USER_MESSAGE_METADATA = {
  providerOptions: { meta: { visibility: "user" as const } },
} as const;

export const INTERNAL_MESSAGE_METADATA = {
  providerOptions: { meta: { visibility: "internal" as const } },
} as const;

type MessageVisibilityCarrier = {
  providerOptions?: { meta?: { visibility?: MessageVisibility } };
  message?: { providerOptions?: { meta?: { visibility?: MessageVisibility } } };
  role?: string;
  tool?: boolean;
};

export function getMessageVisibility(
  message: MessageVisibilityCarrier | null | undefined
): MessageVisibility | undefined {
  if (!message) return undefined;
  return (
    message.providerOptions?.meta?.visibility ??
    message.message?.providerOptions?.meta?.visibility
  );
}

export function isInternalMessage(
  message: (MessageVisibilityCarrier & { message?: { role?: string } }) | null
): boolean {
  if (!message) return false;
  const visibility = getMessageVisibility(message);
  if (visibility === "internal") return true;
  const role = message.message?.role ?? message.role;
  if (role === "system" || role === "tool") return true;
  return Boolean(message.tool);
}
