"use client";

/**
 * Utility untuk communicate dengan embed script (parent window)
 */

export function notifyParent(type: string, payload?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.parent !== window) {
    try {
      window.parent.postMessage(
        {
          type,
          payload,
        },
        "*",
      );
    } catch (error) {
      console.warn("[Widget] Failed to notify parent:", error);
    }
  }
}

export function showNotification() {
  notifyParent("show_notification");
}

export function hideNotification() {
  notifyParent("hide_notification");
}
