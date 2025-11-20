"use client";

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col gap-y-2">
          <p className="text-3xl font-semibold">Hi there!</p>
          <p className="text-lg text-muted-foreground">Lets get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4">
        <AlertTriangleIcon />
        <p className="text-sm">
          {errorMessage || "Invalid Configuration. Please contact support."}
        </p>
      </div>
    </>
  );
};
