/**
 * Widget Theme Provider
 * Manages theme initialization and updates with reactive sync
 * Handles localStorage caching and backend updates
 */

"use client";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { themeAtom, widgetSettingsAtom } from "../atoms/widget-atoms";
import { defaultTheme } from "../theme/theme";
import { mergeThemeSettings } from "../theme/theme-utils";

const THEME_CACHE_KEY = "widget_theme_cache";
const THEME_VERSION_KEY = "widget_theme_version";

/**
 * ThemeProvider Component
 * Wrap widget dengan component ini untuk automatic theme management
 *
 * Features:
 * - Initialize theme saat component mount (dari cache atau backend)
 * - Reactively update theme ketika widgetSettings.themeSettings berubah
 * - Clear localStorage cache saat data baru masuk dari backend
 * - Support custom theme dari backend dengan deep merge
 */
export const WidgetThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const setTheme = useSetAtom(themeAtom);

  useEffect(() => {
    console.log("[ThemeProvider] 🎨 Effect triggered");
    console.log("[ThemeProvider] 📦 widgetSettings:", widgetSettings);

    if (!widgetSettings) {
      console.log("[ThemeProvider] ⚠️ No widgetSettings yet, skipping...");
      return;
    }

    // Check if backend has custom theme settings
    const customThemeSettings = widgetSettings.themeSettings;
    console.log(
      "[ThemeProvider] 🎨 customThemeSettings from Convex:",
      customThemeSettings,
    );

    if (customThemeSettings) {
      console.log("[ThemeProvider] ✅ Custom theme detected! Applying...");

      // Clear ALL theme-related cache when new data comes from backend
      try {
        const oldVersion = localStorage.getItem(THEME_VERSION_KEY);
        const newVersion = JSON.stringify(customThemeSettings);

        if (oldVersion !== newVersion) {
          console.log(
            "[ThemeProvider] 🗑️ Theme version changed, clearing cache...",
          );
          localStorage.removeItem(THEME_CACHE_KEY);
          localStorage.setItem(THEME_VERSION_KEY, newVersion);
        }
      } catch (e) {
        console.warn("[ThemeProvider] ⚠️ localStorage error:", e);
      }

      // Deep merge custom theme dengan default theme
      const mergedTheme = mergeThemeSettings(customThemeSettings);
      console.log("[ThemeProvider] 🎨 Merged theme result:", mergedTheme);
      console.log(
        "[ThemeProvider] 🔍 Background color:",
        mergedTheme.colors.background,
      );
      console.log(
        "[ThemeProvider] 🔍 Primary color:",
        mergedTheme.colors.primary,
      );
      console.log("[ThemeProvider] 🎯 Setting theme to themeAtom NOW");
      setTheme(mergedTheme);
      console.log("[ThemeProvider] ✅ Theme set to atom successfully!");

      // 🔍 DEBUG: Verify atom was updated
      setTimeout(() => {
        console.log("[ThemeProvider] ⏱️ Verifying theme update after 100ms...");
      }, 100);
    } else {
      console.log("[ThemeProvider] 📌 No custom theme, using default theme");
      // No custom theme - use default
      setTheme(defaultTheme);
    }
  }, [widgetSettings?.themeSettings, widgetSettings, setTheme]);

  return <>{children}</>;
};

export default WidgetThemeProvider;
