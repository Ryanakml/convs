"use client";

import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

interface ColorPickerProps {
  label?: string;
  description?: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorPicker = ({
  label,
  description,
  value,
  onChange,
  disabled = false,
}: ColorPickerProps) => {
  const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={isValidHex ? value : "#3b82f6"}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(
              "h-10 w-16 cursor-pointer rounded-md border border-input bg-background",
              disabled && "cursor-not-allowed opacity-50",
            )}
          />
        </div>
        <Input
          type="text"
          placeholder="#000000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="font-mono text-sm"
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {!isValidHex && value && (
        <p className="text-xs text-red-500">Invalid hex color format</p>
      )}
    </div>
  );
};
