"use client";
import { useWorkspaceStore } from "@/store/workspace.store";

export function useLibrary() {
  const { libraryPath, navigateLibrary, navigateLibraryBack, resetLibraryPath } =
    useWorkspaceStore();

  const currentFolder = libraryPath[libraryPath.length - 1] ?? null;
  const isAtRoot = libraryPath.length === 0;

  return {
    libraryPath,
    currentFolder,
    isAtRoot,
    navigate: navigateLibrary,
    back: navigateLibraryBack,
    reset: resetLibraryPath,
  };
}
