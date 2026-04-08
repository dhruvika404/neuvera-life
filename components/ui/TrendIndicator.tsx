import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number; // signed delta, e.g. +12.3 or -4.5
  suffix?: string; // e.g. "%"
}

export function TrendIndicator({ value, suffix = "%" }: TrendIndicatorProps) {
  if (value === 0) {
    return (
      <span
        className="inline-flex items-center gap-0.5 text-xs font-medium"
        style={{ color: "var(--color-ink3)" }}
      >
        <Minus size={11} />
        0{suffix}
      </span>
    );
  }

  const isPositive = value > 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-medium"
      style={{ color: isPositive ? "var(--color-green)" : "var(--color-red)" }}
    >
      {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {isPositive ? "+" : ""}
      {value.toFixed(1)}{suffix}
    </span>
  );
}
