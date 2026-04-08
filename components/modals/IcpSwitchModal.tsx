"use client";
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useModals } from "@/hooks/useModals";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle2, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MOCK_ICPS = [
  { id: "icp-1", name: "US Skincare Founders", description: "CEO/Founder, Biotech/Skin, US/Canada, 10-200 employees", leads: 1420 },
  { id: "icp-2", name: "UK Beauty Buyers", description: "Head of Procurement, Beauty Retails, UK, Series A+", leads: 840 },
  { id: "icp-3", name: "Fintech Growth Lead", description: "VP Marketing, Fintech, Global, 50-500 employees", leads: 2100 },
];

export function IcpSwitchModal() {
  const { activeModal, closeModal, payload } = useModals();
  const isOpen = activeModal === "icp-switch";
  const [selected, setSelected] = useState<string>("icp-1");

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && closeModal()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-b bg-surface shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 bg-s2/20 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-amber-bg flex items-center justify-center text-amber mb-3">
             <Target size={20} />
          </div>
          <DialogTitle className="font-serif text-xl text-ink">Switch ICP Profile</DialogTitle>
          <DialogDescription className="text-ink3 text-[13px]">
            Targeting depends on the active ICP. Switching will update your prospecting filters.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 border-b bg-white flex items-center gap-3 shrink-0">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink4" />
             <Input placeholder="Search profiles..." className="h-9 pl-9 text-xs border-b-l bg-s2/30" />
           </div>
           <button className="h-9 px-3 rounded-lg border border-gold/30 text-gold font-bold text-[11px] flex items-center gap-2 hover:bg-gold/5 transition-all">
             <Plus size={14} />
             Create New
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {MOCK_ICPS.map((icp) => (
            <div 
              key={icp.id}
              onClick={() => setSelected(icp.id)}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer group flex items-start gap-4",
                selected === icp.id 
                  ? "border-gold bg-gold/5 ring-1 ring-gold/20" 
                  : "border-b-l hover:bg-s2/30 hover:border-b"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 transition-all",
                selected === icp.id ? "border-gold bg-gold text-surface" : "border-b text-transparent"
              )}>
                <CheckCircle2 size={12} strokeWidth={3} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                   <h4 className={cn(
                     "text-[14px] font-bold truncate",
                     selected === icp.id ? "text-amber" : "text-ink"
                   )}>{icp.name}</h4>
                   <span className="text-[11px] font-mono font-bold text-ink4">{icp.leads} leads matched</span>
                </div>
                <p className="text-[12px] text-ink3 leading-snug mt-1">{icp.description}</p>
                
                {selected === icp.id && (
                  <div className="flex items-center gap-2 mt-3 animate-msg-in">
                    <Badge variant="outline" className="text-[10px] bg-white border-gold/30 text-gold py-0 h-5">Current Active</Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="p-4 bg-s2/20 border-t flex flex-row gap-3 shrink-0">
          <button 
            onClick={closeModal}
            className="flex-1 h-10 rounded-lg text-[13px] font-bold text-ink3 hover:bg-s3 transition-all"
          >
            Stay on current
          </button>
          <button 
            onClick={closeModal}
            className="flex-[1.5] h-10 rounded-lg bg-ink text-gold font-bold text-[13.5px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            Switch Strategy
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
