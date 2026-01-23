"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import { ColorPicker } from "./color-picker";
import { PaletteIcon } from "lucide-react";
import { FormSchema } from "../../type";
import { PRESET_THEMES, PRESET_THEME_LABELS } from "../../lib/preset-themes";

interface AppearanceSettingsProps {
  form: UseFormReturn<FormSchema>;
}

export const AppearanceSettings = ({ form }: AppearanceSettingsProps) => {
  const handlePresetTheme = (presetKey: keyof typeof PRESET_THEMES) => {
    const presetTheme = PRESET_THEMES[presetKey];
    if (presetTheme) {
      console.log("[Preset] 🎨 Applying preset:", presetKey);
      // Only update form state - save happens when user clicks 'Save Settings'
      form.setValue("themeSettings", presetTheme);
      console.log("[Preset] ✅ Form state updated (not saved to database yet)");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PaletteIcon className="size-4 text-primary" />
          Appearance Settings
        </CardTitle>
        <CardDescription>
          Customize the visual appearance and branding of your widget
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Preset Themes */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Quick Presets</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Choose a preset theme to get started quickly
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PRESET_THEME_LABELS).map(([key, label]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePresetTheme(key as keyof typeof PRESET_THEMES)
                }
                className="justify-start"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Primary Colors */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Brand Colors</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Set the main colors for your widget
            </p>
          </div>

          <FormField
            control={form.control}
            name="themeSettings.colors.primary"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker
                    label="Primary Color"
                    description="Main brand color used for buttons and highlights"
                    value={field.value || "#3b82f6"}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="themeSettings.colors.secondary"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker
                    label="Secondary Color"
                    description="Accent color for secondary elements"
                    value={field.value || "#64748b"}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Background Colors */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Background</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Widget background and text colors
            </p>
          </div>

          <FormField
            control={form.control}
            name="themeSettings.colors.background"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker
                    label="Background Color"
                    description="Main widget background"
                    value={field.value || "#ffffff"}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="themeSettings.colors.foreground"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker
                    label="Text Color"
                    description="Default text color"
                    value={field.value || "#000000"}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Message Bubbles */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Message Bubbles</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Customize colors for user and assistant messages
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="themeSettings.colors.userMessage.bg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPicker
                      label="User Message BG"
                      value={field.value || "#3b82f6"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="themeSettings.colors.userMessage.text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPicker
                      label="User Message Text"
                      value={field.value || "#ffffff"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="themeSettings.colors.assistantMessage.bg"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPicker
                      label="Bot Message BG"
                      value={field.value || "#f3f4f6"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="themeSettings.colors.assistantMessage.text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPicker
                      label="Bot Message Text"
                      value={field.value || "#111827"}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Border & Accents */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Borders & Accents</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Secondary colors for borders and muted elements
            </p>
          </div>

          <FormField
            control={form.control}
            name="themeSettings.colors.border"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker
                    label="Border Color"
                    value={field.value || "#e5e7eb"}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="themeSettings.colors.muted"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ColorPicker
                    label="Muted Background"
                    value={field.value || "#f3f4f6"}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
