import z from "zod";

export const themeColorsSchema = z.object({
  primary: z.string().default("#3b82f6"),
  primaryForeground: z.string().default("#ffffff"),
  secondary: z.string().default("#64748b"),
  secondaryForeground: z.string().default("#ffffff"),
  background: z.string().default("#ffffff"),
  foreground: z.string().default("#000000"),
  userMessage: z.object({
    bg: z.string().default("#3b82f6"),
    text: z.string().default("#ffffff"),
  }),
  assistantMessage: z.object({
    bg: z.string().default("#f3f4f6"),
    text: z.string().default("#111827"),
  }),
  border: z.string().default("#e5e7eb"),
  mutedForeground: z.string().default("#6b7280"),
  muted: z.string().default("#f3f4f6"),
});

export const themeComponentsSchema = z.object({
  header: z.object({
    bg: z.string().default("#ffffff"),
    borderColor: z.string().default("#e5e7eb"),
    textColor: z.string().default("#000000"),
  }),
  input: z.object({
    bg: z.string().default("#ffffff"),
    borderColor: z.string().default("#e5e7eb"),
    textColor: z.string().default("#000000"),
    placeholderColor: z.string().default("#9ca3af"),
  }),
  button: z.object({
    primary: z.object({
      bg: z.string().default("#3b82f6"),
      text: z.string().default("#ffffff"),
      hover: z.string().default("#2563eb"),
    }),
    ghost: z.object({
      bg: z.string().default("transparent"),
      text: z.string().default("#3b82f6"),
      hover: z.string().default("#dbeafe"),
    }),
    disabled: z.object({
      bg: z.string().default("#f3f4f6"),
      text: z.string().default("#9ca3af"),
    }),
  }),
  avatar: z.object({
    bg: z.string().default("#f0f4f8"),
    border: z.string().default("#ffffff"),
  }),
  indicator: z.object({
    speaking: z.string().default("#22c55e"),
    listening: z.string().default("#ef4444"),
  }),
});

export const themeSpacingSchema = z.object({
  messageGap: z.string().default("1rem"),
  padding: z.string().default("1rem"),
  borderRadius: z.string().default("0.5rem"),
});

export const themeAnimationsSchema = z.object({
  enabled: z.boolean().default(true),
  transitionDuration: z.string().default("200ms"),
});

export const themeSettingsSchema = z.object({
  colors: themeColorsSchema,
  components: themeComponentsSchema,
  spacing: themeSpacingSchema,
  animations: themeAnimationsSchema,
});

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Greeting Message Required"),
  defaultSuggestion: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
  themeSettings: themeSettingsSchema.optional(),
});
