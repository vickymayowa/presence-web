"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { BuiltWithPresence } from "@/components/built-with-presence"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthProvider } from "@/lib/auth-context"
import { Bell } from "lucide-react"
import { GlobalSearch } from "@/components/global-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notification-center"
import { useAuth } from "@/lib/auth-context"
import { ShieldCheck } from "lucide-react"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth()
  const now = new Date()
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening"

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
            <div className="relative flex aspect-square size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl">
              <ShieldCheck className="size-10 animate-bounce" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-serif text-3xl tracking-tight">Presence</h2>
            <div className="flex items-center gap-2">
              <div className="size-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="size-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="size-1 rounded-full bg-primary animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If not loading but no user, the AuthProvider's router.replace will handle it,
  // but we should still return null to avoid rendering the dashboard layout
  if (!user) return null

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-xl hidden sm:block">{greeting}</h1>
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-widest border-green-200 text-green-600 bg-green-50"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                Online
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <GlobalSearch />
              <ThemeToggle />
              <NotificationCenter />

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 text-xs font-medium text-muted-foreground">
                <span>
                  {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span>
                  {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </SidebarInset>
      <BuiltWithPresence />
    </SidebarProvider>
  )
}
