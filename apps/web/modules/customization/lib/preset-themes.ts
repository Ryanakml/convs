/**
 * Preset Theme Configurations
 * Pre-built theme sets untuk quick customization
 */

import { ThemeSettings } from "../type";

export const PRESET_THEMES: Record<string, ThemeSettings> = {
  "default-blue": {
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
  },

  "energetic-orange": {
    colors: {
      primary: "#f97316",
      primaryForeground: "#ffffff",
      secondary: "#fb923c",
      secondaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#000000",
      userMessage: { bg: "#f97316", text: "#ffffff" },
      assistantMessage: { bg: "#fed7aa", text: "#7c2d12" },
      border: "#fed7aa",
      mutedForeground: "#92400e",
      muted: "#fed7aa",
    },
    components: {
      header: {
        bg: "#fff7ed",
        borderColor: "#fed7aa",
        textColor: "#7c2d12",
      },
      input: {
        bg: "#ffffff",
        borderColor: "#fed7aa",
        textColor: "#000000",
        placeholderColor: "#92400e",
      },
      button: {
        primary: {
          bg: "#f97316",
          text: "#ffffff",
          hover: "#ea580c",
        },
        ghost: {
          bg: "transparent",
          text: "#f97316",
          hover: "#ffedd5",
        },
        disabled: {
          bg: "#fed7aa",
          text: "#92400e",
        },
      },
      avatar: {
        bg: "#fff7ed",
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
  },

  "forest-green": {
    colors: {
      primary: "#16a34a",
      primaryForeground: "#ffffff",
      secondary: "#4ade80",
      secondaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#000000",
      userMessage: { bg: "#16a34a", text: "#ffffff" },
      assistantMessage: { bg: "#dcfce7", text: "#15803d" },
      border: "#bbf7d0",
      mutedForeground: "#15803d",
      muted: "#dcfce7",
    },
    components: {
      header: {
        bg: "#f0fdf4",
        borderColor: "#bbf7d0",
        textColor: "#15803d",
      },
      input: {
        bg: "#ffffff",
        borderColor: "#bbf7d0",
        textColor: "#000000",
        placeholderColor: "#15803d",
      },
      button: {
        primary: {
          bg: "#16a34a",
          text: "#ffffff",
          hover: "#15803d",
        },
        ghost: {
          bg: "transparent",
          text: "#16a34a",
          hover: "#f0fdf4",
        },
        disabled: {
          bg: "#dcfce7",
          text: "#15803d",
        },
      },
      avatar: {
        bg: "#f0fdf4",
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
  },

  "minimal-dark": {
    colors: {
      primary: "#1f2937",
      primaryForeground: "#ffffff",
      secondary: "#6b7280",
      secondaryForeground: "#ffffff",
      background: "#f9fafb",
      foreground: "#111827",
      userMessage: { bg: "#1f2937", text: "#ffffff" },
      assistantMessage: { bg: "#e5e7eb", text: "#111827" },
      border: "#d1d5db",
      mutedForeground: "#6b7280",
      muted: "#e5e7eb",
    },
    components: {
      header: {
        bg: "#1f2937",
        borderColor: "#374151",
        textColor: "#ffffff",
      },
      input: {
        bg: "#ffffff",
        borderColor: "#d1d5db",
        textColor: "#111827",
        placeholderColor: "#9ca3af",
      },
      button: {
        primary: {
          bg: "#1f2937",
          text: "#ffffff",
          hover: "#111827",
        },
        ghost: {
          bg: "transparent",
          text: "#1f2937",
          hover: "#f3f4f6",
        },
        disabled: {
          bg: "#d1d5db",
          text: "#9ca3af",
        },
      },
      avatar: {
        bg: "#e5e7eb",
        border: "#ffffff",
      },
      indicator: {
        speaking: "#10b981",
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
  },
};

export const PRESET_THEME_LABELS: Record<keyof typeof PRESET_THEMES, string> = {
  "default-blue": "Default Blue",
  "energetic-orange": "Energetic Orange",
  "forest-green": "Forest Green",
  "minimal-dark": "Minimal Dark",
};
