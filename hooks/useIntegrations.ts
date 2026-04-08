"use client";
import useSWR, { mutate } from "swr";
import type { Integration } from "@/types/integration";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface IntegrationsData {
  integrations: Integration[];
  connectedCount: number;
  disconnectedCount: number;
  estimatedMonthlyCost: number;
}

export function useIntegrations() {
  const key = "/api/integrations";
  const { data, error, isLoading } = useSWR<IntegrationsData>(key, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    integrations: data?.integrations ?? [],
    connectedCount: data?.connectedCount ?? 0,
    disconnectedCount: data?.disconnectedCount ?? 0,
    estimatedMonthlyCost: data?.estimatedMonthlyCost ?? 0,
    isLoading,
    error,
    mutate: () => mutate(key),
  };
}
