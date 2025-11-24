import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    color: "text-green-500",
    label: "Resolved",
  },
  escalated: {
    icon: ArrowUpIcon,
    color: "text-yellow-500",
    label: "Escalated",
  },
  unresolved: {
    icon: ArrowRightIcon,
    color: "text-blue-500",
    label: "Unresolved",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const { icon: Icon, color, label } = statusConfig[status];

  return (
    <div className="flex items-center gap-x-1">
      <Icon className={cn("size-4", color)} aria-label={label} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
