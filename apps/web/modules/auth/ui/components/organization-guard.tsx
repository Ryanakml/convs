"use client";

import { useOrganization } from "@clerk/nextjs";
import { OrgsSelectionView } from "../views/orgs-select-view";

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <div>
        <OrgsSelectionView />
      </div>
    );
  }
  return <div>{children}</div>;
};
