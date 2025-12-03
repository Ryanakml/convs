"use client";

import { CheckCircleIcon, PhoneIcon, XCircleIcon } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useVapiPhoneNumber } from "../../hooks/use-vapi-data";

export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumber, isLoading } = useVapiPhoneNumber();

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Phone Number</TableHead>
            <TableHead className="px-6 py-4">Type</TableHead>
            <TableHead className="px-6 py-4">Status</TableHead>
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
                    Loading Phone Numbers...
                  </TableCell>
                </TableRow>
              );
            } else if (phoneNumber?.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-6 py-4 text-center text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    No phone numbers configured.
                  </TableCell>
                </TableRow>
              );
            }

            return phoneNumber?.map((phone) => (
              <TableRow
                key={phone.id}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="text-muted-foreground" />
                    <span className="font-mono">
                      {phone.number || "Not Configured"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-mono">{phone.name || "Unnamed"}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    className="capitalize"
                    variant={
                      phone.status === "active" ? "default" : "destructive"
                    }
                  >
                    {phone.status === "active" && (
                      <CheckCircleIcon className="mr-1 size-3" />
                    )}
                    {phone.status !== "active" && (
                      <XCircleIcon className="mr-1 size-3" />
                    )}
                    {phone.status || "Unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
