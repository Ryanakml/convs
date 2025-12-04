"use client";

import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Check, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@workspace/ui/components/separator";
import { IntegrationId, INTEGRATIONS } from "../../constant";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { createScript } from "../../utils";

export const IntegrationsView = () => {
  const { organization } = useOrganization();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<string>("");

  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) {
      toast.error("Organization not found");
      return;
    }

    const snippet = createScript(integrationId, organization.id);
    setSelectedSnippet(snippet);
    setDialogOpen(true);
  };

  const [isCopied, setIsCopied] = useState(false);

  const copyOrganizationId = () => {
    try {
      navigator.clipboard.writeText(organization?.id || "");
      toast.success("Organization ID copied to clipboard");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy Organization ID. Please try again.");
    }
  };

  return (
    <>
      <IntegrationsDialog
        onOpenChange={setDialogOpen}
        open={dialogOpen}
        snippet={selectedSnippet}
      />
      <div className="flex flex-col bg-muted p-8 min-h-screen">
        <div className="mx-auto max-w-screen-md w-full">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Setup & Integrations</h1>
            <p className="text-muted-foreground">
              Choose integrations that fit to your project development.
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <Label className="w-34" htmlFor="organization-id">
                Organization ID
              </Label>
              <Input
                className="flex-1 bg-background font-mono text-sm"
                id="organization-id"
                disabled
                value={organization?.id}
              />
              <Button variant="outline" onClick={copyOrganizationId}>
                {isCopied ? (
                  <Check className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />
          <div className="space-y-6">
            <div className="space-y-1">
              <Label className="text-lg font-medium">Integrations</Label>
              <p className="text-muted-foreground text-sm">
                Add the following scripts to your project development to enable
                the chatbots.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <button
                  className="flex items-center gap-4 rounded-lg border bg-background p-4 hover:bg-accent"
                  key={integration.id}
                  onClick={() => handleIntegrationClick(integration.id)}
                  type="button"
                >
                  <Image
                    alt={integration.title}
                    height={32}
                    width={32}
                    src={integration.icon}
                  />
                  <p>{integration.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const IntegrationsDialog = ({
  open,
  onOpenChange,
  snippet,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copySnippet = () => {
    try {
      navigator.clipboard.writeText(snippet);
      toast.success("Snippet copied to clipboard");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy snippet. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Integrate to your website</DialogTitle>
          <DialogDescription>
            Add the following scripts to your project to enable the chatbots.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="rounded-md bg-muted p-2 text-sm font-medium">
              1. Copy the code below
            </div>

            <div className="relative rounded-md bg-slate-950 p-4">
              <code className="block whitespace-pre-wrap break-all font-mono text-sm text-slate-50">
                {snippet}
              </code>

              <Button
                className="absolute right-2 top-2 size-8 bg-slate-800 hover:bg-slate-700 text-white"
                onClick={copySnippet}
                variant="ghost"
                size="icon"
              >
                {isCopied ? (
                  <Check className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-md bg-muted p-2 text-sm font-medium">
              2. Add the code in your page
            </div>
            <p className="text-sm text-muted-foreground px-1">
              Paste the chatbot code above in your page. You can add it at the
              html head section.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
