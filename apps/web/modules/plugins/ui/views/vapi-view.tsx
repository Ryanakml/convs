"use client";

import {
  GlobeIcon,
  PhoneCallIcon,
  PhoneIcon,
  WorkflowIcon,
} from "lucide-react";
import { type FeatureCardProps, PluginCard } from "../components/plugin-card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { VapiConnectedView } from "../components/vapi-connected-view";

const vapiFeatures: FeatureCardProps[] = [
  {
    icon: GlobeIcon,
    lable: "Web Voice Calls",
    description: "Voice chat directly through your web browser.",
  },
  {
    icon: PhoneIcon,
    lable: "Phone Numbers",
    description: "Use Vapi on your phone, tablet, and computer seamlessly.",
  },
  {
    icon: PhoneCallIcon,
    lable: "Call Forwarding",
    description: "Forward calls to any device you choose.",
  },
  {
    icon: WorkflowIcon,
    lable: "Workflows",
    description: "Automate tasks and create custom call workflows.",
  },
];

const formSchema = z.object({
  publicApiKey: z.string().min(1, "Public API Key is required"),
  privateApiKey: z.string().min(1, "Private API Key is required"),
});

const VapiDisconnectDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const removePlugin = useMutation(api.private.plugins.remove);

  const onSubmit = async () => {
    try {
      await removePlugin({
        service: "vapi",
      });
      setOpen(false);
      toast.success("Vapi plugin removed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove Vapi plugin. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Disconnect Vapi Plugin</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to disconnect the Vapi plugin?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onSubmit}>
            Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const VapiConnectForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const removePlugins = useMutation(api.private.secrets.upsert);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicApiKey: "",
      privateApiKey: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await removePlugins({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      });
      setOpen(false);
      toast.success("Vapi plugin connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect Vapi plugin. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect Vapi Plugin</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Your api key are safely stored and encrypted using AWS Secrets Manager
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Public API Key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your Vapi Public API Key"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <Label>Private API Key</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your Vapi Private API Key"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const toggleConnection = () => {
    if (vapiPlugin) {
      setRemoveOpen(true);
    } else {
      setConnectOpen(true);
    }
  };

  return (
    <>
      <VapiConnectForm open={connectOpen} setOpen={setConnectOpen} />
      <VapiDisconnectDialog open={removeOpen} setOpen={setRemoveOpen} />
      <div className="flex flex-col bg-muted p-8 min-h-screen">
        <div className="mx-auto max-w-screen-md w-full">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect your Vapi account to enable AI-powered interactions with
              your data.
            </p>
          </div>
          <div className="mt-8">
            {vapiPlugin ? (
              <VapiConnectedView onDisconnect={toggleConnection} />
            ) : (
              <PluginCard
                serviceImage="/logo.png"
                serviceName="vapi"
                features={vapiFeatures}
                isDisabled={vapiPlugin === undefined}
                onSubmit={toggleConnection}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
