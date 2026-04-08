"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

export function Checkbox({ checked = false, onCheckedChange, className }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn("h-4 w-4 accent-[var(--color-gold)]", className)}
    />
  );
}
