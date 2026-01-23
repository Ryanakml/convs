import {
  widgetSettingsSchema,
  themeSettingsSchema,
  themeColorsSchema,
  themeComponentsSchema,
  themeSpacingSchema,
  themeAnimationsSchema,
} from "./schemas";
import { z } from "zod";

export type FormSchema = z.infer<typeof widgetSettingsSchema>;
export type ThemeSettings = z.infer<typeof themeSettingsSchema>;
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type ThemeComponents = z.infer<typeof themeComponentsSchema>;
export type ThemeSpacing = z.infer<typeof themeSpacingSchema>;
export type ThemeAnimations = z.infer<typeof themeAnimationsSchema>;
