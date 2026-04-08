"use client";
import { useWorkspaceStore } from "@/store/workspace.store";

export function useWorkspace() {
  return useWorkspaceStore();
}
