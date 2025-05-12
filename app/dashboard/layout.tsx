"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (!userRole) {
      router.push("/login")
    } else if (userRole === "admin") {
      router.push("/admin/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader onMenuClick={() => setOpen(true)} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <DashboardNav />
          </div>
        </aside>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="pr-0">
            <DashboardNav />
          </SheetContent>
        </Sheet>
        <main className="flex w-full flex-col overflow-hidden py-6 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
