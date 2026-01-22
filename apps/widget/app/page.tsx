"use client";

import { use, useEffect } from "react";
import { WidgetView } from "../modules/widgets/ui/views/widget-view";

interface Props {
  searchParams: Promise<{ organizationId: string; prefetch?: string }>;
}

const Page = ({ searchParams }: Props) => {
  const { organizationId, prefetch } = use(searchParams);

  // Handle prefetch mode - send signal when authentication is complete
  useEffect(() => {
    if (prefetch === "true" && window.parent !== window) {
      // This is a prefetch iframe, listen for auth completion
      const handlePrefetchComplete = () => {
        window.parent.postMessage({ type: "prefetch_complete" }, "*");
      };

      // Send signal after a short delay to ensure state is ready
      const timer = setTimeout(handlePrefetchComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [prefetch]);

  return (
    <div className="bg-background h-screen flex flex-col overflow-hidden">
      <WidgetView organizationId={organizationId} />
    </div>
  );
};

export default Page;
