import { DashboardNav } from "@/components/dashboard-nav";

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (<div className="flex min-h-screen flex-col">
     <header className="h-16 flex items-center px-6 border-b bg-background">
        <h1 className="text-xl font-bold">TaskFlow - My Task</h1>
        {/* Add user info, notifications, etc. here */}
      </header>


    <div className="flex min-h-screen">
        
      <aside className="w-64 border-r bg-background">
        <DashboardNav />
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  </div>
  );
}