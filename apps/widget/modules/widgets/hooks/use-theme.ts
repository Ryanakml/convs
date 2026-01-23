/**
 * useTheme Hook
 * Helper hook to access and apply theme throughout the widget
 */

import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { themeAtom } from "../atoms/widget-atoms";
import { applyThemeToCSSVariables } from "../theme/theme";

export const useTheme = () => {
  const theme = useAtomValue(themeAtom);

  // Apply theme to CSS variables when theme changes
  useEffect(() => {
    console.log(
      "[useTheme] 🎨 Theme changed, applying to CSS variables:",
      theme,
    );
    console.log("[useTheme] 🔍 Background color:", theme.colors.background);
    console.log("[useTheme] 🔍 Primary color:", theme.colors.primary);
    applyThemeToCSSVariables(theme);
  }, [theme]);

  return theme;
};
