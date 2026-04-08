import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      topBar={<TopBar />}
      sidebar={<Sidebar />}
    >
      {children}
    </AppShell>
  );
}
