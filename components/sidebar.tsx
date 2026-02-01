"use client"
import {
  Calendar,
  LayoutDashboard,
  MapPin,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight,
  Clock,
  MessageSquare,
  FileText,
  CheckSquare,
  BarChart3
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Clock, label: "Attendance", href: "/dashboard/attendance" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: MessageSquare, label: "Announcements", href: "/dashboard/announcements" },
]

const hrItems = [
  { icon: FileText, label: "Leaves", href: "/dashboard/leaves" },
  { icon: CheckSquare, label: "Approvals", href: "/dashboard/approvals" },
]

const adminItems = [
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: MapPin, label: "Branches", href: "/dashboard/branches" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const { user } = useAuth()

  if (!user) return null

  const isManagement = ['ceo', 'hr', 'manager'].includes(user.role)
  const isAdmin = ['ceo', 'hr'].includes(user.role)

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <span className="font-serif text-xl tracking-tight group-data-[collapsible=icon]:hidden">Presence</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hrItems.filter(item => item.label === 'Leaves' || isManagement).map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="px-2">
              <Avatar className="size-8">
                <AvatarImage src={user.avatar || "/placeholder-user.jpg"} />
                <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role} • {user.department}</span>
              </div>
              <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
