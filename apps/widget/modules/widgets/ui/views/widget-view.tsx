import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import {
  AlertTriangle,
  ArrowUpRight,
  PhoneCall,
  Sparkles,
  Waves,
} from "lucide-react";
import React from "react";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const stats = [
    { label: "Active campaigns", value: "8", helper: "+2 this week" },
    { label: "Avg. resolution", value: "03m 42s", helper: "Live + async" },
    { label: "Positive sentiment", value: "87%", helper: "Goal ≥ 80%" },
    { label: "Automation share", value: "61%", helper: "18 queued handoffs" },
  ];

  const timeline = [
    {
      title: "Onboarding orchestrator",
      description: "32 workflows deployed after signup spikes.",
      time: "10:24 AM",
      badge: "Automation",
      tone: "positive",
      icon: Sparkles,
    },
    {
      title: "Voice concierge routing",
      description: "Inbound wait time steady at 38s, concierge stable.",
      time: "09:55 AM",
      badge: "Voice",
      tone: "informational",
      icon: PhoneCall,
    },
    {
      title: "Inbox review needed",
      description: "8 priority threads waiting for a human check.",
      time: "09:32 AM",
      badge: "Signal",
      tone: "alert",
      icon: AlertTriangle,
    },
  ];

  const teamFocus = [
    { name: "Aria Chen", role: "Lifecycle lead", load: 68, initials: "AC" },
    { name: "Seth Nguyen", role: "Voice concierge", load: 54, initials: "SN" },
    { name: "Lena Ortiz", role: "Escalations", load: 82, initials: "LO" },
  ];

  const quickActions = [
    {
      title: "Re-run guardrails",
      description: "Verify tone + compliance for this week's prompts.",
      cta: "Review report",
    },
    {
      title: "Balance touchpoints",
      description: "Shift low-signal cohorts back to automation.",
      cta: "Adjust routing",
    },
  ];

  const toneStyles: Record<
    (typeof timeline)[number]["tone"],
    { badge: string; text: string }
  > = {
    positive: {
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
      text: "text-emerald-600 dark:text-emerald-300",
    },
    informational: {
      badge: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
      text: "text-sky-600 dark:text-sky-300",
    },
    alert: {
      badge: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
      text: "text-rose-600 dark:text-rose-300",
    },
  };

  const shortId = organizationId
    ? organizationId.slice(-4).toUpperCase()
    : "0000";

  return (
    <section className="space-y-6">
      <Card className="border-dashed border-primary/20 bg-muted/20">
        <CardHeader className="gap-2 pb-0">
          <div className="space-y-1">
            <CardTitle>Engagement snapshot</CardTitle>
            <CardDescription>
              Fresh signals for workspace #{shortId}
            </CardDescription>
          </div>
          <CardAction>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Synced 1 min ago
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-muted/60 bg-card/90 p-4 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.helper}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="h-full">
          <CardHeader className="gap-4">
            <div className="space-y-1">
              <CardTitle>Live pulse</CardTitle>
              <CardDescription>
                The conversations that deserve attention next.
              </CardDescription>
            </div>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-foreground hover:text-foreground"
              >
                Review logs
                <ArrowUpRight className="size-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-5">
            {timeline.map((item) => {
              const Icon = item.icon;
              const tone = toneStyles[item.tone];

              return (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl border border-muted/60 px-4 py-3 sm:flex-row sm:items-start sm:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 p-2 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 text-sm">
                    <Badge className={cn("border-transparent", tone!.badge)}>
                      {item.badge}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {item.time}
                      </p>
                      <p className={cn("text-xs font-medium", tone!.text)}>
                        {item.tone === "positive"
                          ? "All systems go"
                          : item.tone === "informational"
                            ? "Monitor quietly"
                            : "Needs review"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="rounded-2xl border border-dashed border-muted-foreground/30 px-4 py-3"
                >
                  <p className="text-sm font-semibold">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 gap-1 px-0 text-primary hover:text-primary"
                  >
                    {action.cta}
                    <ArrowUpRight className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Team focus</CardTitle>
            <CardDescription>
              Coverage and load before the next checkpoint.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {teamFocus.map((person) => (
              <div
                key={person.name}
                className="flex items-center gap-3 rounded-2xl border border-muted/50 px-3 py-2"
              >
                <Avatar className="bg-muted">
                  <AvatarFallback className="text-xs font-semibold">
                    {person.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.role}</p>
                </div>
                <div className="w-24">
                  <p className="text-xs font-semibold text-right">
                    {person.load}%
                  </p>
                  <Progress value={person.load} className="mt-2 h-1.5" />
                </div>
              </div>
            ))}
            <Separator />
            <div className="space-y-2 text-sm">
              <p className="font-medium">Escalation coverage</p>
              <p className="text-muted-foreground">
                4 / 12 open threads assigned, SLA holding steady.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Waves className="size-4 text-primary" />
                Voice concierge shifts to async mode in 45 minutes.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
