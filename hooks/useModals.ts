"use client";
import { useModalsStore } from "@/store/modals.store";

export function useModals() {
  return useModalsStore();
}
