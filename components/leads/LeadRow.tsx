"use client";
import React from "react";
import { LeadStageTag, LeadStage } from "./LeadStageTag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, ExternalLink, Link2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface LeadRowProps {
  id: string;
  name: string;
  email?: string;
  company: string;
  title: string;
  stage: LeadStage;
  icpFit: number;
  source: string;
  selected?: boolean;
  onSelect?: (open: boolean) => void;
  onClick?: () => void;
}

export function LeadRow({
  id,
  name,
  email,
  company,
  title,
  stage,
  icpFit,
  source,
  selected,
  onSelect,
  onClick
}: LeadRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group cursor-pointer border-b last:border-0 transition-colors",
        selected ? "bg-gold-d/50" : "hover:bg-s2/40"
      )}
    >
      <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selected}
          onCheckedChange={(val) => onSelect?.(!!val)}
        />
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-8 h-8 rounded-lg border border-b-l bg-surface">
            <AvatarFallback className="text-[10px] font-bold text-ink2">
              {company.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-ink truncate">{company}</span>
            <span className="text-[11px] text-ink3 truncate leading-none mt-0.5">{email}</span>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-ink2">{name}</span>
          <span className="text-[11px] text-ink4">{title}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-center">
        <div className="inline-flex items-center justify-center">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full border text-[11px] font-mono font-bold"
            style={{
              borderColor: icpFit > 80 ? "var(--color-green-bg)" : "var(--color-b)",
              color: icpFit > 80 ? "var(--color-green)" : "var(--color-ink3)",
              background: icpFit > 80 ? "var(--color-green-bg)" : "transparent",
            }}
          >
            {icpFit}
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-ink2 bg-s2 px-1.5 py-0.5 rounded border border-border-l">
            {source}
          </span>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <LeadStageTag stage={stage} />
      </td>
      <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-md hover:bg-s3 text-ink4 hover:text-ink2 transition-colors">
            <Link2 size={14} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-s3 text-ink4 hover:text-ink2 transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
