import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ArrowUpRight, Radio, ShieldCheck } from "lucide-react";

interface Props {
  organizationId: string;
}

export const WidgetHeader = ({ organizationId }: Props) => {
  const maskedId = organizationId
    ? `ORG-${organizationId.slice(0, 4).toUpperCase()}`
    : "ORG-XXXX";

  return (
    <header className="relative overflow-hidden rounded-3xl border bg-card px-6 py-8 shadow-sm sm:px-8">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-primary/10 via-transparent to-transparent sm:block"
        aria-hidden
      />
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <Badge className="border-transparent bg-primary/15 text-xs text-primary">
              <Radio className="size-3" />
              Live briefing
            </Badge>
            <span className="font-mono text-muted-foreground/80">{maskedId}</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Experience Console
            </h1>
            <p className="text-base text-muted-foreground sm:max-w-2xl">
              Monitor sentiment, automate responses, and highlight the next best
              action for every touch point inside your widget experience.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="border-dashed border-primary/40">
              Voice ready
            </Badge>
            <Badge variant="outline" className="border-dashed border-muted-foreground/30">
              Response SLA &lt; 4m
            </Badge>
            <Badge variant="outline" className="border-dashed border-muted-foreground/30">
              Secure relay
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="gap-2">
              Launch workspace
              <ArrowUpRight className="size-4" />
            </Button>
            <Button size="sm" variant="outline">
              Share preview
            </Button>
          </div>
        </div>
        <div className="grid gap-4 rounded-2xl border border-dashed border-primary/20 bg-muted/40 p-4 sm:grid-cols-3">
          {[
            { label: "Pipeline health", value: "92%", helper: "+6% this week" },
            { label: "Avg. satisfaction", value: "4.8 / 5", helper: "Voice + chat" },
            { label: "Automation coverage", value: "73%", helper: "Across 18 flows" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <p className="text-2xl font-semibold">{item.value}</p>
              <p className="text-xs text-emerald-500">{item.helper}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-500" />
          AI-assisted monitoring, sentiment guardrails, and granular audit logs
          keep every touch point on-brand.
        </div>
      </div>
    </header>
  );
};
