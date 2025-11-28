"use client";

import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { usePaginatedQuery } from "convex/react";
import {
  ListIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { AvatarWithBadge } from "@workspace/ui/components/dicebear-avatar";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtomValue, useSetAtom } from "jotai";
import { statusFilterAtom } from "../../atoms";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const ConversationsLayouts = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    { status: statusFilter === "all" ? undefined : statusFilter },
    { initialNumItems: 10 }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
  });
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full flex-1">
      <ResizablePanel defaultSize={30} minSize={10} maxSize={30}>
        {/* Conversation Panel */}
        <div className="flex flex-col h-full w-full text-sidebar-foreground bg-background">
          {/* Filter */}
          <div className="flex flex-col gap-3.5 border-b p-2">
            <Select
              defaultValue="all"
              onValueChange={(value) =>
                setStatusFilter(
                  value as "unresolved" | "escalated" | "resolved" | "all"
                )
              }
              value={statusFilter}
            >
              <SelectTrigger className="h-8 border-none px-1 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground">
                <SelectValue placeholder="filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <ListIcon className="size-4" />
                    <span className="ml-2">All Conversations</span>
                  </div>
                </SelectItem>
                <SelectItem value="unresolved">
                  <div className="flex items-center gap-2">
                    <ListIcon className="size-4" />
                    <span className="ml-2">Unresolved</span>
                  </div>
                </SelectItem>
                <SelectItem value="escalated">
                  <div className="flex items-center gap-2">
                    <ListIcon className="size-4" />
                    <span className="ml-2">Escalated</span>
                  </div>
                </SelectItem>
                <SelectItem value="resolved">
                  <div className="flex items-center gap-2">
                    <ListIcon className="size-4" />
                    <span className="ml-2">Resolved</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Conversation List */}
          {isLoadingFirstPage ? (
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
              {/* Skeleton Conversation */}
              <div className="relative flex flex-col w-full p-2 min-w-0">
                <div className="w-full space-y-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg p-4"
                    >
                      <Skeleton className="w-10 h-10 shrink-0 rounded-full" />
                      <div className="min-w-10 flex-1">
                        <div className="flex w-full items-center gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="ml-auto h-3 w-12 shrink-0" />
                        </div>
                        <div className="mt-2 ">
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-53px)]">
              <div className="flex flex-col w-full flex-1 text-sm">
                {conversations.results.map((conversation) => {
                  const isLastMessageFromOperator =
                    conversation.lastMessage?.message?.role !== "user";

                  const country = getCountryFromTimezone(
                    conversation.contactSession.metadata?.timeZone ?? ""
                  );

                  const countryFlagUrl = country?.code
                    ? getCountryFlagUrl(country.code)
                    : "/logo.png";

                  return (
                    <Link
                      key={conversation._id}
                      className={cn(
                        "relative flex cursor-pointer items-start gap-3 border-p p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                        pathname === `/conversations/${conversation._id}` &&
                          "text-sm text-accent-foreground"
                      )}
                      href={`/conversations/${conversation._id}`}
                    >
                      <div
                        className={cn(
                          "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                          pathname === `/conversations/${conversation._id}` &&
                            "opacity-50"
                        )}
                      />
                      <AvatarWithBadge
                        seed={conversation.contactSession._id || "Unknown User"}
                        badgeImageUrl={countryFlagUrl}
                        size={30}
                        className="shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex w-full items-center gap-2">
                          <span className="truncate font-bold">
                            {conversation.contactSession.name || "Unnamed"}
                          </span>
                          <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                            {formatDistanceToNow(conversation._creationTime)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <div className="flex grow w-0 items-center gap-1">
                            {isLastMessageFromOperator && (
                              <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                            )}
                            <span
                              className={cn(
                                "line-clamp-1 text-muted-foreground text-xs",
                                !isLastMessageFromOperator &&
                                  "font-bold text-black"
                              )}
                            >
                              {conversation.lastMessage?.text ||
                                "No messages yet"}
                            </span>
                          </div>
                          <ConversationStatusIcon
                            status={conversation.status}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
                <InfiniteScrollTrigger
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  ref={topElementRef}
                />
              </div>
            </ScrollArea>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle className="w-1 bg-gray-200 dark:bg-gray-700" />
      <ResizablePanel className="h-full" defaultSize={70}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
