import { ProgressBar } from "@/components/ui/ProgressBar";

interface CampaignRowProps {
  name: string;
  tool: string;
  openRate: number;
  progress: number;
  sent: number;
}

export function CampaignRow({
  name,
  tool,
  openRate,
  progress,
  sent,
}: CampaignRowProps) {
  const openRateColor =
    openRate >= 35
      ? "var(--color-green)"
      : openRate >= 25
      ? "var(--color-amber)"
      : "var(--color-ink3)";

  return (
    <div
      className="py-3.5 border-b last:border-0"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <span
            className="text-[13px] font-medium block truncate"
            style={{ color: "var(--color-ink)" }}
          >
            {name}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                background: "var(--color-s2)",
                color: "var(--color-ink3)",
              }}
            >
              {tool}
            </span>
            <span
              className="text-[11px]"
              style={{
                color: "var(--color-ink4)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {sent.toLocaleString()} sent
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span
            className="text-sm font-semibold leading-none"
            style={{ color: openRateColor, fontFamily: "var(--font-mono)" }}
          >
            {openRate.toFixed(1)}%
          </span>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: "var(--color-ink4)" }}
          >
            open rate
          </p>
        </div>
      </div>
      <ProgressBar value={progress} color="gold" />
    </div>
  );
}
