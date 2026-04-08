/**
 * Format a number with K/M suffixes for display in KPI cards.
 * e.g. 1234 → "1.2K", 1200000 → "1.2M"
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Format a percentage value for display.
 * e.g. 0.1234 → "12.3%"
 */
export function formatPercent(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

/**
 * Format a date as relative time (e.g. "2 hours ago").
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = Date.now();
  const diff = now - d.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Truncate a string to a maximum length.
 */
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

/**
 * Pluralize a word based on count.
 * e.g. pluralize("lead", 1) → "lead", pluralize("lead", 3) → "leads"
 */
export function pluralize(word: string, count: number, plural?: string): string {
  if (count === 1) return word;
  return plural ?? `${word}s`;
}
