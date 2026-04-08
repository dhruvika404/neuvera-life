"use client";
import { useToastsStore } from "@/store/toasts.store";

const TYPE_STYLES = {
  success: { bg: "var(--color-ink)", color: "var(--color-bg)" },
  error: { bg: "var(--color-red)", color: "#fff" },
  info: { bg: "var(--color-ink)", color: "var(--color-bg)" },
  warning: { bg: "#8a6500", color: "#fff" },
};

export function Toaster() {
  const { toasts, removeToast } = useToastsStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 600,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
      }}
    >
      {toasts.map((t) => {
        const s = TYPE_STYLES[t.type];
        return (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            style={{
              padding: "11px 20px",
              background: s.bg,
              color: s.color,
              borderRadius: "var(--radius)",
              fontSize: 13,
              whiteSpace: "nowrap",
              cursor: "pointer",
              animation: "msg-in 0.2s ease",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            }}
          >
            {t.title}
            {t.description && (
              <span style={{ opacity: 0.72, marginLeft: 8 }}>{t.description}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
