import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  loadMoreText?: string;
  noMoreText?: string;
  onLoadMore: () => void;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const InfiniteScrollTrigger = ({
  canLoadMore,
  isLoadingMore,
  loadMoreText = "Load more",
  noMoreText = "No more items",
  onLoadMore,
  className,
  ref,
}: InfiniteScrollTriggerProps) => {
  let text = loadMoreText;

  if (isLoadingMore) {
    text = "Loading...";
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div className={cn("flex justify-center py-4", className)} ref={ref}>
      <Button
        size="sm"
        variant="ghost"
        onClick={onLoadMore}
        disabled={!canLoadMore || isLoadingMore}
      >
        {text}
      </Button>
    </div>
  );
};
