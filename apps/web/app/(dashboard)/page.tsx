"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const users = useQuery(api.users.getUser);
  const addUser = useMutation(api.users.addUser);
  return (
    <>
      <div className="flex items-center justify-center min-h-svh">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">WEB APPS</h1>
          <OrganizationSwitcher hidePersonal />
          <UserButton />
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
          <p>
            {users === undefined
              ? "Loading..."
              : `user: ${JSON.stringify(users)}`}
          </p>
        </div>
      </div>
    </>
  );
}
