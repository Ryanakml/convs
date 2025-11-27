import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    color: "text-green-500",
  },
  escalated: {
    icon: ArrowUpIcon,
    color: "text-yellow-500",
  },
  unresolved: {
    icon: ArrowRightIcon,
    color: "text-red-500",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const { icon: Icon, color } = statusConfig[status];

  return (
    <div className="flex items-center gap-x-1">
      <Icon className={cn("size-4", color)} />
    </div>
  );
};
