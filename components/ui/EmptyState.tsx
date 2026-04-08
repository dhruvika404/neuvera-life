import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className ?? ""}`}
    >
      {icon && (
        <div
          className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: "var(--color-s2)",
            color: "var(--color-ink3)",
          }}
        >
          {icon}
        </div>
      )}
      <h3
        className="text-sm font-semibold mb-1"
        style={{ color: "var(--color-ink)" }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-xs max-w-xs"
          style={{ color: "var(--color-ink3)" }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
