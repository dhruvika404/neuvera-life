"use client";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  minWidth?: number | string;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  minWidth = 420,
}: ModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,23,19,.32)",
          zIndex: 300,
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "var(--color-surface)",
          border: "0.5px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: 0,
          zIndex: 400,
          minWidth,
          maxWidth: "calc(100vw - 40px)",
          boxShadow: "0 8px 40px rgba(26,23,19,.14)",
          animation: "msg-in 0.18s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "0.5px solid var(--color-border)",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--color-ink)",
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 12,
                color: "var(--color-ink3)",
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: "14px 24px",
              borderTop: "0.5px solid var(--color-border)",
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Field group helpers ────────────────────────────────────────────────────
export function Fg({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--color-ink3)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function TwoFg({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  padding: "7px 10px",
  border: "0.5px solid var(--color-border)",
  background: "var(--color-bg)",
  borderRadius: "var(--radius)",
  fontSize: 13,
  color: "var(--color-ink)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "var(--font-sans)",
};

export function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input style={fieldStyle} {...props} />;
}

export function FieldSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select style={{ ...fieldStyle, cursor: "pointer" }} {...props} />
  );
}

// ─── Button helpers ─────────────────────────────────────────────────────────
export function BtnPrimary({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: "7px 18px",
        background: "var(--color-gold)",
        color: "#fff",
        border: "none",
        borderRadius: "var(--radius)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

export function BtnGhost({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 18px",
        background: "transparent",
        color: "var(--color-ink3)",
        border: "0.5px solid var(--color-border)",
        borderRadius: "var(--radius)",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-s2)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      {children}
    </button>
  );
}
