import React from "react";
import { cn } from "@/lib/utils";

export type LeadStage = "new" | "contacted" | "engaged" | "qualified" | "converted" | "nurture" | "archived";

interface LeadStageTagProps {
  stage: LeadStage;
  className?: string;
}

const STAGE_CONFIG: Record<LeadStage, { label: string; bg: string; text: string; border: string }> = {
  new: { label: "New", bg: "var(--color-blue-bg)", text: "var(--color-blue)", border: "var(--color-blue-bg)" },
  contacted: { label: "Contacted", bg: "var(--color-purple-bg)", text: "var(--color-purple)", border: "var(--color-purple-bg)" },
  engaged: { label: "Engaged", bg: "var(--color-gold-d)", text: "var(--color-gold)", border: "var(--color-gold-l)" },
  qualified: { label: "Qualified", bg: "var(--color-green-bg)", text: "var(--color-green)", border: "var(--color-green-bg)" },
  converted: { label: "Converted", bg: "var(--color-gold)", text: "var(--color-surface)", border: "var(--color-gold)" },
  nurture: { label: "Nurture", bg: "var(--color-amber-bg)", text: "var(--color-amber)", border: "var(--color-amber-bg)" },
  archived: { label: "Archived", bg: "var(--color-s3)", text: "var(--color-ink3)", border: "var(--color-b)" },
};

export function LeadStageTag({ stage, className }: LeadStageTagProps) {
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.new;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all",
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      {config.label}
    </span>
  );
}
