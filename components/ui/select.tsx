"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("w-full rounded-md border px-3 py-2 text-sm", className)}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-sm text-[var(--color-ink4)]">{placeholder ?? "Select..."}</span>;
}

export function SelectContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-md border bg-[var(--color-surface)] p-1", className)}>{children}</div>;
}

export function SelectItem({ className, children }: { value: string; className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded px-2 py-1.5 text-sm", className)}>{children}</div>;
}
