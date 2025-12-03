"use client";

import { BotIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiAssistant } from "../../hooks/use-vapi-data";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

export const VapiAssistantsTab = () => {
  const { data: assistants, isLoading } = useVapiAssistant();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Assistant</TableHead>
            <TableHead className="px-6 py-4">Model</TableHead>
            <TableHead className="px-6 py-4">First Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-6 py-4 text-center text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Loading Assistant...
                  </TableCell>
                </TableRow>
              );
            } else if (assistants?.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No assistant configured.
                  </TableCell>
                </TableRow>
              );
            }

            return assistants?.map((assistant) => (
              <TableRow
                key={assistant.id}
                onClick={() =>
                  setExpandedId(
                    expandedId === assistant.id ? null : assistant.id
                  )
                }
                className={cn(
                  "cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all",
                  expandedId === assistant.id && "bg-accent/30"
                )}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BotIcon className="text-muted-foreground" />
                    <span className="font-mono">
                      {assistant.name || "Unnamed Assistant"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm">
                    {assistant.model?.model || "Not Configured"}
                  </span>
                </TableCell>
                <TableCell
                  className={cn(
                    "px-6 py-4",
                    expandedId === assistant.id
                      ? "max-w-full whitespace-normal"
                      : "max-w-xs whitespace-nowrap overflow-hidden text-ellipsis"
                  )}
                >
                  <span className="text-sm">
                    {assistant.firstMessage || "No greeting configured"}
                  </span>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
