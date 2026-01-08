import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { DashboardLayoutClient } from "@/components/dashboard-layout-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
  description: "Manage your team and attendance on the Presence dashboard.",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </AuthProvider>
  )
}
