import {
  ThemeSettings,
  ThemeColors,
  ThemeComponents,
  ThemeSpacing,
  ThemeAnimations,
} from "../type";

const DEFAULT_THEME_COLORS: ThemeColors = {
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
};

const DEFAULT_THEME_COMPONENTS: ThemeComponents = {
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
};

const DEFAULT_THEME_SPACING: ThemeSpacing = {
  messageGap: "1rem",
  padding: "1rem",
  borderRadius: "0.5rem",
};

const DEFAULT_THEME_ANIMATIONS: ThemeAnimations = {
  enabled: true,
  transitionDuration: "200ms",
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  colors: DEFAULT_THEME_COLORS,
  components: DEFAULT_THEME_COMPONENTS,
  spacing: DEFAULT_THEME_SPACING,
  animations: DEFAULT_THEME_ANIMATIONS,
};

/**
 * Deep merge custom theme settings with defaults
 * Fills in missing values with defaults while preserving custom values
 * Ensures no undefined fields in the final theme object
 */
export const mergeThemeSettings = (
  customTheme?: Partial<ThemeSettings>,
): ThemeSettings => {
  if (!customTheme) {
    return DEFAULT_THEME_SETTINGS;
  }

  return {
    colors: {
      ...DEFAULT_THEME_COLORS,
      ...(customTheme.colors || {}),
      userMessage: {
        ...DEFAULT_THEME_COLORS.userMessage,
        ...(customTheme.colors?.userMessage || {}),
      },
      assistantMessage: {
        ...DEFAULT_THEME_COLORS.assistantMessage,
        ...(customTheme.colors?.assistantMessage || {}),
      },
    },
    components: {
      header: {
        ...DEFAULT_THEME_COMPONENTS.header,
        ...(customTheme.components?.header || {}),
      },
      input: {
        ...DEFAULT_THEME_COMPONENTS.input,
        ...(customTheme.components?.input || {}),
      },
      button: {
        primary: {
          ...DEFAULT_THEME_COMPONENTS.button.primary,
          ...(customTheme.components?.button?.primary || {}),
        },
        ghost: {
          ...DEFAULT_THEME_COMPONENTS.button.ghost,
          ...(customTheme.components?.button?.ghost || {}),
        },
        disabled: {
          ...DEFAULT_THEME_COMPONENTS.button.disabled,
          ...(customTheme.components?.button?.disabled || {}),
        },
      },
      avatar: {
        ...DEFAULT_THEME_COMPONENTS.avatar,
        ...(customTheme.components?.avatar || {}),
      },
      indicator: {
        ...DEFAULT_THEME_COMPONENTS.indicator,
        ...(customTheme.components?.indicator || {}),
      },
    },
    spacing: {
      ...DEFAULT_THEME_SPACING,
      ...(customTheme.spacing || {}),
    },
    animations: {
      ...DEFAULT_THEME_ANIMATIONS,
      ...(customTheme.animations || {}),
    },
  };
};
