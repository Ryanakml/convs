import z from "zod";

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
});