"use client";
import { useState } from "react";
import useSWR from "swr";
import { Mail, ArrowRight, Plus } from "lucide-react";
import { CampaignRow } from "./CampaignRow";
import { Modal, Fg, TwoFg, FieldInput, FieldSelect, BtnPrimary, BtnGhost } from "@/components/ui/Modal";
import { useToastsStore } from "@/store/toasts.store";
import type { CampaignDto } from "@/types/dtos";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  });

function NewCampaignModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addToast } = useToastsStore();
  const [form, setForm] = useState({ name: "", tool: "Instantly.ai", icp: "Skincare Founders" });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSave() {
    if (!form.name) return;
    fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name }),
    }).then(() => addToast({ title: `Campaign "${form.name}" created`, type: "success" }));
    onClose();
    setForm({ name: "", tool: "Instantly.ai", icp: "Skincare Founders" });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Campaign"
      subtitle="Configure outreach sequence"
      footer={
        <>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary onClick={handleSave}>Create Campaign</BtnPrimary>
        </>
      }
    >
      <Fg label="Campaign Name">
        <FieldInput
          placeholder="Q2 Skincare Founders Outreach"
          value={form.name}
          onChange={set("name")}
          autoFocus
        />
      </Fg>
      <TwoFg>
        <Fg label="Outreach Tool">
          <FieldSelect value={form.tool} onChange={set("tool")}>
            <option>Instantly.ai</option>
            <option>HeyReach</option>
          </FieldSelect>
        </Fg>
        <Fg label="ICP Profile">
          <FieldSelect value={form.icp} onChange={set("icp")}>
            <option>Skincare Founders</option>
            <option>DTC Beauty Buyers</option>
            <option>Peptide Wholesale</option>
          </FieldSelect>
        </Fg>
      </TwoFg>
    </Modal>
  );
}

export function OutreachSummaryPanel() {
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const { data } = useSWR<{ campaigns: CampaignDto[] }>("/api/campaigns", fetcher, {
    refreshInterval: 10000,
  });

  const active = (data?.campaigns ?? []).filter((c) => c.status === "active");
  const totalSent = active.reduce((sum, c) => sum + c.emailsSent, 0);

  // Map campaigns to CampaignRow shape (top 3 active)
  const rows = active.slice(0, 3).map((c) => {
    const openRate = c.emailsSent > 0 ? (c.emailsOpened / c.emailsSent) * 100 : 0;
    const progress = c.emailsSent > 0 ? Math.min(100, Math.round((c.emailsOpened / c.emailsSent) * 100)) : 0;
    return {
      name: c.name,
      tool: "Instantly.ai",
      openRate: Math.round(openRate * 10) / 10,
      progress,
      sent: c.emailsSent,
    };
  });

  return (
    <>
      <div
        className="rounded-xl border overflow-hidden flex flex-col"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "var(--color-s2)" }}
            >
              <Mail size={13} style={{ color: "var(--color-ink2)" }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
              Active Campaigns
            </span>
          </div>
          <div className="flex items-center gap-3">
            {active.length > 0 && (
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: "var(--color-green-bg)", color: "var(--color-green)" }}
              >
                {active.length} running
              </span>
            )}
            <button
              onClick={() => setShowNewCampaign(true)}
              className="flex items-center gap-1 text-[12px] transition-opacity hover:opacity-70"
              style={{ color: "var(--color-gold)" }}
            >
              <Plus size={11} />
              New
            </button>
            <button
              className="flex items-center gap-1 text-[12px] transition-opacity hover:opacity-70"
              style={{ color: "var(--color-gold)" }}
            >
              View all
              <ArrowRight size={11} />
            </button>
          </div>
        </div>

        {/* Campaign rows */}
        <div className="px-5 flex-1">
          {rows.length > 0 ? (
            rows.map((c) => <CampaignRow key={c.name} {...c} />)
          ) : (
            <p className="text-[12px] py-4 text-center" style={{ color: "var(--color-ink4)" }}>
              No active campaigns
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2.5 border-t"
          style={{ borderColor: "var(--color-border)", background: "var(--color-s2)" }}
        >
          <p className="text-[11px]" style={{ color: "var(--color-ink4)" }}>
            {totalSent.toLocaleString()} total emails sent · all campaigns
          </p>
        </div>
      </div>

      <NewCampaignModal open={showNewCampaign} onClose={() => setShowNewCampaign(false)} />
    </>
  );
}
