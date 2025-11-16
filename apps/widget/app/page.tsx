"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const users = useQuery(api.users.getUser);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">WIDGET APPS</h1>
        <p>{`user: ${JSON.stringify(users)}`}</p>
      </div>
    </div>
  );
}
