"use client";

import { PricingTable } from "../components/pricing-table";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export const BillingView = () => {
  // const subscription = useQuery(api.private.subscriptions.get);

  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Plans and Billing</h1>
          <p className="text-muted-foreground">
            Choose the plan that works best for you and your team.
          </p>
        </div>
        <div className="mt-8">
          <PricingTable />
        </div>
      </div>
      {/* <PricingTable
        currentPlan={subscription?.plan ?? "free"}
        isLoading={subscription === undefined}
      /> */}
    </div>
  );
};
