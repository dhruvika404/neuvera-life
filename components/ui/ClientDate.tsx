"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe date formatter that only renders on the client
 * to avoid SSR mismatches with user locales/timezones.
 */
export function ClientDate() {
  // useSyncExternalStore is the React 18+ recommended pattern for
  // client-only values — avoids the setState-in-effect lint error
  // while still preventing SSR hydration mismatches.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <span className="inline-block min-w-[140px]" />;
  }

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return <span>{dateStr}</span>;
}
