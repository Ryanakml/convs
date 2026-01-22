/**
 * Notification Service
 * Handles unread message counts and notifications
 */

const UNREAD_KEY = "convs_unread_count";
const HAS_UNREAD_KEY = "convs_has_unread";

export function getUnreadCount(): number {
  try {
    const stored = localStorage.getItem(UNREAD_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function setUnreadCount(count: number): void {
  try {
    if (count > 0) {
      localStorage.setItem(UNREAD_KEY, count.toString());
      localStorage.setItem(HAS_UNREAD_KEY, "true");
    } else {
      localStorage.removeItem(UNREAD_KEY);
      localStorage.setItem(HAS_UNREAD_KEY, "false");
    }
  } catch (error) {
    console.warn("[Notification] Failed to set unread count:", error);
  }
}

export function incrementUnreadCount(): number {
  const current = getUnreadCount();
  const newCount = current + 1;
  setUnreadCount(newCount);
  return newCount;
}

export function clearUnreadCount(): void {
  setUnreadCount(0);
}

export function hasUnreadMessages(): boolean {
  try {
    const stored = localStorage.getItem(HAS_UNREAD_KEY);
    return stored === "true";
  } catch {
    return false;
  }
}
