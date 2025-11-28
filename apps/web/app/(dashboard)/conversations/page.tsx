import { ConversationsView } from "@/modules/dashboard/ui/view/conversations-view";
import React from "react";

const ConversationsPage = () => {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <ConversationsView />
      </div>
    </div>
  );
};
export default ConversationsPage;
