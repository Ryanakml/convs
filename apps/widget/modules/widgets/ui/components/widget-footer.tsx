import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAtom } from "jotai";
import { Home, Inbox } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";

export const WidgetFooter = () => {
  const [screen, setScreen] = useAtom(screenAtom);

  return (
    <footer className="rounded-3xl border bg-card p-4 shadow-sm flex items-center justify-between gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setScreen("selection");
        }}
        className="h-14 rounded-none flex-1"
      >
        <Home
          className={cn("size-5", screen === "selection" && "text-primary")}
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setScreen("inbox");
        }}
        className="h-14 rounded-none flex-1"
      >
        <Inbox className={cn("size-5", screen === "inbox" && "text-primary")} />
      </Button>
    </footer>
  );
};
