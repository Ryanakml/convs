import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { WidgetHeader } from "../components/widget-header";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import {
  contactSessionIdFamily,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Email is invalid."),
});

export const WidgetAuthScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdFamily(organizationId || ""),
  );
  const [isSkipping, setIsSkipping] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(api.public.contactSession.create);
  const createAnonymousSession = useMutation(
    api.public.contactSession.createAnonymous,
  );

  // Helper to collect metadata
  const getMetadata = () => ({
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages.join(", "),
    platform: navigator.platform,
    vendor: navigator.vendor,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneOffset: new Date().getTimezoneOffset(),
    cookieEnabled: navigator.cookieEnabled,
    referrer: document.referrer || "direct",
    currentUrl: window.location.href,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organizationId) {
      return;
    }

    const metadata: Doc<"contactSessions">["metadata"] = getMetadata();

    const contactSessionId = await createContactSession({
      name: values.name,
      email: values.email,
      organizationId,
      metadata,
    });

    setContactSessionId(contactSessionId);
    setScreen("selection");
  };

  const handleSkip = async () => {
    if (!organizationId) {
      return;
    }

    setIsSkipping(true);
    try {
      const newSessionId = await createAnonymousSession({
        organizationId,
        metadata: getMetadata(),
      });
      setContactSessionId(newSessionId);
      setScreen("selection");
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <main className="flex flex-col flex-1 gap-4 px-4 py-6">
      <WidgetHeader>
        <div className="flex flex-col gap-y-2">
          <p className="text-3xl font-semibold">Hi there!</p>
          <p className="text-lg text-muted-foreground">Lets get you started</p>
        </div>
      </WidgetHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 gap-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="e.g John Doe" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="e.g john.doe@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting || isSkipping}
            type="submit"
            size={"lg"}
          >
            Continue
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={handleSkip}
        disabled={isSkipping || form.formState.isSubmitting}
      >
        Continue as Guest
      </Button>
    </main>
  );
};
