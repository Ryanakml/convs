import { IntegrationsView } from "@/modules/integrations/ui/views/integrations-view";
import { Protect } from "@clerk/nextjs";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";

const IntegrationsPage = () => {
  return (
    <div className="relative">
      <Protect condition={(has) => !has({ plan: "pro" })} fallback={null}>
        <PremiumFeatureOverlay />
      </Protect>
      <IntegrationsView />
    </div>
  );
};
export default IntegrationsPage;
