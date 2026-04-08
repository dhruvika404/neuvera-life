interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  color?: "gold" | "green" | "amber" | "red" | "blue";
}

const COLOR_MAP: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  gold: "var(--color-gold)",
  green: "var(--color-green)",
  amber: "var(--color-amber)",
  red: "var(--color-red)",
  blue: "var(--color-blue)",
};

export function ProgressBar({ value, className, color = "gold" }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`h-1 w-full rounded-full overflow-hidden ${className ?? ""}`}
      style={{ background: "var(--color-s3)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${clampedValue}%`,
          background: COLOR_MAP[color],
        }}
      />
    </div>
  );
}
