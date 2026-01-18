"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogoutModal } from "@/components/logout-modal"
import { useSessionCheck } from "@/hooks/use-session-check"
import {
    Calendar,
    LayoutDashboard,
    MapPin,
    Users,
    Settings,
    ShieldCheck,
    ChevronRight,
    Clock,
    FileText,
    Bell,
    BarChart3,
    Building2,
    UserCheck,
    Briefcase,
    LogOut,
    User,
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
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

type NavItem = {
    icon: React.ElementType
    label: string
    href: string
    badge?: number
}

// Navigation items by role
const navigationConfig: Record<UserRole, { general: NavItem[]; admin?: NavItem[] }> = {
    staff: {
        general: [
            { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
            { icon: Clock, label: "Attendance", href: "/dashboard/attendance" },
            { icon: Calendar, label: "My Schedule", href: "/dashboard/schedule" },
            { icon: FileText, label: "Leave Requests", href: "/dashboard/leaves" },
            { icon: User, label: "My Profile", href: "/dashboard/profile" },
        ],
    },
    manager: {
        general: [
            { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
            { icon: Clock, label: "Attendance", href: "/dashboard/attendance" },
            { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
            { icon: FileText, label: "Leave Requests", href: "/dashboard/leaves" },
        ],
        admin: [
            { icon: Users, label: "My Team", href: "/dashboard/team" },
            { icon: UserCheck, label: "Approvals", href: "/dashboard/approvals", badge: 3 },
            { icon: BarChart3, label: "Team Reports", href: "/dashboard/reports" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        ],
    },
    hr: {
        general: [
            { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
            { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
            { icon: Users, label: "Employees", href: "/dashboard/employees" },
            { icon: Clock, label: "Attendance", href: "/dashboard/attendance" },
            { icon: FileText, label: "Leave Management", href: "/dashboard/leaves" },
        ],
        admin: [
            { icon: Building2, label: "Departments", href: "/dashboard/departments" },
            { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
            { icon: ShieldCheck, label: "Compliance", href: "/dashboard/compliance" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        ],
    },
    ceo: {
        general: [
            { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
            { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
            { icon: Building2, label: "Departments", href: "/dashboard/departments" },
            { icon: Users, label: "All Employees", href: "/dashboard/employees" },
        ],
        admin: [
            { icon: Briefcase, label: "Executive View", href: "/dashboard/executive" },
            { icon: FileText, label: "Reports", href: "/dashboard/reports" },
            { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
            { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        ],
    },
}

const navItemBase = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
]

const roleLabels: Record<UserRole, string> = {
    ceo: "Chief Executive",
    hr: "HR Director",
    manager: "Manager",
    staff: "Staff Member",
}

const roleColors: Record<UserRole, string> = {
    ceo: "bg-purple-100 text-purple-700",
    hr: "bg-blue-100 text-blue-700",
    manager: "bg-green-100 text-green-700",
    staff: "bg-gray-100 text-gray-700",
}

export function DashboardSidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const { showLogoutModal, setShowLogoutModal, logoutReason } = useSessionCheck()

    const handleLogout = () =>
        setShowLogoutModal(current => current ? false : true)

    const handleConfirmLogout = () => {
        setShowLogoutModal(false)
        logout()
        window.location.href = "/auth/login"
    }
    // ✅ Hook ALWAYS runs
    const initials = React.useMemo(() => {
        if (!user) return ""
        const first = user.firstName?.[0] ?? ""
        const last = user.lastName?.[0] ?? ""
        return (first + last).toUpperCase()
    }, [user])

    // ✅ Guard AFTER all hooks
    if (!user) return null

    const navConfig = navigationConfig[user.role] || navigationConfig.staff

    return (
        <>
            <Sidebar variant="inset" collapsible="icon">
                <SidebarHeader className="p-4">
                    <Link href="/dashboard" className="flex items-center gap-3 px-2">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <ShieldCheck className="size-5" />
                        </div>
                        <span className="font-serif text-xl tracking-tight group-data-[collapsible=icon]:hidden">
                            Presence
                        </span>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    {/* General Navigation */}
                    <SidebarGroup>
                        <SidebarGroupLabel>General</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navConfig.general.map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.label}
                                            isActive={pathname === item.href}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Admin Navigation (for roles with admin access) */}
                    {navConfig.admin && (
                        <SidebarGroup>
                            <SidebarGroupLabel>
                                {user.role === 'ceo' ? 'Executive' : user.role === 'hr' ? 'HR Admin' : 'Management'}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navConfig.admin.map((item) => (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.label}
                                                isActive={pathname === item.href}
                                            >
                                                <Link href={item.href} className="relative">
                                                    <item.icon />
                                                    <span>{item.label}</span>
                                                    {'badge' in item && item.badge && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-auto size-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground group-data-[collapsible=icon]:hidden"
                                                        >
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                </Link>
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
                            <SidebarMenuButton size="lg" className="px-2" asChild>
                                <Link href="/dashboard/profile">
                                    <Avatar className="size-8">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-0.5 text-left group-data-[collapsible=icon]:hidden">
                                        <span className="text-sm font-medium">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0 w-fit ${roleColors[user.role]}`}
                                        >
                                            {roleLabels[user.role]}
                                        </Badge>
                                    </div>
                                    <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Logout"
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <LogOut className="size-4" />
                                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleConfirmLogout}
                onCancel={() => setShowLogoutModal(false)}
                title="Sign Out"
                description="Are you sure you want to sign out? You'll need to sign in again to access your attendance records."
                reason="manual"
            />
        </>
    )
}
