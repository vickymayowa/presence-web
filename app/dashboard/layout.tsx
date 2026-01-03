import type React from "react"
// import { DashboardSidebar } from "@/components/ui/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {/* <DashboardSidebar /> */}
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="font-serif text-xl">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                Live Status: Active
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
