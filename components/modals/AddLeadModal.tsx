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
import { UserPlus, Building, Mail, Link2 } from "lucide-react";

export function AddLeadModal() {
  const { activeModal, closeModal } = useModals();
  const isOpen = activeModal === "add-lead";

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && closeModal()}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-b bg-surface shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-s2/20">
          <div className="w-10 h-10 rounded-lg bg-blue-bg flex items-center justify-center text-blue mb-3">
             <UserPlus size={20} />
          </div>
          <DialogTitle className="font-serif text-xl text-ink">Manual Lead Entry</DialogTitle>
          <DialogDescription className="text-ink3 text-[13px]">
            Add a prospect manually to your database for enrichment and outreach.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">Full Name</Label>
                <div className="relative">
                  <Input placeholder="John Doe" className="h-10 bg-s2/40 border-b-l pl-3 focus:bg-surface focus:ring-gold/20 transition-all font-medium" />
                </div>
             </div>
             <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">Company</Label>
                <div className="relative">
                   <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" />
                   <Input placeholder="Acme Inc" className="h-10 bg-s2/40 border-b-l pl-9 focus:bg-surface focus:ring-gold/20 transition-all font-medium" />
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">Email Address</Label>
             <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" />
                <Input placeholder="john@company.com" className="h-10 bg-s2/40 border-b-l pl-9 focus:bg-surface focus:ring-gold/20 transition-all font-medium" />
             </div>
          </div>

          <div className="space-y-2">
             <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">LinkedIn URL</Label>
             <div className="relative">
                <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink4" />
                <Input placeholder="https://linkedin.com/..." className="h-10 bg-s2/40 border-b-l pl-9 focus:bg-surface focus:ring-gold/20 transition-all font-medium" />
             </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-s2/20 border-t flex flex-row gap-3">
          <button 
            onClick={closeModal}
            className="flex-1 h-10 rounded-lg text-[13px] font-bold text-ink3 hover:bg-s3 transition-all"
          >
            Discard
          </button>
          <button 
            onClick={closeModal}
            className="flex-[1.5] h-10 rounded-lg bg-ink text-gold font-bold text-[13.5px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            Save Lead
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
