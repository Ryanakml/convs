"use client";

import { BotIcon, SettingsIcon, PhoneIcon, UnplugIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { VapiPhoneNumbersTab } from "./vapi-phone-numbers-tab";
import { VapiAssistantsTab } from "./vapi-assistants-tab";

interface VapiConnectedViewProps {
  onDisconnect: () => void;
}

export const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
  const [activeTab, setActiveTab] = useState("phone-numbers");
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                alt="Vapi Logo"
                className="rounded-lg object-contain"
                height={48}
                width={48}
                src={"/vapi.svg"}
              />
              <div>
                <CardTitle>Vapi Integration</CardTitle>
                <CardDescription>
                  Manage your phone numbers and ai assistants
                </CardDescription>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDisconnect}
              className="flex items-center gap-2"
            >
              <UnplugIcon size={16} />
              Disconnect
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg border bg-muted flex size-12 items-center justify-center">
                <SettingsIcon className="text-muted-foreground size-6" />
              </div>
              <div>
                <CardTitle>Widget Configuration</CardTitle>
                <CardDescription>
                  Manage your Vapi plugin settings and configurations.
                </CardDescription>
              </div>
            </div>
            <Button asChild>
              <Link href="/customization">
                <SettingsIcon className="mr-2 size-4" />
                Configure
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="overflow-hidden rounded-lg border bg-backround">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="phone-numbers"
          className="gap-0"
        >
          <TabsList className="grid h-12 w-full grid-cols-2 p-0">
            <TabsTrigger value="phone-numbers" className="h-full rounded-none">
              <PhoneIcon className="mr-2 size-4" />
              Phone Numbers
            </TabsTrigger>
            <TabsTrigger value="ai-assistants" className="h-full rounded-none">
              <BotIcon className="mr-2 size-4" />
              AI Assistants
            </TabsTrigger>
          </TabsList>
          <TabsContent value="phone-numbers" className="p-6">
            {/* Phone Numbers Content */}
            <VapiPhoneNumbersTab />
          </TabsContent>
          <TabsContent value="ai-assistants" className="p-6">
            {/* AI Assistants Content */}
            <VapiAssistantsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
