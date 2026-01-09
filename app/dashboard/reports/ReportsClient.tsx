"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    FileText,
    Download,
    Calendar,
    TrendingUp,
    Users,
    AlertTriangle,
    Clock,
    Filter,
    ArrowUpRight
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCompanyStatsQuery, useAttendanceQuery } from "@/lib/queries/presence-queries"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
    const { user } = useAuth()
    const { data: stats } = useCompanyStatsQuery()
    const { data: attendance = [] } = useAttendanceQuery()

    if (!user) return null

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-serif tracking-tight">Reports & Analytics</h2>
                    <p className="text-muted-foreground font-light text-lg">
                        Deep dive into organizational performance and attendance trends.
                    </p>
                </div>
                <Button className="rounded-2xl h-12 px-6 bg-primary text-primary-foreground transition-all hover:scale-[1.02]">
                    <Download className="mr-2 h-4 w-4" /> Export All Data
                </Button>
            </div>

            <div className="flex flex-wrap gap-4">
                <Select defaultValue="this-month">
                    <SelectTrigger className="h-10 w-[180px] rounded-xl border-border/40 bg-secondary/10">
                        <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/40">
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="this-quarter">This Quarter</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" className="h-10 rounded-xl border-border/40 gap-2">
                    <Filter className="h-4 w-4" /> Advanced Filters
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnalyticsSummaryCard
                    title="Avg. Attendance"
                    value={`${stats?.attendanceRate || 0}%`}
                    trend="+2.4%"
                    icon={TrendingUp}
                    description="Compared to last month"
                />
                <AnalyticsSummaryCard
                    title="Late Arrivals"
                    value="14"
                    trend="-12%"
                    trendPositive={true}
                    icon={Clock}
                    description="Total for this period"
                />
                <AnalyticsSummaryCard
                    title="High Performance"
                    value="82%"
                    trend="+5.1%"
                    icon={Users}
                    description="Employees with 100% attendance"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-border/40">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="font-serif text-2xl">Attendance Trends</CardTitle>
                                <CardDescription>Daily breakdown of check-ins</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-xl">
                                Detailed View <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t border-border/10">
                        <div className="text-center space-y-2">
                            < TrendingUp className="mx-auto h-12 w-12 text-muted-foreground/20" />
                            <p className="text-muted-foreground font-light italic">Interactive chart coming soon...</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/40">
                    <CardHeader>
                        <CardTitle className="font-serif text-2xl">Available Reports</CardTitle>
                        <CardDescription>Generated documents for your organization</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/30">
                            {[
                                { name: "December Attendance Summary", size: "1.2 MB", date: "Jan 1, 2026" },
                                { name: "Q4 Performance Review", size: "4.5 MB", date: "Dec 31, 2025" },
                                { name: "Payroll Compliance Export", size: "840 KB", date: "Dec 30, 2025" },
                                { name: "Department Load Analysis", size: "2.1 MB", date: "Dec 15, 2025" }
                            ].map((report, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <FileText className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{report.name}</p>
                                            <p className="text-xs text-muted-foreground font-light">{report.date} • {report.size}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {stats?.lateArrivals && stats.lateArrivals.length > 0 && (
                <Card className="border-orange-200 bg-orange-50/20">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-lg font-serif">Anomaly Detection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground font-light mb-4">
                            We've detected {stats.lateArrivals.length} unusual attendance patterns in the Engineering department.
                        </p>
                        <Button variant="outline" size="sm" className="rounded-xl border-orange-200 text-orange-700 hover:bg-orange-100/50">
                            Review Anomalies
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function AnalyticsSummaryCard({ title, value, trend, trendPositive = true, icon: Icon, description }: any) {
    return (
        <Card className="border-border/30 overflow-hidden group hover:border-primary/20 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-secondary/30 rounded-2xl group-hover:bg-primary/10 transition-colors">
                        <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <Badge className={`rounded-lg py-1 ${trendPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend}
                    </Badge>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
                    <p className="text-4xl font-serif tracking-tight">{value}</p>
                    <p className="text-xs text-muted-foreground font-light">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
