"use client";

import { OrganizationList } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export const OrgsSelectionView = () => {
  const params = useSearchParams();

  const rawRedirectUrl = params.get("redirectUrl") || "/";

  // Only allow safe internal paths
  const redirectUrl =
    rawRedirectUrl.startsWith("/") && !rawRedirectUrl.startsWith("//")
      ? rawRedirectUrl
      : "/";

  return (
    <OrganizationList
      afterCreateOrganizationUrl={redirectUrl}
      afterSelectOrganizationUrl={redirectUrl}
      hidePersonal
      skipInvitationScreen
    />
  );
};
