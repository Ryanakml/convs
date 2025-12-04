import { widgetSettingsSchema } from "./schemas";
import { z } from "zod";

export type FormSchema = z.infer<typeof widgetSettingsSchema>;
