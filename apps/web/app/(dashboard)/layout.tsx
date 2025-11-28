import React from "react";
import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
