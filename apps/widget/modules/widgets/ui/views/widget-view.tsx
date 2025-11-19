"use client";

import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="flex flex-col flex-1 gap-4 px-4 py-6">
      <WidgetHeader>
        <div className="flex flex-col gap-y-2">
          <p className="text-3xl font-semibold">
            Hi there! Your organization ID is:
          </p>
          <p className="text-lg text-muted-foreground">{organizationId}</p>
        </div>
      </WidgetHeader>

      <div className="flex-1 rounded-2xl border bg-card p-4">
        Widget View: {organizationId}
      </div>

      <WidgetFooter />
    </main>
  );
};
