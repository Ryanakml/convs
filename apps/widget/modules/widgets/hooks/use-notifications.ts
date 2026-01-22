"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { hasUnreadMessageAtom, unreadCountAtom } from "../atoms/widget-atoms";
import { useEffect } from "react";
import {
  clearUnreadCount,
  getUnreadCount,
  setUnreadCount,
} from "../lib/notification-service";
import {
  showNotification,
  hideNotification,
} from "../lib/parent-communication";

export function useNotifications() {
  const hasUnread = useAtomValue(hasUnreadMessageAtom);
  const unreadCount = useAtomValue(unreadCountAtom);
  const setHasUnread = useSetAtom(hasUnreadMessageAtom);
  const setUnreadCountState = useSetAtom(unreadCountAtom);

  // Initialize unread count from localStorage
  useEffect(() => {
    const count = getUnreadCount();
    setUnreadCountState(count);
  }, [setUnreadCountState]);

  const markAsRead = () => {
    clearUnreadCount();
    setHasUnread(false);
    setUnreadCountState(0);
    hideNotification(); // Hide red dot from embed
  };

  const addUnread = () => {
    const newCount = getUnreadCount() + 1;
    setUnreadCount(newCount);
    setUnreadCountState(newCount);
    setHasUnread(true);
    showNotification(); // Show red dot in embed
  };

  return {
    hasUnread,
    unreadCount,
    markAsRead,
    addUnread,
  };
}
