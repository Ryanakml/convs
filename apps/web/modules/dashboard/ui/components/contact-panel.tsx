"use client";

import Bowser from "bowser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { AvatarWithBadge } from "@workspace/ui/components/dicebear-avatar";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { getCountryFromTimezone } from "@/lib/country-utils";
import { useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import {
  MailIcon,
  MonitorIcon,
  ChevronDownIcon,
  GlobeIcon,
  SmartphoneIcon,
  LinkIcon,
  MapPinIcon,
} from "lucide-react";

interface InfoItem {
  label: string;
  value: string;
}

interface InfoSection {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  items: InfoItem[];
}

export const ContactPanel = () => {
  const params = useParams();
  const conversationId = params?.conversationId as Id<"conversations">;

  const contactSession = useQuery(
    api.private.contactSessions.getOneByConversationId,
    { conversationId }
  );

  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if (!userAgent) {
        return { bowser: "unknown", os: "unknown", device: "unknown" };
      }

      const browser = Bowser.getParser(userAgent);
      const result = browser.getResult();

      return {
        bowser: result.browser.name || "unknown",
        browserVersion: result.browser.version || "unknown",
        os: result.os.name || "unknown",
        osVersion: result.os.version || "unknown",
        device: result.platform.type || "unknown",
        deviceVendor: result.platform.vendor || "unknown",
        deviceModel: result.platform.model || "unknown",
      };
    };
  }, []);

  const userAgentInfo = useMemo(() => {
    return parseUserAgent(contactSession?.metadata?.userAgent);
  }, [contactSession?.metadata?.userAgent, parseUserAgent]);

  const countryInfo = useMemo(() => {
    return getCountryFromTimezone(contactSession?.metadata?.timeZone ?? "");
  }, [contactSession?.metadata?.timeZone]);

  const accordionSections = useMemo<InfoSection[]>(() => {
    if (!contactSession || !contactSession.metadata) {
      return [];
    }

    const metadata = contactSession.metadata;

    return [
      {
        id: "device-info",
        icon: MonitorIcon,
        title: "Device Info",
        items: [
          {
            label: "Browser",
            value:
              userAgentInfo?.bowser +
              (userAgentInfo?.browserVersion
                ? ` (${userAgentInfo?.browserVersion})`
                : ""),
          },
          {
            label: "OS",
            value:
              userAgentInfo?.os +
              (userAgentInfo?.osVersion
                ? ` (${userAgentInfo?.osVersion})`
                : ""),
          },
          {
            label: "Device",
            value: userAgentInfo?.device ?? "Unknown",
          },
          {
            label: "Device Vendor",
            value: userAgentInfo?.deviceVendor ?? "Unknown",
          },
          {
            label: "Device Model",
            value: userAgentInfo?.deviceModel ?? "Unknown",
          },
        ].filter((item) => item.value && item.value !== "Unknown"),
      },
      {
        id: "location-locale",
        icon: GlobeIcon,
        title: "Location & Locale",
        items: [
          {
            label: "Country",
            value: countryInfo?.name ?? "Unknown",
          },
          {
            label: "Time Zone",
            value: metadata.timeZone ?? "Unknown",
          },
          {
            label: "Language",
            value: metadata.language ?? "Unknown",
          },
          {
            label: "Languages",
            value: metadata.languages ?? "Unknown",
          },
        ].filter((item) => item.value && item.value !== "Unknown"),
      },
      {
        id: "screen-display",
        icon: SmartphoneIcon,
        title: "Screen & Display",
        items: [
          {
            label: "Screen Resolution",
            value: metadata.screenResolution ?? "Unknown",
          },
          {
            label: "Viewport Size",
            value: metadata.viewportSize ?? "Unknown",
          },
        ].filter((item) => item.value && item.value !== "Unknown"),
      },
      {
        id: "session-details",
        icon: LinkIcon,
        title: "Session Details",
        items: [
          {
            label: "Current URL",
            value: metadata.currentUrl ?? "Unknown",
          },
          {
            label: "Referrer",
            value: metadata.referrer ?? "Direct / None",
          },
          {
            label: "Cookies Enabled",
            value:
              metadata.cookieEnabled !== undefined
                ? metadata.cookieEnabled
                  ? "Yes"
                  : "No"
                : "Unknown",
          },
        ].filter((item) => item.value && item.value !== "Unknown"),
      },
    ];
  }, [contactSession?.metadata, userAgentInfo, countryInfo]);

  if (contactSession === undefined || contactSession === null) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center gap-x-4">
          <AvatarWithBadge
            badgeImageUrl={
              countryInfo?.code
                ? `https://flagcdn.com/w40/${countryInfo?.code.toLowerCase()}.png`
                : undefined
            }
            seed={contactSession?._id}
            size={42}
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-x-2">
              <h4 className="line-clamp-1">{contactSession?.name}</h4>
            </div>
            <p className="line-clamp-1 truncate text-sm text-muted-foreground">
              {contactSession?.email}
            </p>
          </div>
        </div>
        <div>
          <Button asChild className="w-full size-lg">
            <Link href={`mailto:${contactSession.email}`}>
              <MailIcon />
              <span>Send Email</span>
            </Link>
          </Button>
        </div>
      </div>
      <div>
        {contactSession?.metadata && (
          <Accordion
            className="w-full rounded-none border-y"
            type="single"
            collapsible
          >
            {accordionSections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="rounded-none border-none"
              >
                <AccordionTrigger className="flex items-center justify-between gap-x-2 px-4 py-2 hover:no-underline">
                  <div className="flex items-center gap-x-2">
                    <section.icon className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0">
                  <div className="flex flex-col gap-y-2 pt-2">
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-x-2"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="text-sm font-medium">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
