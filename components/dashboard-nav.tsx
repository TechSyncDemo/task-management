"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, CheckSquare, Clock, FolderKanban, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"

interface NavProps {
  isAdmin?: boolean
}

export function DashboardNav({ isAdmin = false }: NavProps) {
  const pathname = usePathname()

  const staffLinks = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Tasks",
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: FolderKanban,
    },
    {
      title: "Time Tracking",
      href: "/time-tracking",
      icon: Clock,
    },
  ]

  const adminLinks = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      title: "Tasks",
      href: "/admin/tasks",
      icon: CheckSquare,
    },
    {
      title: "Team",
      href: "/admin/team",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ]

  const links = isAdmin ? adminLinks : staffLinks

  return (
    <nav className="grid items-start gap-2">
      {links.map((link, index) => (
        <Link key={index} href={link.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === link.href ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            <span>{link.title}</span>
          </span>
        </Link>
      ))}
      <Link href="/settings">
        <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </span>
      </Link>
      <Link href="/login">
        <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </span>
      </Link>
    </nav>
  )
}
