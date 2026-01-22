"use client";

import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  greetingMessageAtom,
  screenAtom,
  showGreetingAtom,
} from "../../atoms/widget-atoms";
import { MessageCircle } from "lucide-react";

const GREETINGS = [
  "Hi there! 👋 How can we help?",
  "Welcome! 😊 What can I do for you?",
  "Hey! Got any questions? 🤔",
  "Ready to chat? Let's go! 💬",
  "Hello! Happy to assist! 🎉",
];

export const WidgetGreetingScreen = () => {
  const setShowGreeting = useSetAtom(showGreetingAtom);
  const setScreen = useSetAtom(screenAtom);
  const [displayMessage, setDisplayMessage] = useState(GREETINGS[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Pick random greeting on mount
  useEffect(() => {
    const randomGreeting =
      GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setDisplayMessage(randomGreeting);

    // Trigger animation after render
    setTimeout(() => setIsExpanded(true), 100);
  }, []);

  // Auto-collapse after 5 seconds
  useEffect(() => {
    if (!isExpanded) return;

    const timer = setTimeout(() => {
      setIsExpanded(false);
      // Wait for collapse animation then hide and go to chat
      setTimeout(() => {
        setShowGreeting(false);
        setScreen("chat");
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isExpanded, setScreen, setShowGreeting]);

  // If user clicks, go to chat
  const handleClick = () => {
    setIsExpanded(false);
    setTimeout(() => {
      setShowGreeting(false);
      setScreen("chat");
    }, 300);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
      <div
        className={`
          flex items-center gap-x-3 px-4 py-3 rounded-2xl bg-primary text-primary-foreground
          transition-all duration-300 cursor-pointer hover:shadow-lg
          ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        onClick={handleClick}
      >
        <MessageCircle className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">{displayMessage}</span>
      </div>

      <p className="text-xs text-muted-foreground">Click to start chatting</p>
    </div>
  );
};
