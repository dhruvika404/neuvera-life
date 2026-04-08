"use client";
import { useToastsStore } from "@/store/toasts.store";

export function useToasts() {
  return useToastsStore();
}
