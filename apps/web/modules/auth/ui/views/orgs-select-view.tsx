"use client";

import { OrganizationList } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export const OrgsSelectionView = () => {
  const params = useSearchParams();
  const redirectUrl = params.get("redirectUrl") || "/";
  return (
    <OrganizationList
      afterCreateOrganizationUrl={redirectUrl}
      afterSelectOrganizationUrl={redirectUrl}
      hidePersonal
      skipInvitationScreen
    />
  );
};
