"use client";

import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="flex flex-col flex-1 gap-4 px-4 py-6">
      <WidgetAuthScreen />
      {/* <div className="flex-1 rounded-2xl border bg-card p-4">
        Widget View: {organizationId}
      </div> */}

      {/* <WidgetFooter /> */}
    </main>
  );
};
