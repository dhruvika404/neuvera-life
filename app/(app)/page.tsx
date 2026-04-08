import { KpiCardGrid } from "@/components/dashboard/KpiCardGrid";
import { AgentActivityPanel } from "@/components/dashboard/AgentActivityPanel";
import { OutreachSummaryPanel } from "@/components/dashboard/OutreachSummaryPanel";
import { LeadPipelineTable } from "@/components/dashboard/LeadPipelineTable";
import { ClientDate } from "@/components/ui/ClientDate";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrgId } from "@/lib/db";

async function getDashboardStats(orgId: string) {
  const supabase = await createClient();

  const [leadsRes, campaignsRes, runningJobsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("stage", "qualified"),
    supabase
      .from("campaigns")
      .select("emails_sent, emails_opened")
      .eq("organization_id", orgId),
    supabase
      .from("pipeline_jobs")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .in("status", ["pending", "claimed", "running"]),
  ]);

  const leadsQualified = leadsRes.count ?? 0;

  const campaigns = campaignsRes.data ?? [];
  const emailsSent = campaigns.reduce((s, c) => s + (c.emails_sent ?? 0), 0);
  const emailsOpened = campaigns.reduce((s, c) => s + (c.emails_opened ?? 0), 0);
  const openRate = emailsSent > 0 ? (emailsOpened / emailsSent) * 100 : 0;

  const runningJobs = runningJobsRes.count ?? 0;

  return { leadsQualified, emailsSent, openRate, meetings: 0, runningJobs };
}

export default async function DashboardPage() {
  const orgId = await getActiveOrgId();
  const stats = orgId ? await getDashboardStats(orgId) : null;

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-[1.75rem] leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Good morning, Neuvera Life
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-ink3)" }}
          >
            AI-powered pipeline overview · <ClientDate />
          </p>
        </div>
        {stats && stats.runningJobs > 0 && (
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] px-2.5 py-1 rounded-full border"
              style={{
                background: "var(--color-green-bg)",
                color: "var(--color-green)",
                borderColor: "var(--color-green-bg)",
              }}
            >
              {stats.runningJobs} job{stats.runningJobs > 1 ? "s" : ""} running
            </span>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <KpiCardGrid
        stats={{
          leadsQualified: stats?.leadsQualified ?? 0,
          emailsSent: stats?.emailsSent ?? 0,
          openRate: stats?.openRate ?? 0,
          meetings: stats?.meetings ?? 0,
        }}
      />

      {/* Two-column panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <AgentActivityPanel />
        <OutreachSummaryPanel />
      </div>

      {/* Full-width lead pipeline */}
      <LeadPipelineTable />
    </div>
  );
}
