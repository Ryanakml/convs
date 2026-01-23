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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { MessageSquareIcon, PaletteIcon } from "lucide-react";
import { VapiFormFields } from "./vapi-form-field";
import { AppearanceSettings } from "./appearance-settings";
import { ThemePreview } from "./theme-preview";
import { FormSchema } from "../../type";
import { widgetSettingsSchema } from "../../schemas";
import { useState } from "react";
import { mergeThemeSettings } from "@/modules/customization/lib/theme-utils";

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
  const [activeTab, setActiveTab] = useState("general");

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
      themeSettings: initialData?.themeSettings,
    },
  });

  const themeSettings = form.watch("themeSettings");

  // Initialize themeSettings when switching to appearance tab
  const handleAppearanceTab = () => {
    if (!themeSettings) {
      form.setValue("themeSettings", {
        colors: {
          primary: "#3b82f6",
          primaryForeground: "#ffffff",
          secondary: "#64748b",
          secondaryForeground: "#ffffff",
          background: "#ffffff",
          foreground: "#000000",
          userMessage: { bg: "#3b82f6", text: "#ffffff" },
          assistantMessage: { bg: "#f3f4f6", text: "#111827" },
          border: "#e5e7eb",
          mutedForeground: "#6b7280",
          muted: "#f3f4f6",
        },
        components: {
          header: {
            bg: "#ffffff",
            borderColor: "#e5e7eb",
            textColor: "#000000",
          },
          input: {
            bg: "#ffffff",
            borderColor: "#e5e7eb",
            textColor: "#000000",
            placeholderColor: "#9ca3af",
          },
          button: {
            primary: {
              bg: "#3b82f6",
              text: "#ffffff",
              hover: "#2563eb",
            },
            ghost: {
              bg: "transparent",
              text: "#3b82f6",
              hover: "#dbeafe",
            },
            disabled: {
              bg: "#f3f4f6",
              text: "#9ca3af",
            },
          },
          avatar: {
            bg: "#f0f4f8",
            border: "#ffffff",
          },
          indicator: {
            speaking: "#22c55e",
            listening: "#ef4444",
          },
        },
        spacing: {
          messageGap: "1rem",
          padding: "1rem",
          borderRadius: "0.5rem",
        },
        animations: {
          enabled: true,
          transitionDuration: "200ms",
        },
      });
    }
    setActiveTab("appearance");
  };

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

      // Deep merge theme settings dengan defaults untuk ensure lengkap
      const finalThemeSettings = values.themeSettings
        ? mergeThemeSettings(values.themeSettings)
        : undefined;

      // Validate theme settings completeness
      if (finalThemeSettings) {
        const hasAllColors =
          finalThemeSettings.colors &&
          Object.keys(finalThemeSettings.colors).length > 0;
        const hasAllComponents =
          finalThemeSettings.components &&
          Object.keys(finalThemeSettings.components).length > 0;
        const hasAllSpacing =
          finalThemeSettings.spacing &&
          Object.keys(finalThemeSettings.spacing).length > 0;
        const hasAllAnimations = finalThemeSettings.animations;

        if (
          !hasAllColors ||
          !hasAllComponents ||
          !hasAllSpacing ||
          !hasAllAnimations
        ) {
          console.error(
            "Incomplete theme settings detected",
            finalThemeSettings,
          );
          toast.error("Theme settings incomplete. Please try again.");
          return;
        }
      }

      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestion: values.defaultSuggestion,
        vapiSettings,
        ...(finalThemeSettings && { themeSettings: finalThemeSettings }),
      });

      toast.success("Widget settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Widget Customization</CardTitle>
            <CardDescription>
              Customize your agent to fit to your customers need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="inline-flex h-9 items-center justify-start rounded-none border-b border-border bg-transparent p-0 text-muted-foreground w-full">
                <TabsTrigger
                  value="general"
                  className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent gap-2"
                >
                  <MessageSquareIcon className="h-4 w-4" />
                  General & Behavior
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none border-b-2 border-transparent gap-2"
                  onClick={handleAppearanceTab}
                >
                  <PaletteIcon className="h-4 w-4" />
                  Appearance & Branding
                </TabsTrigger>
              </TabsList>

              {/* General & Behavior Tab */}
              <TabsContent value="general" className="space-y-6 mt-6">
                <div className="space-y-6">
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
                      <h3 className="mb-4 text-sm font-semibold">
                        Default Suggestion
                      </h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Quick reply suggestions shown to customer to help guide
                        the conversation
                      </p>
                    </div>

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
                              rows={2}
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
                              rows={2}
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
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {hasVapiPlugin && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-4 text-sm font-semibold">
                            Voice Assistant
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Configure voice calling features powered by Vapi.
                          </p>
                        </div>
                        <VapiFormFields form={form} />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Appearance & Branding Tab */}
              <TabsContent value="appearance" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
                  {/* Settings Form */}
                  <div className="lg:col-span-2">
                    <AppearanceSettings form={form} />
                  </div>

                  {/* Live Preview */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-4">
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold mb-1">
                          Live Preview
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4">
                          See changes in real-time
                        </p>
                      </div>
                      {themeSettings && (
                        <ThemePreview
                          colors={themeSettings.colors}
                          components={themeSettings.components}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
