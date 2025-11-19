import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Home, Inbox } from "lucide-react";

export const WidgetFooter = () => {
  const screen = "selection";
  return (
    <footer className="rounded-3xl border bg-card p-4 shadow-sm flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="h-14 rounded-none flex-1"
      >
        <Home
          className={cn("size-5", screen === "selection" && "text-primary")}
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {}}
        className="h-14 rounded-none flex-1"
      >
        <Inbox className={cn("size-5", screen === "ibox" && "text-primary")} />
      </Button>
    </footer>
  );
};
