"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, CheckIcon, CopyIcon, PhoneIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import Link from "next/link";

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);

  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

  const [copied, setCopied] = useState(false);

  const handleCopied = async () => {
    if (!phoneNumber) return;

    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy phone number:", error);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScreen("selection")}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-medium">Contact Us</p>
        </div>
      </WidgetHeader>
      <div className="flex h-full flex-col gap-y-4 items-center justify-center">
        <div className="flex items-center justify-center border bg-white rounded-full p-3">
          <PhoneIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Available 24/7</p>
        <p className="text-2xl font-bold">{phoneNumber}</p>
      </div>
      <div className="border bg-background p-4">
        <div className="flex flex-col items-center gap-y-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleCopied()}
            className="w-full"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" />
                Copy Phone Number
              </>
            )}
          </Button>
          <Button className="w-full" size="lg" asChild>
            <Link href={`tel:${phoneNumber}`}>
              <PhoneIcon className="h-4 w-4" />
              Call Us
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
