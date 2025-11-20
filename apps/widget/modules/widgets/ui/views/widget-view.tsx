"use client";

import { useAtomValue } from "jotai";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <div>Selection Screen</div>,
    voice: <div>Voice Screen</div>,
    auth: <WidgetAuthScreen />,
    inbox: <div>Inbox Screen</div>,
    chat: <div>Chat Screen</div>,
    contact: <div>Contact Screen</div>,
  };

  return (
    <main className="flex flex-col flex-1 gap-4 px-4 py-6">
      {screenComponents[screen]}
      {/* <div className="flex-1 rounded-2xl border bg-card p-4">
        Widget View: {organizationId}
      </div> */}

      {/* <WidgetFooter /> */}
    </main>
  );
};
