import { atom } from "jotai";
import { WidgetScreen } from "../types";

// Basic widget state atom
export const screenAtom = atom<WidgetScreen>("auth");
