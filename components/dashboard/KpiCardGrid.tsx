import { KpiCard } from "./KpiCard";

export type DashboardStats = {
  leadsQualified: number;
  emailsSent: number;
  openRate: number;
  meetings: number;
};

export function KpiCardGrid({ stats }: { stats: DashboardStats }) {
  const openRateStr = stats.openRate > 0 ? `${stats.openRate.toFixed(1)}%` : "—";

  const kpis = [
    { label: "Leads Qualified", value: stats.leadsQualified.toLocaleString(), trend: 0, sub: "all time" },
    { label: "Emails Sent", value: stats.emailsSent.toLocaleString(), trend: 0, sub: "all campaigns" },
    { label: "Open Rate", value: openRateStr, trend: 0, sub: "industry avg 24%" },
    { label: "Meetings Booked", value: stats.meetings.toLocaleString(), trend: 0, sub: "in pipeline" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}
