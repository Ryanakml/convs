"use client";

import { use } from "react";
import { WidgetFooter } from "@/modules/widgets/ui/components/widget-footer";
import { WidgetHeader } from "@/modules/widgets/ui/components/widget-header";
import { WidgetView } from "../modules/widgets/ui/views/widget-view";

interface Props {
  searchParams: Promise<{
    organizationId: string;
  }>;
}

export default function Page({ searchParams }: Props) {
  const { organizationId } = use(searchParams);

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 lg:px-8">
        <WidgetHeader organizationId={organizationId} />
        <WidgetView organizationId={organizationId} />
        <WidgetFooter />
      </div>
    </div>
  );
}
