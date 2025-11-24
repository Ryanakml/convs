"use client";

import { use } from "react";
import { WidgetView } from "../modules/widgets/ui/views/widget-view";

interface Props {
  searchParams: Promise<{ organizationId: string }>;
}

const Page = ({ searchParams }: Props) => {
  const { organizationId } = use(searchParams);

  return (
    <div className="bg-background h-screen flex flex-col overflow-hidden">
      <WidgetView organizationId={organizationId} />
    </div>
  );
};

export default Page;
