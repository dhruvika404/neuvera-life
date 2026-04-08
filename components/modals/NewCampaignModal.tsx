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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Mail, Send, Target, LayoutList } from "lucide-react";

export function NewCampaignModal() {
  const { activeModal, closeModal, payload } = useModals();
  const isOpen = activeModal === "new-campaign";

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && closeModal()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-b bg-surface shadow-2xl">
        <DialogHeader className="p-6 pb-4 bg-s2/20">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-3">
             <Mail size={22} />
          </div>
          <DialogTitle className="font-serif text-xl text-ink">New Outreach Campaign</DialogTitle>
          <DialogDescription className="text-ink3 text-[13px]">
            Launch a personalized sequence to target your selected lead list.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-5">
          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">Campaign Name</Label>
            <Input 
              placeholder="e.g. Skincare Founders · Wave 2" 
              className="h-10 bg-s2/40 border-b-l focus:bg-surface focus:ring-gold/20 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">Select Lead List</Label>
              <Select>
                <SelectTrigger className="h-10 bg-s2/40 border-b-l focus:bg-surface focus:ring-gold/20 transition-all">
                  <div className="flex items-center gap-2">
                    <LayoutList size={14} className="text-ink3" />
                    <SelectValue placeholder="Choose list..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list-1">US Wave 1 — Founders</SelectItem>
                  <SelectItem value="list-2">DTC Beauty Buyers</SelectItem>
                  <SelectItem value="list-3">Series A Skincare SaaS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">ICP Profile</Label>
              <Select>
                <SelectTrigger className="h-10 bg-s2/40 border-b-l focus:bg-surface focus:ring-gold/20 transition-all">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-ink3" />
                    <SelectValue placeholder="Choose ICP..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="icp-1">Skincare Founders</SelectItem>
                  <SelectItem value="icp-2">DTC Beauty Buyers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-ink4">Outreach Provider</Label>
            <div className="grid grid-cols-2 gap-3">
              <button className="border-2 border-gold bg-gold/5 rounded-xl p-3 flex flex-col items-center gap-1 transition-all">
                 <span className="text-xs font-bold text-gold">Instantly.ai</span>
                 <span className="text-[10px] text-gold/60 font-medium">Email Seq.</span>
              </button>
              <button className="border-2 border-b-l bg-s2/30 rounded-xl p-3 flex flex-col items-center gap-1 transition-all hover:bg-s2/50">
                 <span className="text-xs font-bold text-ink3">HeyReach</span>
                 <span className="text-[10px] text-ink4 font-medium">LinkedIn Seq.</span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-s2/20 border-t flex flex-row gap-3">
          <button 
            onClick={closeModal}
            className="flex-1 h-10 rounded-lg text-[13px] font-bold text-ink3 hover:bg-s3 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Action logic
              closeModal();
            }}
            className="flex-[1.5] h-10 rounded-lg bg-ink text-gold font-bold text-[13.5px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            <Send size={15} />
            Create Campaign
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
