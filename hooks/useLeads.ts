"use client";
import useSWR, { mutate } from "swr";
import type { Lead } from "@/types/lead";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface UseLeadsOptions {
  stage?: string;
  icpId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const params = new URLSearchParams();
  if (options.stage) params.set("stage", options.stage);
  if (options.icpId) params.set("icpId", options.icpId);
  if (options.search) params.set("search", options.search);
  if (options.limit) params.set("limit", String(options.limit));
  if (options.offset) params.set("offset", String(options.offset));

  const key = `/api/leads?${params.toString()}`;

  const { data, error, isLoading } = useSWR<{ leads: Lead[]; total: number }>(
    key,
    fetcher
  );

  return {
    leads: data?.leads ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate: () => mutate(key),
  };
}
