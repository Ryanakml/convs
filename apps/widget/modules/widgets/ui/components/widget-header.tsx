import { cn } from "@workspace/ui/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const WidgetHeader = ({ children, className }: Props) => {
  return (
    <header
      className={cn(
        "rounded-3xl border bg-card px-6 py-6 shadow-sm",
        className
      )}
    >
      {children}
    </header>
  );
};
 