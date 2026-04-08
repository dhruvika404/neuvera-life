"use client";
import { X, ChevronLeft, Settings } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useRouter } from "next/navigation";

const AGENT_CONFIGS = {
  prospecting: {
    label: "Prospecting Agent",
    sub: "Apollo.io · ICP: Skincare Founders",
    iconBg: "#1E1C18",
    iconBorder: "#3A3530",
  },
  engagement: {
    label: "Engagement Agent",
    sub: "Instantly.ai · HeyReach · Clay · HubSpot",
    iconBg: "#1E1C18",
    iconBorder: "#3A3530",
  }
};

export function WorkspaceTopBar() {
  const { activeAgent, closeWorkspace } = useWorkspaceStore();
  const router = useRouter();

  const config = AGENT_CONFIGS[activeAgent ?? "prospecting"];

  const handleClose = () => {
    closeWorkspace();
    router.push("/");
  };

  return (
    <div
      className="flex items-center justify-between px-4 border-b shrink-0"
      style={{
        height: "var(--topbar-h)",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-s2"
          style={{ color: "var(--color-ink3)" }}
          aria-label="Back to dashboard"
        >
          <ChevronLeft size={15} />
        </button>
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{
            background: config.iconBg,
            border: `0.5px solid ${config.iconBorder}`,
          }}
        >
          <svg width={13} height={13} viewBox="0 0 14 14" fill="none">
            {activeAgent === "prospecting" ? (
              <>
                <circle cx="7" cy="5" r="3" stroke="#C8A97A" strokeWidth="1.3"/>
                <path d="M1.5 13c0-3.03 2.462-5.5 5.5-5.5s5.5 2.47 5.5 5.5" stroke="#C8A97A" strokeWidth="1.3" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <path d="M1.5 2.5h11M1.5 5.5h11M1.5 8.5h7" stroke="#C8A97A" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M10 10l3 2.5-3 2.5" stroke="#C8A97A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </>
            )}
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--color-ink)", fontFamily: "var(--font-serif)" }}>
            {config.label}
          </p>
          <p className="text-[11px]" style={{ color: "var(--color-ink4)" }}>
            {config.sub}
          </p>
        </div>
        <span
          className="ml-1 px-2 py-0.5 rounded text-[9.5px] font-medium animate-pulse"
          style={{
            background: "var(--color-green-bg)",
            color: "var(--color-green)",
            border: "0.5px solid rgba(61,139,110,0.3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Running
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-s2"
          style={{ color: "var(--color-ink3)" }}
          aria-label="Agent settings"
        >
          <Settings size={14} />
        </button>
        <button
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-s2"
          style={{ color: "var(--color-ink3)" }}
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
