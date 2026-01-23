/**
 * Theme Integration Helper
 * Helper untuk integrate custom theme dari widgetSettings ke widget
 * Ready untuk digunakan ketika customization feature sudah di-implement
 */

import { ThemeConfig, defaultTheme } from "./theme";

/**
 * Deep merge custom theme settings dengan default theme
 * Ensures backward compatibility dan tidak ada field undefined
 * Supports nested object merging
 */
export const mergeThemeSettings = (
  customThemeSettings?: Partial<ThemeConfig>,
): ThemeConfig => {
  if (!customThemeSettings) {
    return defaultTheme;
  }

  return {
    colors: {
      ...defaultTheme.colors,
      ...(customThemeSettings.colors || {}),
      userMessage: {
        ...defaultTheme.colors.userMessage,
        ...(customThemeSettings.colors?.userMessage || {}),
      },
      assistantMessage: {
        ...defaultTheme.colors.assistantMessage,
        ...(customThemeSettings.colors?.assistantMessage || {}),
      },
    },
    components: {
      header: {
        ...defaultTheme.components.header,
        ...(customThemeSettings.components?.header || {}),
      },
      input: {
        ...defaultTheme.components.input,
        ...(customThemeSettings.components?.input || {}),
      },
      button: {
        primary: {
          ...defaultTheme.components.button.primary,
          ...(customThemeSettings.components?.button?.primary || {}),
        },
        ghost: {
          ...defaultTheme.components.button.ghost,
          ...(customThemeSettings.components?.button?.ghost || {}),
        },
        disabled: {
          ...defaultTheme.components.button.disabled,
          ...(customThemeSettings.components?.button?.disabled || {}),
        },
      },
      avatar: {
        ...defaultTheme.components.avatar,
        ...(customThemeSettings.components?.avatar || {}),
      },
      indicator: {
        ...defaultTheme.components.indicator,
        ...(customThemeSettings.components?.indicator || {}),
      },
    },
    spacing: {
      ...defaultTheme.spacing,
      ...(customThemeSettings.spacing || {}),
    },
    animations: {
      ...defaultTheme.animations,
      ...(customThemeSettings.animations || {}),
    },
  };
};

/**
 * Validate theme color - ensure it's valid hex or rgb
 */
export const isValidColor = (color: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbRegex = /^rgb\(\d+,\s*\d+,\s*\d+\)$/;
  const rgbaRegex = /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/;

  return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
};

/**
 * Validate entire theme config
 */
export const validateThemeConfig = (theme: unknown): theme is ThemeConfig => {
  if (!theme || typeof theme !== "object") {
    return false;
  }

  const t = theme as Record<string, unknown>;

  // Check required fields
  if (!t.colors || !t.components || !t.spacing) {
    return false;
  }

  // Check colors are valid
  const colors = t.colors as Record<string, unknown>;
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      if (!isValidColor(value) && value !== "transparent") {
        console.warn(`Invalid color for ${key}: ${value}`);
        return false;
      }
    }
  }

  return true;
};

/**
 * Convert theme to CSS custom properties format
 * Useful for alternative implementation using CSS variables
 */
export const themeToCSS = (theme: ThemeConfig): Record<string, string> => {
  return {
    "--theme-primary": theme.colors.primary,
    "--theme-primary-fg": theme.colors.primaryForeground,
    "--theme-secondary": theme.colors.secondary,
    "--theme-secondary-fg": theme.colors.secondaryForeground,
    "--theme-bg": theme.colors.background,
    "--theme-fg": theme.colors.foreground,
    "--theme-user-msg-bg": theme.colors.userMessage.bg,
    "--theme-user-msg-text": theme.colors.userMessage.text,
    "--theme-assistant-msg-bg": theme.colors.assistantMessage.bg,
    "--theme-assistant-msg-text": theme.colors.assistantMessage.text,
    "--theme-border": theme.colors.border,
    "--theme-muted-fg": theme.colors.mutedForeground,
    "--theme-muted": theme.colors.muted,
    "--theme-header-bg": theme.components.header.bg,
    "--theme-header-border": theme.components.header.borderColor,
    "--theme-header-text": theme.components.header.textColor,
    "--theme-input-bg": theme.components.input.bg,
    "--theme-input-border": theme.components.input.borderColor,
    "--theme-input-text": theme.components.input.textColor,
    "--theme-input-placeholder": theme.components.input.placeholderColor,
    "--theme-btn-primary-bg": theme.components.button.primary.bg,
    "--theme-btn-primary-text": theme.components.button.primary.text,
    "--theme-btn-primary-hover": theme.components.button.primary.hover,
    "--theme-btn-ghost-bg": theme.components.button.ghost.bg,
    "--theme-btn-ghost-text": theme.components.button.ghost.text,
    "--theme-btn-ghost-hover": theme.components.button.ghost.hover,
    "--theme-btn-disabled-bg": theme.components.button.disabled.bg,
    "--theme-btn-disabled-text": theme.components.button.disabled.text,
    "--theme-avatar-bg": theme.components.avatar.bg,
    "--theme-avatar-border": theme.components.avatar.border,
    "--theme-indicator-speaking": theme.components.indicator.speaking,
    "--theme-indicator-listening": theme.components.indicator.listening,
    "--theme-msg-gap": theme.spacing.messageGap,
    "--theme-padding": theme.spacing.padding,
    "--theme-radius": theme.spacing.borderRadius,
  };
};
