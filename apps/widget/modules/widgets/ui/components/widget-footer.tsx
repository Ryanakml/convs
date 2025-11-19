import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Headphones, HelpCircle, MessageSquare, ShieldCheck } from "lucide-react";

export const WidgetFooter = () => {
  return (
    <footer className="rounded-3xl border bg-card px-6 py-6 shadow-sm sm:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Need an extra pair of hands?
          </p>
          <p className="text-sm text-muted-foreground">
            Our success team can co-pilot complex moments or review your automation map
            within minutes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="gap-2">
            <Headphones className="size-4" />
            Talk to a specialist
          </Button>
          <Button size="sm" variant="outline">
            Schedule audit
          </Button>
        </div>
      </div>
      <Separator className="my-5" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            AES-256 encryption
          </span>
          <Badge variant="outline" className="border-dashed border-primary/40">
            99.9% uptime
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 rounded-full px-3 text-foreground hover:bg-muted"
          >
            <MessageSquare className="size-4" />
            Updates
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 rounded-full px-3 text-foreground hover:bg-muted"
          >
            <HelpCircle className="size-4" />
            Docs
          </Button>
        </div>
      </div>
    </footer>
  );
};
