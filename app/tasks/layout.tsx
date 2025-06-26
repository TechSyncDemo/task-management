import { DashboardNav } from "@/components/dashboard-nav";

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background">
        <DashboardNav />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}