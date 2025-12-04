"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import {
  BotIcon,
  MicIcon,
  PhoneIcon,
  BookIcon,
  UsersIcon,
  PaletteIcon,
  GemIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

export const PremiumFeatureOverlay = ({
  className,
}: {
  className?: string;
}) => {
  const features = [
    {
      icon: BotIcon,
      title: "AI Customer Support",
      description: "Intelligent automated responses 24/7",
    },
    {
      icon: MicIcon,
      title: "AI Voice Agent",
      description: "Natural voice conversations with customers",
    },
    {
      icon: PhoneIcon,
      title: "Phone System",
      description: "Inbound & outbound calling capabilities",
    },
    {
      icon: BookIcon,
      title: "Knowledge Base",
      description: "Train AI on your documentation",
    },
    {
      icon: UsersIcon,
      title: "Team Access",
      description: "Up to 5 operators per organization",
    },
    {
      icon: PaletteIcon,
      title: "Widget Customization",
      description: "Customize your chat widget appearance",
    },
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-background/80 p-4 backdrop-blur-sm",
        className
      )}
    >
      <Card className="w-full max-w-md border-none shadow-2xl bg-card/90">
        <CardHeader className="flex flex-col items-center text-center space-y-2 pb-6">
          <div className="rounded-full bg-primary/10 p-3 mb-2">
            <GemIcon className="size-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Premium Feature</h2>
          <p className="text-sm text-muted-foreground">
            This feature requires a Pro subscription
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <feature.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {feature.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/billing">View Plans</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
