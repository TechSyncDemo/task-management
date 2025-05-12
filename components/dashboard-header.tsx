"use client"

import Link from "next/link"
import { Clock, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          <Link href="/" className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>TaskFlow</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
