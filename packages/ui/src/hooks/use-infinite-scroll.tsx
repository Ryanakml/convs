import { useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollProps {
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMore: (number: number) => void;
  loadSize?: number;
  observerEnabled?: boolean;
}

export const useInfiniteScroll = ({
  status,
  loadMore,
  loadSize = 20,
  observerEnabled = true,
}: UseInfiniteScrollProps) => {
  const topElementRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(loadSize);
    }
  }, [status, loadMore, loadSize]);

  useEffect(() => {
    const topElement = topElementRef.current;
    if (!topElement || !observerEnabled) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        threshold: 1,
      }
    );

    observer.observe(topElement);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, observerEnabled]);

  return {
    topElementRef,
    handleLoadMore,
    isLoadingMore: status === "LoadingMore",
    canLoadMore: status === "CanLoadMore",
    isLoadingFirstPage: status === "LoadingFirstPage",
    isExhausted: status === "Exhausted",
  };
};
