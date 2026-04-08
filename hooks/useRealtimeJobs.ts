"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PipelineJobDto } from "@/types/dtos";
import { mapPipelineJob } from "@/lib/utils/mappers";
import type { Database } from "@/types/database";

type JobRow = Database["public"]["Tables"]["pipeline_jobs"]["Row"];

/**
 * Subscribes to pipeline_jobs INSERT and UPDATE events for the given org.
 * Returns a live list of the most recently changed jobs (up to `limit`).
 *
 * Usage:
 *   const { jobs } = useRealtimeJobs(orgId);
 */
export function useRealtimeJobs(organizationId: string | null, limit = 20) {
  const [jobs, setJobs] = useState<PipelineJobDto[]>([]);

  useEffect(() => {
    if (!organizationId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`pipeline_jobs:${organizationId}`)
      .on<JobRow>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pipeline_jobs",
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          const row = payload.new as JobRow;
          if (!row?.id) return;
          const updated = mapPipelineJob(row);
          setJobs((prev) => {
            const without = prev.filter((j) => j.id !== updated.id);
            return [updated, ...without].slice(0, limit);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organizationId, limit]);

  return { jobs };
}
