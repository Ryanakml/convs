import {
  ArrowLeftIcon,
  ArrowLeftRightIcon,
  type LucideIcon,
  Plug,
  PlugIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";

export interface FeatureCardProps {
  icon: LucideIcon;
  lable: string;
  description: string;
}

interface PluginCardProps {
  isDisabled?: boolean;
  serviceName: string;
  serviceImage: string;
  features: FeatureCardProps[];
  onSubmit: () => void;
}

export const PluginCard = ({
  isDisabled = false,
  serviceName,
  serviceImage,
  features,
  onSubmit,
}: PluginCardProps) => {
  return (
    <div className="h-fit w-full rounded-lg border bg-background p-8">
      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <Image
            alt={serviceName}
            className="rounded object-contain"
            height={40}
            width={40}
            src={"/vapi.svg"}
          />
        </div>
        <div className="flex flex-col items-center gap-1 ">
          <ArrowLeftRightIcon className="inline-block mr-2" size={16} />
        </div>
        <div className="flex flex-col items-center">
          <Image
            alt="Platform"
            className="rounded object-contain"
            height={40}
            width={40}
            src={serviceImage}
          />
        </div>
      </div>

      <div className="mb-6 text-center">
        <p className="text-lg">
          <span>Connect your {serviceName} account</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="space-y-4">
          {features.map((feature) => (
            <div className="flex items-start gap-3" key={feature.lable}>
              <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                <feature.icon className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">
                  {feature.lable}
                </p>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Button
          disabled={isDisabled}
          onClick={onSubmit}
          className="w-full"
          variant={"default"}
        >
          {isDisabled ? (
            "Connected"
          ) : (
            <div className="flex items-center gap-2">
              Connect
              <Plug />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
