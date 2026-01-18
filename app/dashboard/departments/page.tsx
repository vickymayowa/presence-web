"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Building2, Users, TrendingUp, MapPin, Filter, Plus, UserCheck } from "lucide-react"
import { DepartmentModal } from "@/components/department-modal"
import { useAuth } from "@/lib/auth-context"
import {
    useDepartmentsQuery,
    useCompanyStatsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation
} from "@/lib/queries/presence-queries"
import { toast } from "sonner"

const chartConfig = {
    present: { label: "Present", color: "hsl(var(--color-chart-1))" },
    absent: { label: "Absent", color: "hsl(var(--color-chart-5))" },
    late: { label: "Late", color: "hsl(var(--color-chart-4))" },
    onsite: { label: "On-site", color: "hsl(var(--color-chart-1))" },
    hybrid: { label: "Hybrid", color: "hsl(var(--color-chart-2))" },
    remote: { label: "Remote", color: "hsl(var(--color-chart-3))" },
}

export default function DepartmentsPage() {
    const { user } = useAuth()
    const { data: statsData, isLoading: isStatsLoading } = useCompanyStatsQuery()
    const { data: departments = [], isLoading: isDeptsLoading } = useDepartmentsQuery()
    const createMutation = useCreateDepartmentMutation()
    const updateMutation = useUpdateDepartmentMutation()

    const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")
    const [editingDept, setEditingDept] = useState<any | undefined>()

    const isAuthorized = user?.role === 'ceo' || user?.role === 'hr'

    const handleNewDepartment = () => {
        if (!isAuthorized) return
        setModalMode("create")
        setEditingDept(undefined)
        setIsModalOpen(true)
    }

    const handleEditDepartment = (dept: any) => {
        if (!isAuthorized) return
        setModalMode("edit")
        setEditingDept({
            id: dept.id,
            name: dept.name,
            managerId: dept.managerId,
            description: dept.description,
        })
        setIsModalOpen(true)
    }

    const handleSubmitDepartment = async (data: any) => {
        try {
            if (modalMode === "create") {
                await createMutation.mutateAsync(data)
                toast.success("Department created successfully")
            } else {
                await updateMutation.mutateAsync({ id: editingDept.id, data })
                toast.success("Department updated successfully")
            }
            setIsModalOpen(false)
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const selectedDeptData = departments.find((d: any) => d.id === selectedDeptId)

    // Calculate/Get aggregate stats
    const totalEmployees = statsData?.totalEmployees || departments.reduce((acc: number, d: any) => acc + (d.employees || 0), 0)
    const activeToday = statsData?.activeEmployees || departments.reduce((acc: number, d: any) => acc + (d.presentToday || 0), 0)
    const avgAttendance = statsData?.attendanceRate || (departments.length > 0
        ? (departments.reduce((acc: number, d: any) => acc + (parseFloat(d.rate) || 0), 0) / departments.length).toFixed(1)
        : "0")

    const stats = [
        { label: "Total Departments", value: departments.length.toString(), icon: Building2, color: "text-blue-600" },
        { label: "Total Employees", value: totalEmployees.toString(), icon: Users, color: "text-green-600" },
        { label: "Active Today", value: activeToday.toString(), icon: UserCheck, color: "text-orange-600" },
        { label: "Avg. Attendance", value: `${avgAttendance}%`, icon: TrendingUp, color: "text-purple-600" },
    ]

    if (isDeptsLoading || isStatsLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    // Data for charts
    const departmentAttendanceData = departments.map((d: any) => ({
        dept: d.name,
        present: d.presentToday || 0,
        total: d.employees || 0
    }))

    const workModeDistribution = [
        { name: "On-site", value: departments.reduce((acc: number, d: any) => acc + (d.onsite || 0), 0), fill: "var(--color-chart-1)" },
        { name: "Hybrid", value: departments.reduce((acc: number, d: any) => acc + (d.hybrid || 0), 0), fill: "var(--color-chart-2)" },
        { name: "Remote", value: departments.reduce((acc: number, d: any) => acc + (d.remote || 0), 0), fill: "var(--color-chart-3)" },
    ]

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Departments</h1>
                <p className="text-lg text-muted-foreground font-light max-w-2xl">
                    Manage department attendance, track work modes, and analyze departmental performance metrics across your
                    organization.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.label} className="p-6 border-border/40 hover:border-border/60 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-secondary/50 ${stat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                            <p className="text-3xl font-serif">{stat.value}</p>
                        </Card>
                    )
                })}
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-secondary/30 border border-border/40">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="list">Department List</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Department Attendance Chart */}
                        <div className="lg:col-span-2">
                            <Card className="p-6 border-border/40">
                                <h3 className="text-lg font-serif mb-4">Department Attendance Status</h3>
                                <ChartContainer config={chartConfig} className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={departmentAttendanceData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                            <XAxis dataKey="dept" stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                                            <YAxis stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="present" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </Card>
                        </div>

                        {/* Summary Stats */}
                        <div>
                            <Card className="p-6 border-border/40 h-full">
                                <h3 className="text-lg font-serif mb-4">Today's Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-border/20">
                                        <span className="text-sm text-muted-foreground">Total Active</span>
                                        <Badge className="bg-green-100 text-green-700">
                                            {departments.reduce((acc: number, d: any) => acc + (d.presentToday || 0), 0)}/{totalEmployees}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-border/20">
                                        <span className="text-sm text-muted-foreground">Departments</span>
                                        <Badge variant="outline">{departments.length}</Badge>
                                    </div>
                                    <div className="flex justify-between items-center pt-3">
                                        <span className="text-sm font-semibold">Avg. Rate</span>
                                        <span className="text-lg font-serif text-green-600">{avgAttendance}%</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Department List Tab */}
                <TabsContent value="list" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-serif">All Departments</h3>
                        {isAuthorized && (
                            <div className="flex gap-2">
                                <Button size="sm" className="gap-2" onClick={handleNewDepartment}>
                                    <Plus className="w-4 h-4" />
                                    New Department
                                </Button>
                            </div>
                        )}
                    </div>

                    {departments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map((dept: any) => (
                                <Card
                                    key={dept.id}
                                    className={`p-6 border cursor-pointer transition-all ${selectedDeptId === dept.id ? "border-primary bg-primary/5" : "border-border/40 hover:border-border/60"
                                        }`}
                                    onClick={() => setSelectedDeptId(dept.id)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h4 className="font-serif text-lg mb-1">{dept.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Head: {dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : "No head assigned"}
                                            </p>
                                        </div>
                                        <Badge className={dept.rate === "100%" ? "bg-green-100 text-green-700" : ""}>{dept.rate}</Badge>
                                    </div>

                                    <div className="space-y-3 border-t border-border/20 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Total Employees</span>
                                            <span className="font-serif">{dept.employees}</span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge variant="secondary" className="text-xs">On-site: {dept.onsite}</Badge>
                                            <Badge variant="secondary" className="text-xs">Hybrid: {dept.hybrid}</Badge>
                                            <Badge variant="secondary" className="text-xs">Remote: {dept.remote}</Badge>
                                        </div>

                                        {isAuthorized && selectedDeptId === dept.id && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full mt-4 rounded-lg bg-transparent"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditDepartment(dept)
                                                }}
                                            >
                                                Edit Department
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4 bg-transparent">
                            <div className="p-4 rounded-full bg-secondary/50">
                                <Building2 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-serif text-xl">No Departments Found</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Your organization doesn't have any departments yet. {isAuthorized && "Create one to get started."}
                                </p>
                            </div>
                            {isAuthorized && (
                                <Button onClick={handleNewDepartment} size="sm" className="rounded-xl">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Department
                                </Button>
                            )}
                        </Card>
                    )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Work Mode Distribution */}
                        <Card className="p-6 border-border/40">
                            <h3 className="text-lg font-serif mb-6">Work Mode Distribution</h3>
                            <ChartContainer config={chartConfig} className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                        <Pie
                                            data={workModeDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {workModeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </Card>

                        {/* Work Mode Details */}
                        <Card className="p-6 border-border/40">
                            <h3 className="text-lg font-serif mb-6">Work Mode Details</h3>
                            <div className="space-y-6">
                                {workModeDistribution.map((mode) => (
                                    <div
                                        key={mode.name}
                                        className="flex items-center justify-between pb-4 border-b border-border/20 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.fill }}></div>
                                            <span className="font-medium">{mode.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-serif">{mode.value}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {totalEmployees > 0 ? Math.round((mode.value / totalEmployees) * 100) : 0}% of total
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Department Comparison Table */}
                    <Card className="p-6 border-border/40">
                        <h3 className="text-lg font-serif mb-4">Department Performance Comparison</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/20">
                                        <th className="text-left text-sm font-semibold text-muted-foreground py-3">Department</th>
                                        <th className="text-left text-sm font-semibold text-muted-foreground py-3">Head</th>
                                        <th className="text-left text-sm font-semibold text-muted-foreground py-3">Employees</th>
                                        <th className="text-left text-sm font-semibold text-muted-foreground py-3">On-site</th>
                                        <th className="text-left text-sm font-semibold text-muted-foreground py-3">Hybrid</th>
                                        <th className="text-left text-sm font-semibold text-muted-foreground py-3">Remote</th>
                                        <th className="text-left text-sm font-semibold text-muted-foreground py-3">Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.length > 0 ? (
                                        departments.map((dept: any) => (
                                            <tr key={dept.id} className="border-b border-border/10 hover:bg-secondary/20 transition-colors">
                                                <td className="py-4 text-sm font-medium">{dept.name}</td>
                                                <td className="py-4 text-sm text-muted-foreground">
                                                    {dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : "N/A"}
                                                </td>
                                                <td className="py-4 text-sm">{dept.employees}</td>
                                                <td className="py-4 text-sm">{dept.onsite}</td>
                                                <td className="py-4 text-sm">{dept.hybrid}</td>
                                                <td className="py-4 text-sm">{dept.remote}</td>
                                                <td className="py-4">
                                                    <Badge className={dept.rate === "100%" ? "bg-green-100 text-green-700" : ""}>{dept.rate}</Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-muted-foreground italic">
                                                No departmental data available for comparison
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                {departments.length > 0 && (
                                    <tfoot className="bg-secondary/10">
                                        <tr className="font-semibold">
                                            <td className="py-4 px-2 text-sm">Organization Total</td>
                                            <td className="py-4 text-sm">--</td>
                                            <td className="py-4 text-sm">{totalEmployees}</td>
                                            <td className="py-4 text-sm">{departments.reduce((acc: number, d: any) => acc + (d.onsite || 0), 0)}</td>
                                            <td className="py-4 text-sm">{departments.reduce((acc: number, d: any) => acc + (d.hybrid || 0), 0)}</td>
                                            <td className="py-4 text-sm">{departments.reduce((acc: number, d: any) => acc + (d.remote || 0), 0)}</td>
                                            <td className="py-4">
                                                <Badge className="bg-primary/10 text-primary border-primary/20">{avgAttendance}%</Badge>
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Department Modal Component */}
            <DepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitDepartment}
                initialData={editingDept}
                mode={modalMode}
            />
        </div>
    )
}
