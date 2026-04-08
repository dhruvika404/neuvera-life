"use client";
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useModals } from "@/hooks/useModals";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, Cpu, Filter, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AgentConfigModal() {
  const { activeModal, closeModal, payload } = useModals();
  const isOpen = activeModal === "agent-config";
  const modalPayload = payload as { agentName?: string } | null;

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && closeModal()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-b bg-surface shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-s2/20 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-teal-bg flex items-center justify-center text-teal mb-3">
             <Settings2 size={20} />
          </div>
          <DialogTitle className="font-serif text-xl text-ink">Agent Configuration</DialogTitle>
          <DialogDescription className="text-ink3 text-[13px]">
             Define operational guardrails and filtering logic for the {modalPayload?.agentName || "Active Agent"}.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          {/* Running Parameters */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-3">
                <Cpu size={14} className="text-teal" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink4">Execution Limits</h4>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-ink2">Max Leads per Run</Label>
                  <Input type="number" defaultValue={200} className="h-9 bg-s2/40 border-b-l focus:bg-surface focus:ring-teal/20 transition-all font-medium" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-ink2">Daily Multiplier</Label>
                  <Input type="number" defaultValue={1.5} className="h-9 bg-s2/40 border-b-l focus:bg-surface focus:ring-teal/20 transition-all font-medium" />
               </div>
             </div>
          </section>

          <Separator className="bg-b-l/40" />

          {/* Logic Filtering */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-3">
                <Filter size={14} className="text-amber" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink4">Logic & Filtering</h4>
             </div>
             
             <div className="space-y-3">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 border-b-l bg-s2/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-ink2">Auto-Enrichment</Label>
                    <p className="text-[11px] text-ink4">Run Clay enrichment immediately after discovery.</p>
                  </div>
                  <Checkbox checked={true} />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 border-b-l bg-s2/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-ink2">Deduplicate Sources</Label>
                    <p className="text-[11px] text-ink4">Remove leads already found in external lists.</p>
                  </div>
                  <Checkbox checked={true} />
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 border-b-l bg-s2/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-ink2">Strict Branding Filter</Label>
                    <p className="text-[11px] text-ink4">Only include brands matching aesthetic guidelines.</p>
                  </div>
                  <Checkbox checked={false} />
                </div>
             </div>
          </section>
        </div>

        <DialogFooter className="p-4 bg-s2/20 border-t flex flex-row gap-3">
          <button 
            onClick={closeModal}
            className="flex-1 h-10 rounded-lg text-[13px] font-bold text-ink3 hover:bg-s3 transition-all"
          >
            Discard Changes
          </button>
          <button 
            onClick={closeModal}
            className="flex-[1.5] h-10 rounded-lg bg-ink text-gold font-bold text-[13.5px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            <Zap size={14} />
            Update Config
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
