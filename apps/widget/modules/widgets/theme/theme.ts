/**
 * Widget Theme Configuration
 * Centralized theme configuration for consistent styling across all widget screens
 * Prepared for future customization feature from web app
 */

export interface ThemeConfig {
  // Primary theme colors
  colors: {
    // Main brand color - used for primary buttons, user messages, accents
    primary: string;
    primaryForeground: string;

    // Secondary colors
    secondary: string;
    secondaryForeground: string;

    // Background colors
    background: string;
    foreground: string;

    // Message bubbles
    userMessage: {
      bg: string;
      text: string;
    };
    assistantMessage: {
      bg: string;
      text: string;
    };

    // Status indicators
    border: string;
    mutedForeground: string;
    muted: string;
  };

  // Component styling
  components: {
    // Header styling
    header: {
      bg: string;
      borderColor: string;
      textColor: string;
    };

    // Input area styling
    input: {
      bg: string;
      borderColor: string;
      textColor: string;
      placeholderColor: string;
    };

    // Button styling
    button: {
      primary: {
        bg: string;
        text: string;
        hover: string;
      };
      ghost: {
        bg: string;
        text: string;
        hover: string;
      };
      disabled: {
        bg: string;
        text: string;
      };
    };

    // Avatar styling
    avatar: {
      bg: string;
      border: string;
    };

    // Status indicators
    indicator: {
      speaking: string;
      listening: string;
    };
  };

  // Spacing and sizing
  spacing: {
    messageGap: string;
    padding: string;
    borderRadius: string;
  };

  // Effects and animations
  animations: {
    enabled: boolean;
    transitionDuration: string;
  };
}

/**
 * Default theme - matches the current chat page design
 * All color values use Tailwind CSS class names for consistency
 */
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "#3b82f6", // blue-500
    primaryForeground: "#ffffff",

    secondary: "#64748b", // slate-500
    secondaryForeground: "#ffffff",

    background: "#ffffff",
    foreground: "#000000",

    userMessage: {
      bg: "#3b82f6", // blue-500
      text: "#ffffff",
    },
    assistantMessage: {
      bg: "#f3f4f6", // gray-100
      text: "#111827", // gray-900
    },

    border: "#e5e7eb", // gray-200
    mutedForeground: "#6b7280", // gray-500
    muted: "#f3f4f6", // gray-100
  },

  components: {
    header: {
      bg: "#ffffff",
      borderColor: "#e5e7eb", // gray-200
      textColor: "#000000",
    },

    input: {
      bg: "#ffffff",
      borderColor: "#e5e7eb", // gray-200
      textColor: "#000000",
      placeholderColor: "#9ca3af", // gray-400
    },

    button: {
      primary: {
        bg: "#3b82f6", // blue-500
        text: "#ffffff",
        hover: "#2563eb", // blue-600
      },
      ghost: {
        bg: "transparent",
        text: "#3b82f6", // blue-500
        hover: "#dbeafe", // blue-100
      },
      disabled: {
        bg: "#f3f4f6", // gray-100
        text: "#9ca3af", // gray-400
      },
    },

    avatar: {
      bg: "#f0f4f8",
      border: "#ffffff",
    },

    indicator: {
      speaking: "#22c55e", // green-500
      listening: "#ef4444", // red-500
    },
  },

  spacing: {
    messageGap: "1rem", // gap-4
    padding: "1rem", // p-4
    borderRadius: "0.5rem", // rounded-lg
  },

  animations: {
    enabled: true,
    transitionDuration: "200ms",
  },
};

/**
 * Apply theme to CSS variables
 * This function converts theme config to CSS custom properties
 * that can be easily updated at runtime
 */
export const applyThemeToCSSVariables = (theme: ThemeConfig) => {
  const root = document.documentElement;

  // Colors
  root.style.setProperty("--theme-primary", theme.colors.primary);
  root.style.setProperty("--theme-primary-fg", theme.colors.primaryForeground);
  root.style.setProperty("--theme-secondary", theme.colors.secondary);
  root.style.setProperty(
    "--theme-secondary-fg",
    theme.colors.secondaryForeground,
  );
  root.style.setProperty("--theme-bg", theme.colors.background);
  root.style.setProperty("--theme-fg", theme.colors.foreground);

  // Message bubbles
  root.style.setProperty("--theme-user-msg-bg", theme.colors.userMessage.bg);
  root.style.setProperty(
    "--theme-user-msg-text",
    theme.colors.userMessage.text,
  );
  root.style.setProperty(
    "--theme-assistant-msg-bg",
    theme.colors.assistantMessage.bg,
  );
  root.style.setProperty(
    "--theme-assistant-msg-text",
    theme.colors.assistantMessage.text,
  );

  // Status
  root.style.setProperty("--theme-border", theme.colors.border);
  root.style.setProperty("--theme-muted-fg", theme.colors.mutedForeground);
  root.style.setProperty("--theme-muted", theme.colors.muted);

  // Components
  root.style.setProperty("--theme-header-bg", theme.components.header.bg);
  root.style.setProperty(
    "--theme-header-border",
    theme.components.header.borderColor,
  );
  root.style.setProperty(
    "--theme-header-text",
    theme.components.header.textColor,
  );

  root.style.setProperty("--theme-input-bg", theme.components.input.bg);
  root.style.setProperty(
    "--theme-input-border",
    theme.components.input.borderColor,
  );
  root.style.setProperty(
    "--theme-input-text",
    theme.components.input.textColor,
  );
  root.style.setProperty(
    "--theme-input-placeholder",
    theme.components.input.placeholderColor,
  );

  root.style.setProperty(
    "--theme-btn-primary-bg",
    theme.components.button.primary.bg,
  );
  root.style.setProperty(
    "--theme-btn-primary-text",
    theme.components.button.primary.text,
  );
  root.style.setProperty(
    "--theme-btn-primary-hover",
    theme.components.button.primary.hover,
  );

  root.style.setProperty(
    "--theme-btn-ghost-bg",
    theme.components.button.ghost.bg,
  );
  root.style.setProperty(
    "--theme-btn-ghost-text",
    theme.components.button.ghost.text,
  );
  root.style.setProperty(
    "--theme-btn-ghost-hover",
    theme.components.button.ghost.hover,
  );

  root.style.setProperty(
    "--theme-btn-disabled-bg",
    theme.components.button.disabled.bg,
  );
  root.style.setProperty(
    "--theme-btn-disabled-text",
    theme.components.button.disabled.text,
  );

  root.style.setProperty("--theme-avatar-bg", theme.components.avatar.bg);
  root.style.setProperty(
    "--theme-avatar-border",
    theme.components.avatar.border,
  );

  root.style.setProperty(
    "--theme-indicator-speaking",
    theme.components.indicator.speaking,
  );
  root.style.setProperty(
    "--theme-indicator-listening",
    theme.components.indicator.listening,
  );

  // Spacing
  root.style.setProperty("--theme-msg-gap", theme.spacing.messageGap);
  root.style.setProperty("--theme-padding", theme.spacing.padding);
  root.style.setProperty("--theme-radius", theme.spacing.borderRadius);

  // Animations
  if (theme.animations.enabled) {
    root.style.setProperty(
      "--theme-transition",
      theme.animations.transitionDuration,
    );
  }
};

/**
 * Get CSS class name based on theme property
 * Helper function to use theme values in className
 */
export const getThemeClass = (
  property: keyof ThemeConfig["colors"],
): string => {
  // This is a mapping of theme color values to Tailwind classes
  // for use in className (when CSS variables can't be used)
  const colorMap: Record<string, Record<string, string>> = {
    primary: {
      "#3b82f6": "bg-blue-500",
    },
    userMessage: {
      bg: "bg-blue-500",
      text: "text-white",
    },
    assistantMessage: {
      bg: "bg-gray-100",
      text: "text-gray-900",
    },
  };

  return colorMap[property as string]?.bg ?? "";
};
