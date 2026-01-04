"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Clock,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    Building2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { companyStats, departments, users } from "@/lib/mock-data"

export default function ReportsPage() {
    const { user } = useAuth()
    const [timeRange, setTimeRange] = React.useState("month")
    const [departmentFilter, setDepartmentFilter] = React.useState("all")

    if (!user) return null

    // Mock data for charts
    const weeklyData = [
        { day: 'Mon', present: 92, late: 5, absent: 3 },
        { day: 'Tue', present: 95, late: 3, absent: 2 },
        { day: 'Wed', present: 88, late: 8, absent: 4 },
        { day: 'Thu', present: 94, late: 4, absent: 2 },
        { day: 'Fri', present: 85, late: 10, absent: 5 },
    ]

    const departmentStats = departments.map(dept => ({
        name: dept.name,
        attendance: Math.floor(Math.random() * 15) + 85,
        employees: dept.headCount,
    }))

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
                        {user.role === 'manager' ? 'Team Reports' : 'Analytics & Reports'}
                    </h1>
                    <p className="text-muted-foreground font-light mt-1">
                        {user.role === 'manager'
                            ? 'View detailed attendance analytics for your team'
                            : 'Comprehensive attendance analytics and insights'
                        }
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-36 h-10 rounded-xl border-border/40">
                            <Calendar className="size-4 mr-2 text-muted-foreground" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="rounded-xl">
                        <Download className="size-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <Card className="border-border/30">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    Avg Attendance
                                </p>
                                <p className="text-3xl font-serif mt-2">{companyStats.averageAttendance}%</p>
                                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                    <TrendingUp className="size-4" />
                                    <span>+2.5%</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="size-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    Late Arrivals
                                </p>
                                <p className="text-3xl font-serif mt-2">4.2%</p>
                                <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                                    <TrendingUp className="size-4" />
                                    <span>+0.8%</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Clock className="size-5 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    Leaves Taken
                                </p>
                                <p className="text-3xl font-serif mt-2">23</p>
                                <div className="flex items-center gap-1 mt-2 text-blue-600 text-sm">
                                    <TrendingDown className="size-4" />
                                    <span>-12%</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Calendar className="size-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    Remote Days
                                </p>
                                <p className="text-3xl font-serif mt-2">38%</p>
                                <div className="flex items-center gap-1 mt-2 text-purple-600 text-sm">
                                    <TrendingUp className="size-4" />
                                    <span>+5%</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Users className="size-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Attendance Chart */}
                <Card className="lg:col-span-2 border-border/30">
                    <CardHeader className="border-b bg-secondary/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-serif">Weekly Attendance</CardTitle>
                                <CardDescription>Daily attendance breakdown</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold">
                                Last 5 Days
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Simple bar chart visualization */}
                        <div className="space-y-4">
                            {weeklyData.map((data) => (
                                <div key={data.day} className="flex items-center gap-4">
                                    <span className="w-10 text-sm font-medium text-muted-foreground">{data.day}</span>
                                    <div className="flex-1 flex gap-1 h-8">
                                        <div
                                            className="bg-green-500 rounded-l-md flex items-center justify-center text-white text-xs font-bold transition-all hover:opacity-80"
                                            style={{ width: `${data.present}%` }}
                                        >
                                            {data.present}%
                                        </div>
                                        <div
                                            className="bg-orange-500 flex items-center justify-center text-white text-xs font-bold transition-all hover:opacity-80"
                                            style={{ width: `${data.late}%` }}
                                        >
                                            {data.late > 5 && `${data.late}%`}
                                        </div>
                                        <div
                                            className="bg-red-500 rounded-r-md flex items-center justify-center text-white text-xs font-bold transition-all hover:opacity-80"
                                            style={{ width: `${data.absent}%` }}
                                        >
                                            {data.absent > 3 && `${data.absent}%`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-6 mt-6 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded bg-green-500" />
                                <span>Present</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded bg-orange-500" />
                                <span>Late</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded bg-red-500" />
                                <span>Absent</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performers */}
                <Card className="border-border/30">
                    <CardHeader className="border-b bg-secondary/10">
                        <CardTitle className="text-xl font-serif">Top Performers</CardTitle>
                        <CardDescription>Highest attendance scores</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {users.slice(0, 5).map((person, i) => (
                            <div
                                key={person.id}
                                className={`flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors ${i !== 4 ? 'border-b border-border/30' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-sm">{person.firstName} {person.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{person.department}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    {100 - i * 2}%
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Department Breakdown */}
            <Card className="border-border/30">
                <CardHeader className="border-b bg-secondary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-serif">Department Performance</CardTitle>
                            <CardDescription>Attendance rates by department</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                            <Filter className="size-4 mr-1" />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/30">
                        {departmentStats.map((dept) => (
                            <div key={dept.name} className="p-6 hover:bg-secondary/10 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Building2 className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{dept.name}</h3>
                                            <p className="text-xs text-muted-foreground">{dept.employees} employees</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${dept.attendance >= 95 ? 'bg-green-50 text-green-600 border-green-200' :
                                                dept.attendance >= 90 ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                    'bg-orange-50 text-orange-600 border-orange-200'
                                            }`}
                                    >
                                        {dept.attendance}%
                                    </Badge>
                                </div>
                                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${dept.attendance >= 95 ? 'bg-green-500' :
                                                dept.attendance >= 90 ? 'bg-blue-500' : 'bg-orange-500'
                                            }`}
                                        style={{ width: `${dept.attendance}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <BarChart3 className="size-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Detailed Report</h3>
                                <p className="text-sm text-muted-foreground">Full analytics breakdown</p>
                            </div>
                        </div>
                        <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                </Card>

                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <Download className="size-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Export Data</h3>
                                <p className="text-sm text-muted-foreground">Download as CSV/Excel</p>
                            </div>
                        </div>
                        <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                </Card>

                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Calendar className="size-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Schedule Report</h3>
                                <p className="text-sm text-muted-foreground">Set up auto-reports</p>
                            </div>
                        </div>
                        <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
