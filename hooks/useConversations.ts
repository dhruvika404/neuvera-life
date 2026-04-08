"use client";
import useSWR, { mutate } from "swr";
import type { Conversation } from "@/types/conversation";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useConversations(agentType?: "prospecting" | "engagement") {
  const params = agentType ? `?agentType=${agentType}` : "";
  const key = `/api/conversations${params}`;

  const { data, error, isLoading } = useSWR<{ conversations: Conversation[] }>(
    key,
    fetcher
  );

  return {
    conversations: data?.conversations ?? [],
    isLoading,
    error,
    mutate: () => mutate(key),
  };
}
