"use client";
import { Toaster } from "@/components/ui/Toaster";

interface AppShellProps {
  children: React.ReactNode;
  topBar: React.ReactNode;
  sidebar: React.ReactNode;
}

export function AppShell({ children, topBar, sidebar }: AppShellProps) {
  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Topbar — fixed height across full width */}
      <div
        className="fixed top-0 left-0 right-0 z-40"
        style={{ height: "var(--topbar-h)" }}
      >
        {topBar}
      </div>

      {/* Sidebar — fixed left column below topbar */}
      <div
        className="fixed left-0 bottom-0 z-30 flex flex-col"
        style={{
          top: "var(--topbar-h)",
          width: "var(--sidebar-w)",
        }}
      >
        {sidebar}
      </div>

      {/* Main content area */}
      <main
        className="absolute inset-0 overflow-y-auto"
        style={{
          top: "var(--topbar-h)",
          left: "var(--sidebar-w)",
        }}
      >
        {children}
      </main>

      {/* Global toast notifications */}
      <Toaster />
    </div>
  );
}
