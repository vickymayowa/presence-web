"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    ArrowUpRight,
    Clock,
    MapPin,
    Zap,
    Users,
    TrendingUp,
    Building2,
    UserCheck,
    Calendar,
    FileText,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react"
import { AttendanceModal } from "@/components/attendance-modal"
import { useAuth } from "@/lib/auth-context"
import {
    useAttendanceQuery,
    useCompanyStatsQuery,
    useUsersQuery
} from "@/lib/queries/presence-queries"

export default function DashboardPage() {
    const { user } = useAuth()
    const [attendanceModal, setAttendanceModal] = React.useState<{ isOpen: boolean; type: "in" | "out" }>({
        isOpen: false,
        type: "in",
    })

    const { data: attendanceRecords = [], isLoading: isAttendanceLoading } = useAttendanceQuery()
    const { data: stats, isLoading: isStatsLoading } = useCompanyStatsQuery()
    const { data: allUsers = [], isLoading: isUsersLoading } = useUsersQuery()

    if (!user) return null
    if (isAttendanceLoading || isStatsLoading || isUsersLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    // Get today's attendance for current user
    const today = new Date().toISOString().split('T')[0]
    const todayAttendance = attendanceRecords.find(r => r.userId === user.id && r.date === today)
    const isCheckedIn = todayAttendance?.checkIn && !todayAttendance?.checkOut

    // Render different dashboards based on role
    const renderDashboard = () => {
        switch (user.role) {
            case 'ceo':
                return <CEODashboard stats={stats} />
            case 'hr':
                return <HRDashboard stats={stats} users={allUsers} />
            case 'manager':
                return <ManagerDashboard userId={user.id} users={allUsers} attendance={attendanceRecords} />
            default:
                return (
                    <StaffDashboard
                        user={user}
                        todayAttendance={todayAttendance}
                        isCheckedIn={isCheckedIn}
                        onCheckAction={(type) => setAttendanceModal({ isOpen: true, type })}
                    />
                )
        }
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight">
                    Welcome back,{" "}
                    <span className="text-muted-foreground/40 italic">{user.firstName}.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-light max-w-2xl">
                    {user.role === 'ceo' && "Your executive dashboard shows company-wide attendance and performance."}
                    {user.role === 'hr' && "Manage employee attendance, leaves, and ensure compliance across departments."}
                    {user.role === 'manager' && "Track your team's attendance and manage pending approval requests."}
                    {user.role === 'staff' && "Your attendance is tracked and verified. Check in to start your day."}
                </p>
            </div>

            {renderDashboard()}

            <AttendanceModal
                isOpen={attendanceModal.isOpen}
                onClose={() => setAttendanceModal({ ...attendanceModal, isOpen: false })}
                type={attendanceModal.type}
            />
        </div>
    )
}

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell
} from 'recharts'

function CEODashboard({ stats }: { stats: any }) {
    const data = stats?.trendData || [
        { name: 'Mon', attendance: 0 },
        { name: 'Tue', attendance: 0 },
        { name: 'Wed', attendance: 0 },
        { name: 'Thu', attendance: 0 },
        { name: 'Fri', attendance: 0 },
        { name: 'Sat', attendance: 0 },
        { name: 'Sun', attendance: 0 },
    ]

    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Presence"
                    value={`${stats?.attendanceRate || 0}%`}
                    description="Average daily attendance"
                    icon={UserCheck}
                    trend={+2.5}
                />
                <StatsCard
                    title="Active Employees"
                    value={stats?.activeEmployees || 0}
                    description="Across all departments"
                    icon={Users}
                />
                <StatsCard
                    title="Departments"
                    value={stats?.departments || 0}
                    description="Operational units"
                    icon={Building2}
                />
                <StatsCard
                    title="Performance Index"
                    value={stats?.performanceIndex || "0.0"}
                    description="Organization health score"
                    icon={TrendingUp}
                    trend={+1.2}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-border/40 bg-secondary/10 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="font-serif text-2xl">Company Performance</CardTitle>
                            <CardDescription>Attendance trends over the last 7 days</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-xl">
                            Details <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="attendance"
                                    radius={[6, 6, 0, 0]}
                                    fill="hsl(var(--primary))"
                                    barSize={40}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={index === data.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.6)'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-border/40">
                    <CardHeader>
                        <CardTitle className="font-serif text-xl">Top Departments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {(stats?.departmentStats || []).length > 0 ? (
                            stats.departmentStats.map((dept: any) => (
                                <div key={dept.name} className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{dept.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {dept.attendanceRate}% attendance rate
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-lg ${dept.attendanceRate >= 90 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                                    >
                                        {dept.attendanceRate >= 90 ? 'Optimal' : 'Needs Review'}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground italic text-sm">
                                No department data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function HRDashboard({ stats, users }: { stats: any; users: any[] }) {
    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Morning Shift"
                    value="42"
                    description="Checked in before 9:00 AM"
                    icon={Clock}
                    trend={+5}
                />
                <StatsCard
                    title="Late Arrivals"
                    value="4"
                    description="Requires follow-up"
                    icon={AlertCircle}
                    trend={-2}
                />
                <StatsCard
                    title="Leave Requests"
                    value="12"
                    description="Pending approvals"
                    icon={Calendar}
                    className="bg-primary/5"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-border/40">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-serif text-2xl">Recent Activity</CardTitle>
                        <Button variant="outline" size="sm" className="rounded-xl">View All</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/30">
                            {users.slice(0, 5).map((user) => (
                                <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.firstName} {user.lastName} checked in
                                        </p>
                                        <p className="text-xs text-muted-foreground italic">
                                            Today at 8:{Math.floor(Math.random() * 50).toString().padStart(2, '0')} AM • {user.department}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="rounded-lg bg-green-50 text-green-700 border-green-200">
                                        On-time
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border/40 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/70">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button className="w-full justify-start rounded-xl h-11" variant="ghost">
                                <Users className="mr-2 h-4 w-4" /> Add New Employee
                            </Button>
                            <Button className="w-full justify-start rounded-xl h-11" variant="ghost">
                                <FileText className="mr-2 h-4 w-4" /> Generate Report
                            </Button>
                            <Button className="w-full justify-start rounded-xl h-11" variant="ghost">
                                <Calendar className="mr-2 h-4 w-4" /> Company Holidays
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function ManagerDashboard({ userId, users, attendance }: { userId: string; users: any[]; attendance: any[] }) {
    const teamMembers = users.filter(u => u.managerId === userId)

    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Team Size"
                    value={teamMembers.length}
                    description="Active reports"
                    icon={Users}
                />
                <StatsCard
                    title="Present Now"
                    value={teamMembers.length - 2}
                    description="Currently working"
                    icon={UserCheck}
                />
                <StatsCard
                    title="Team Health"
                    value="98%"
                    description="Attendance score"
                    icon={Zap}
                />
                <StatsCard
                    title="Pending"
                    value="3"
                    description="Action required"
                    icon={FileText}
                    className="bg-orange-50/50"
                />
            </div>

            <Card className="border-border/30 overflow-hidden">
                <CardHeader className="bg-secondary/10 border-b">
                    <CardTitle className="font-serif text-xl">My Team Members</CardTitle>
                    <CardDescription>Real-time status of your direct reports</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/30">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center gap-4 p-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{member.firstName} {member.lastName}</p>
                                    <p className="text-xs text-muted-foreground">{member.position}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-medium">Checked in</span>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function StaffDashboard({
    user,
    todayAttendance,
    isCheckedIn,
    onCheckAction
}: {
    user: any;
    todayAttendance: any;
    isCheckedIn: boolean;
    onCheckAction: (type: "in" | "out") => void
}) {
    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-border/40 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                    <CardContent className="p-8 relative">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="space-y-4">
                                <div className="p-3 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <Clock className="text-primary size-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif mb-1">
                                        {isCheckedIn ? "Time to wrap up?" : "Ready to start your day?"}
                                    </h3>
                                    <p className="text-muted-foreground font-light">
                                        Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                {!isCheckedIn ? (
                                    <Button
                                        size="lg"
                                        className="rounded-2xl h-16 px-8 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                                        onClick={() => onCheckAction("in")}
                                    >
                                        <Zap className="mr-2 size-5 fill-current" />
                                        Verify Check-in
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-2xl h-16 px-8 text-lg font-semibold border-border/40 hover:bg-secondary/50 transition-all"
                                        onClick={() => onCheckAction("out")}
                                    >
                                        <ArrowUpRight className="mr-2 size-5" />
                                        Verify Check-out
                                    </Button>
                                )}
                                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                                    Biometric verification required
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40 bg-secondary/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Today's Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100/50 rounded-lg"><Clock className="size-4 text-green-600" /></div>
                                <span className="text-sm font-medium">Check-in</span>
                            </div>
                            <span className="text-sm font-serif">{todayAttendance?.checkIn || "--:--"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100/50 rounded-lg"><Zap className="size-4 text-orange-600" /></div>
                                <span className="text-sm font-medium">Work Mode</span>
                            </div>
                            <Badge variant="secondary" className="rounded-lg capitalize">{todayAttendance?.workMode || "Not active"}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100/50 rounded-lg"><UserCheck className="size-4 text-blue-600" /></div>
                                <span className="text-sm font-medium">Status</span>
                            </div>
                            <Badge variant="outline" className="rounded-lg bg-green-50 text-green-700 border-green-200 uppercase text-[10px] font-bold">
                                {isCheckedIn ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className = ""
}: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    trend?: number;
    className?: string;
}) {
    return (
        <Card className={`border-border/30 overflow-hidden relative hover:shadow-md transition-shadow ${className}`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-secondary/30 rounded-xl group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    {trend && (
                        <Badge variant="secondary" className={`rounded-lg ${trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </Badge>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
                    <p className="text-3xl font-serif tracking-tight">{value}</p>
                    <p className="text-xs text-muted-foreground font-light">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
