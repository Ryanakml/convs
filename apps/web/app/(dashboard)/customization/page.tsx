import React from "react";
import { CustomizationView } from "@/modules/customization/ui/customization-view";
import { Protect } from "@clerk/nextjs";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const CustomizationPage = () => {
  return (
    <div className="relative">
      <Protect condition={(has) => !has({ plan: "pro" })} fallback={null}>
        <PremiumFeatureOverlay />
      </Protect>
      <CustomizationView />
    </div>
  );
};

export default CustomizationPage;
