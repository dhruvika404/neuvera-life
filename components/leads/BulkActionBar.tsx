"use client";
import React from "react";
import { X, Send, Trash2, Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onAction?: (action: string) => void;
}

export function BulkActionBar({ selectedCount, onClear, onAction }: BulkActionBarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-msg-in flex items-center gap-4 bg-ink text-gold-l px-6 py-3.5 rounded-2xl shadow-[0_12px_40px_-10px_rgba(26,23,19,0.3)] border border-b-l/20 backdrop-blur-md min-w-[400px]">
      <div className="flex items-center gap-3 pr-4 border-r border-gold-l/20">
        <span className="font-mono text-lg font-bold text-gold">{selectedCount}</span>
        <span className="text-[13px] font-medium text-ink4">Selected</span>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <button 
          onClick={() => onAction?.("outreach")}
          className="h-9 px-4 rounded-lg bg-gold text-ink font-bold text-[12.5px] flex items-center gap-2 hover:opacity-90 transition-all shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Add to Outreach</span>
        </button>
        <button 
          onClick={() => onAction?.("stage")}
          className="h-9 px-3 rounded-lg border border-gold/30 text-gold-l text-[12.5px] font-medium flex items-center gap-2 hover:bg-gold/10 transition-all shrink-0"
        >
          <span>Change Stage</span>
        </button>
        <button 
          onClick={() => onAction?.("export")}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-gold/30 text-gold-l hover:bg-gold/10 transition-all shrink-0"
          title="Export Selected"
        >
          <Download size={15} />
        </button>
        <button 
          onClick={() => onAction?.("delete")}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-red/30 text-red hover:bg-red/10 transition-all shrink-0"
          title="Delete Selected"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <button 
        onClick={onClear}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/20 transition-all text-gold-l hover:text-gold"
      >
        <X size={16} />
      </button>
    </div>
  );
}
