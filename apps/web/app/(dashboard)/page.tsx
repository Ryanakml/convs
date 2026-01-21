"use client";

import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const addUser = useMutation(api.users.addUser);
  return (
    <>
      <div className="flex items-center justify-center min-h-svh">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">WEB APPS</h1>
          <Button
            onClick={async () => {
              try {
                await addUser({ name: "ryan" });
              } catch (error) {
                console.error("Failed to add user:", error);
              }
            }}
          >
            Add User Id
          </Button>
        </div>
      </div>
    </>
  );
}
