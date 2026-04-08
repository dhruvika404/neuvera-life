"use client";
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { LeadStageTag, LeadStage } from "./LeadStageTag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  X, 
  Mail, 
  Link2, 
  Globe, 
  MapPin, 
  Target, 
  History,
  ExternalLink,
  Plus
} from "lucide-react";
import { Lead } from "@/types/lead";

interface LeadDetailPanelProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailPanel({ lead, open, onOpenChange }: LeadDetailPanelProps) {
  if (!lead) return null;
  const company = lead.company ?? "NA";
  const displayName = lead.name ?? "Unknown Lead";
  const displayTitle = lead.title ?? "Unknown Title";
  const displaySource = lead.source ?? "Unknown";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[380px] p-0 border-l border-b flex flex-col bg-surface">
        {/* Header */}
        <div className="p-5 border-b bg-s2/20">
          <div className="flex items-start justify-between mb-4">
            <Avatar className="w-12 h-12 rounded-xl border bg-surface">
              <AvatarFallback className="font-bold text-ink">
                {company.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <LeadStageTag stage={lead.stage as LeadStage} />
            </div>
          </div>
          
          <div className="flex flex-col">
            <h2 className="font-serif text-xl text-ink leading-tight">{displayName}</h2>
            <p className="text-[13px] text-ink2 mt-1">{displayTitle} · <span className="font-semibold">{company}</span></p>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-7">
            {/* Contact Info */}
            <section className="space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-ink4">Contact Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-ink2 p-2.5 rounded-lg border border-b-l bg-s2/30">
                  <Mail className="w-4 h-4 text-ink3" />
                  <span className="flex-1 truncate">{lead.email || "No email available"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink2 p-2.5 rounded-lg border border-b-l bg-s2/30">
                  <Link2 className="w-4 h-4 text-ink3" />
                  <span className="flex-1 truncate">LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                </div>
                {lead.source && (
                   <div className="flex items-center gap-3 text-sm text-ink2 p-2.5 rounded-lg border border-b-l bg-s2/30">
                     <Globe className="w-4 h-4 text-ink3" />
                     <span className="flex-1 truncate">Source: {displaySource}</span>
                   </div>
                )}
              </div>
            </section>

            {/* ICP Fit */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-ink4">ICP Alignment</h3>
                <span className="text-[13px] font-serif text-gold font-bold">{lead.icpFit}% Match</span>
              </div>
              <div className="h-1.5 w-full bg-s3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold transition-all duration-500" 
                  style={{ width: `${lead.icpFit}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 rounded border bg-surface flex flex-col gap-0.5">
                   <span className="text-[9px] uppercase font-bold text-ink4">Industry</span>
                   <span className="text-xs font-semibold text-ink2">SaaS / Fintech</span>
                </div>
                <div className="p-2 rounded border bg-surface flex flex-col gap-0.5">
                   <span className="text-[9px] uppercase font-bold text-ink4">Region</span>
                   <span className="text-xs font-semibold text-ink2">North America</span>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-ink4">Activity Log</h3>
              <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-b-l">
                <div className="flex gap-3 relative z-10 pl-1">
                  <div className="w-4 h-4 rounded-full bg-green border-2 border-surface shrink-0 mt-1" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-medium text-ink">Discovered via Apollo.io</p>
                    <p className="text-[11px] text-ink4 font-medium">Checked ICP Fit: 94% · 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-3 relative z-10 pl-1 opacity-50">
                  <div className="w-4 h-4 rounded-full bg-b-l border-2 border-surface shrink-0 mt-1" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] font-medium text-ink2">Queued for Enrichment</p>
                    <p className="text-[11px] text-ink4">Pending next agent run</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-s2/20 flex gap-2">
          <button className="flex-1 h-10 px-4 bg-ink text-gold rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <Mail className="w-4 h-4" />
            Send Email
          </button>
          <button className="h-10 w-10 border bg-surface rounded-lg flex items-center justify-center text-ink3 hover:text-ink hover:bg-s2 transition-all">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
