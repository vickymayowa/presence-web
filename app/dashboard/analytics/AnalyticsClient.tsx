"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { useCompanyStatsQuery } from "@/lib/queries/presence-queries"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    BarChart3,
    TrendingUp,
    Users,
    Clock,
    Target,
    Zap,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Calendar,
    Search,
    Loader2,
    Activity
} from "lucide-react"
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts'
import { cn } from "@/lib/utils"

const heatmapData = [
    { day: 'Mon', '08am': 65, '10am': 95, '12pm': 80, '02pm': 70, '04pm': 40 },
    { day: 'Tue', '08am': 70, '10am': 98, '12pm': 85, '02pm': 75, '04pm': 45 },
    { day: 'Wed', '08am': 68, '10am': 96, '12pm': 82, '02pm': 72, '04pm': 42 },
    { day: 'Thu', '08am': 72, '10am': 94, '12pm': 80, '02pm': 70, '04pm': 40 },
    { day: 'Fri', '08am': 60, '10am': 85, '12pm': 70, '02pm': 60, '04pm': 30 },
]

const performanceRadar = [
    { subject: 'Attendance', A: 120, B: 110, fullMark: 150 },
    { subject: 'Punctuality', A: 98, B: 130, fullMark: 150 },
    { subject: 'Engagement', A: 86, B: 130, fullMark: 150 },
    { subject: 'Retention', A: 99, B: 100, fullMark: 150 },
    { subject: 'Compliance', A: 85, B: 90, fullMark: 150 },
    { subject: 'Output', A: 65, B: 85, fullMark: 150 },
]

export default function AnalyticsClient() {
    const { user } = useAuth()
    const { data: stats, isLoading } = useCompanyStatsQuery()
    const [timeframe, setTimeframe] = React.useState("90")

    if (!user) return null

    return (
        <div className="space-y-10 pb-20">
            {/* Executive Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 outline-none">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase">
                        <Activity className="size-3" />
                        Intelligence Suite
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Executive Analytics</h1>
                    <p className="text-lg text-muted-foreground font-light max-w-2xl">
                        Unlocking organizational potential through data-driven insights and behavioral patterns.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-border/40 bg-background/50 backdrop-blur-md">
                        <Calendar className="mr-2 h-4 w-4" /> Last {timeframe} Days
                    </Button>
                    <Button className="rounded-2xl h-12 px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                        <Download className="mr-2 h-4 w-4" /> Export Dossier
                    </Button>
                </div>
            </div>

            {/* High-Level Pulse */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Performance Index"
                    value={`${stats?.performanceIndex || 0}%`}
                    trend="+4.2%"
                    icon={Target}
                    color="primary"
                />
                <MetricCard
                    title="Workforce Health"
                    value={`${stats?.attendanceRate || 0}%`}
                    trend="+1.8%"
                    icon={Zap}
                    color="orange"
                />
                <MetricCard
                    title="Active Capital"
                    value={stats?.activeEmployees || 0}
                    trend="-23"
                    trendNegative
                    icon={Users}
                    color="blue"
                />
                <MetricCard
                    title="Policy Integrity"
                    value="Optimal"
                    trend="Stable"
                    icon={ShieldCheck}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trend Chart */}
                <Card className="lg:col-span-2 border-border/40 overflow-hidden bg-secondary/5">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 bg-background/30 p-6">
                        <div className="space-y-1">
                            <CardTitle className="font-serif text-2xl">Attendance Trajectory</CardTitle>
                            <CardDescription>Visualizing organization-wide participation over time</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="rounded-lg bg-primary/10 text-primary border-none">On-site</Badge>
                            <Badge variant="outline" className="rounded-lg bg-blue-100 text-blue-600 border-none">Remote</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.trendData || []}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="attendance"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTrend)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Radar Chart for Holistic View */}
                <Card className="border-border/40 overflow-hidden bg-secondary/5">
                    <CardHeader className="border-b border-border/10 bg-background/30 p-6">
                        <CardTitle className="font-serif text-2xl">Holistic Performance</CardTitle>
                        <CardDescription>Multi-dimensional metric analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceRadar}>
                                <PolarGrid stroke="hsl(var(--border))" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar
                                    name="Current"
                                    dataKey="A"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.5}
                                />
                                <Radar
                                    name="Benchmark"
                                    dataKey="B"
                                    stroke="hsl(var(--muted-foreground))"
                                    fill="hsl(var(--muted-foreground))"
                                    fillOpacity={0.1}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Departmental Efficiency */}
                <Card className="border-border/40 bg-secondary/5">
                    <CardHeader>
                        <CardTitle className="font-serif text-2xl">Departmental Efficiency</CardTitle>
                        <CardDescription>Comparative participation across organizational units</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.departmentStats || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--primary)/5)' }}
                                    contentStyle={{ borderRadius: '12px' }}
                                />
                                <Bar
                                    dataKey="attendanceRate"
                                    fill="hsl(var(--primary))"
                                    radius={[0, 8, 8, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Arrival Intensity Heatmap Placeholder */}
                <Card className="border-border/40 bg-secondary/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-serif text-2xl">Arrival Intensity</CardTitle>
                            <CardDescription>Peak check-in temporal distribution</CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-xl border-amber-200 text-amber-600 bg-amber-50">High Load: 09AM-10AM</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 pt-2">
                            {heatmapData.map((row) => (
                                <div key={row.day} className="flex items-center gap-4">
                                    <span className="w-10 text-xs font-bold text-muted-foreground uppercase">{row.day}</span>
                                    <div className="flex-1 grid grid-cols-5 gap-2">
                                        {[row['08am'], row['10am'], row['12pm'], row['02pm'], row['04pm']].map((val, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "h-8 rounded-lg transition-all hover:scale-105 cursor-pointer",
                                                    val > 90 ? "bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]" :
                                                        val > 70 ? "bg-primary/60" :
                                                            val > 40 ? "bg-primary/30" : "bg-primary/10"
                                                )}
                                                title={`${val}% intensity`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between pl-14 pt-2">
                                <span className="text-[10px] font-bold text-muted-foreground/50">08AM</span>
                                <span className="text-[10px] font-bold text-muted-foreground/50">10AM</span>
                                <span className="text-[10px] font-bold text-muted-foreground/50">12PM</span>
                                <span className="text-[10px] font-bold text-muted-foreground/50">02PM</span>
                                <span className="text-[10px] font-bold text-muted-foreground/50">04PM</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Predictive Analysis Section */}
            <Card className="border-primary/20 bg-primary/[0.02] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="size-32" />
                </div>
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary text-primary-foreground">AI PREDICTION</Badge>
                        <span className="text-xs font-medium text-primary uppercase tracking-widest px-2 py-0.5 border border-primary/20 rounded-full">New Feature</span>
                    </div>
                    <CardTitle className="font-serif text-3xl">Strategic Forecasting</CardTitle>
                    <CardDescription>Predictive workload and attendance modeling for next week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Est. Presence</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-5xl font-serif">88%</h3>
                                <span className="text-green-600 flex items-center mb-2 font-medium">
                                    <ArrowUpRight className="size-4 mr-1" /> 2.1%
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground font-light">
                                Based on historical holiday cycles and recent employee behavior.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Capacity Alert</p>
                            <div className="flex items-end gap-3">
                                <h3 className="text-5xl font-serif">Lagos</h3>
                                <Badge variant="outline" className="mb-3 border-amber-200 text-amber-600 bg-amber-50">94% Load</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-light">
                                High onsite demand expected for Lagos HQ on Wednesday.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <Button className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20">
                                Run Detailed Simulation
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                                Simulation requires 12 months of historical data
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function MetricCard({ title, value, trend, trendNegative, icon: Icon, color }: any) {
    const colorMap: any = {
        primary: "text-primary bg-primary/10",
        orange: "text-orange-600 bg-orange-50",
        blue: "text-blue-600 bg-blue-50",
        green: "text-green-600 bg-green-50"
    }

    return (
        <Card className="border-border/30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl", colorMap[color] || colorMap.primary)}>
                        <Icon className="size-5" />
                    </div>
                    <div className={cn(
                        "flex items-center text-xs font-bold px-2 py-1 rounded-lg",
                        trendNegative ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                    )}>
                        {trendNegative ? <ArrowDownRight className="size-3 mr-1" /> : <ArrowUpRight className="size-3 mr-1" />}
                        {trend}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-serif tracking-tight">{value}</h3>
                </div>
            </CardContent>
        </Card>
    )
}
