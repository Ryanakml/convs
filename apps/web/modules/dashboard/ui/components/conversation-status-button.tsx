import { type ComponentType } from "react";
import { Hint } from "@workspace/ui/components/hint";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";

type Status = Doc<"conversations">["status"];

const statusConfig: Record<
  Status,
  {
    label: string;
    icon: ComponentType<{ className?: string }>;
    hint: string;
    className: string;
  }
> = {
  unresolved: {
    label: "Unresolved",
    icon: ArrowRightIcon,
    hint: "Mark conversation as unresolved",
    className:
      "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800",
  },
  escalated: {
    label: "Escalated",
    icon: ArrowUpIcon,
    hint: "Mark conversation as escalated to a human",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800",
  },
  resolved: {
    label: "Resolved",
    icon: CheckIcon,
    hint: "Mark conversation as resolved",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800",
  },
};

export const ConversataionStatusButton = ({
  status,
  onChange,
  isLoading = false,
}: {
  status: Status;
  onChange: (status: Status) => void;
  isLoading?: boolean;
}) => {
  const current = statusConfig[status];

  return (
    <Hint text={current.hint}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className={cn("gap-2 border", current.className)}
            disabled={isLoading}
          >
            <current.icon className="size-4" />
            {current.label}
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.keys(statusConfig) as Status[]).map((value) => {
            const option = statusConfig[value];
            const isActive = value === status;
            return (
              <DropdownMenuItem
                key={value}
                className={cn("gap-2", isActive && option.className)}
                onSelect={() => onChange(value)}
                disabled={isLoading}
              >
                <option.icon className="size-4" />
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </Hint>
  );
};
