import { VapiView } from "@/modules/plugins/ui/views/vapi-view";
import { Protect } from "@clerk/nextjs";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import React from "react";

const VapiPage = () => {
  return (
    <div className="relative">
      <Protect condition={(has) => !has({ plan: "pro" })} fallback={null}>
        <PremiumFeatureOverlay />
      </Protect>
      <VapiView />
    </div>
  );
};

export default VapiPage;
