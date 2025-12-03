import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { MessageSquareIcon } from "lucide-react";
import { VapiFormFields } from "./vapi-form-field";
import { FormSchema } from "../../type";
import { widgetSettingsSchema } from "../../schemas";

type WidgetSettings = Doc<"widgetSettings">;

interface customizationFormProps {
  initialData?: WidgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({
  initialData,
  hasVapiPlugin,
}: customizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || "Hi there, how can i help you today?",
      defaultSuggestion: {
        suggestion1: initialData?.defaultSuggestion.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestion.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestion.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      },
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      };

      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestion: values.defaultSuggestion,
        vapiSettings,
      });

      toast.success("Widget settings saved!");
    } catch (err) {
      console.log(err);
      toast.error("Error changes the settings!");
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquareIcon className="size-4 text-primary" />
              General Chat Settings
            </CardTitle>
            <CardDescription>
              Configure basic widget behavior and messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greetings Messages</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Wellcome message shown chat open"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    The first message customer see when they open the chat
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Default Suggestion</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Quick reply suggestions shown to customer to help guide the
                  conversation
                </p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSuggestion.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="e.g. How do i get started?"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSuggestion.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="e.g. What are your pricing plans?"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSuggestion.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="e.g. I need help with my account!"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquareIcon className="size-4 text-primary" />
                Voice Assistant Settings
              </CardTitle>
              <CardDescription>
                Configure voice calling features powered by Vapi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="hover:bg-accent hover:text-accent-foreground"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
