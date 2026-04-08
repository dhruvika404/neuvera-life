"use client";
import React, { useState } from "react";
import { LeadRow } from "./LeadRow";
import { LeadStage } from "./LeadStageTag";
import { BulkActionBar } from "./BulkActionBar";
import { Lead } from "@/types/lead";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadTableProps {
  leads: Lead[];
  onLeadClick?: (id: string) => void;
}

export function LeadTable({ leads, onLeadClick }: LeadTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const normalizedSearch = search.toLowerCase();
  const filteredLeads = leads.filter((l) => {
    const name = (l.name ?? "").toLowerCase();
    const company = (l.company ?? "").toLowerCase();
    return name.includes(normalizedSearch) || company.includes(normalizedSearch);
  });

  const allSelected = filteredLeads.length > 0 && selectedIds.length === filteredLeads.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < filteredLeads.length;

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredLeads.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  return (
    <div className="relative flex flex-col bg-surface border border-b rounded-xl shadow-sm overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-3.5 px-4.5 border-b flex items-center justify-between gap-3 bg-surface z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink4" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-s2/50 border-b-l text-sm focus:bg-surface focus:ring-gold/20 transition-all"
            />
          </div>
          <button className="h-9 px-3 rounded-lg border border-b-l text-ink3 text-xs font-medium flex items-center gap-2 hover:bg-s2 transition-all">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-lg border border-b-l text-ink3 text-xs font-medium flex items-center gap-2 hover:bg-s2 transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Actual Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <Table>
          <TableHeader className="bg-s2/30 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[50px] px-4 py-2.5">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(val) => toggleSelectAll(!!val)}
                />
              </TableHead>
              <TableHead className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink4">Company</TableHead>
              <TableHead className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink4">Name</TableHead>
              <TableHead className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink4 text-center">ICP Fit</TableHead>
              <TableHead className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink4">Source</TableHead>
              <TableHead className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-ink4">Stage</TableHead>
              <TableHead className="w-[100px] px-4 py-2.5 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((l) => (
              <LeadRow
                key={l.id}
                id={l.id}
                name={l.name ?? ""}
                email={l.email ?? undefined}
                company={l.company ?? ""}
                title={l.title ?? ""}
                stage={l.stage as LeadStage}
                icpFit={l.icpFit || 0}
                source={l.source || ""}
                selected={selectedIds.includes(l.id)}
                onSelect={(checked) => toggleSelect(l.id, checked)}
                onClick={() => onLeadClick?.(l.id)}
              />
            ))}
            {filteredLeads.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="h-64 text-center py-10">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Search size={32} strokeWidth={1} />
                    <p className="text-sm font-medium">No leads found matching your search</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination / Total count */}
      <div className="p-3 border-t bg-s2/20 flex items-center justify-between text-[11px] text-ink3 font-medium px-4.5">
        <span>Showing {filteredLeads.length} of {leads.length} leads</span>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 rounded hover:bg-s3 disabled:opacity-30" disabled>Previous</button>
          <button className="px-2 py-1 rounded hover:bg-s3 disabled:opacity-30" disabled>Next</button>
        </div>
      </div>

      {/* Float Selection Bar */}
      {selectedIds.length > 0 && (
        <BulkActionBar 
          selectedCount={selectedIds.length} 
          onClear={() => setSelectedIds([])}
        />
      )}
    </div>
  );
}
