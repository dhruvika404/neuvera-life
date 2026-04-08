"use client";
import useSWR, { mutate } from "swr";
import type { Campaign } from "@/types/campaign";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCampaigns() {
  const key = "/api/campaigns";
  const { data, error, isLoading } = useSWR<{ campaigns: Campaign[] }>(
    key,
    fetcher
  );

  return {
    campaigns: data?.campaigns ?? [],
    isLoading,
    error,
    mutate: () => mutate(key),
  };
}
