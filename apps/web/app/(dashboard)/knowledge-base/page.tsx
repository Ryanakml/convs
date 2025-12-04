import { Protect } from "@clerk/nextjs";

import { FilesView } from "@/modules/files/ui/views/files-view";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const page = () => {
  return (
    <div className="relative">
      <Protect condition={(has) => !has({ plan: "pro" })} fallback={null}>
        <PremiumFeatureOverlay />
      </Protect>
      <FilesView />
    </div>
  );
};

export default page;
