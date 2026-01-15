"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Building2, Users, TrendingUp, MapPin, Filter, Plus } from "lucide-react"
import { DepartmentModal } from "@/components/department-modal"
import type { DepartmentFormData } from "@/components/department-modal"

const departmentData = [
    { id: 1, name: "Engineering", head: "Sarah Mitchell", employees: 24, onsite: 18, hybrid: 4, remote: 2, rate: "94%" },
    { id: 2, name: "Design", head: "Emma Wilson", employees: 8, onsite: 6, hybrid: 2, remote: 0, rate: "100%" },
    { id: 3, name: "Marketing", head: "James Rodriguez", employees: 6, onsite: 3, hybrid: 2, remote: 1, rate: "83%" },
    { id: 4, name: "Sales", head: "Michael Chen", employees: 12, onsite: 10, hybrid: 2, remote: 0, rate: "85%" },
    { id: 5, name: "HR", head: "Lisa Anderson", employees: 5, onsite: 3, hybrid: 2, remote: 0, rate: "100%" },
    { id: 6, name: "Finance", head: "David Kumar", employees: 7, onsite: 5, hybrid: 2, remote: 0, rate: "96%" },
]

const departmentAttendance = [
    { dept: "Engineering", present: 22, absent: 2, late: 0 },
    { dept: "Design", present: 8, absent: 0, late: 0 },
    { dept: "Marketing", present: 5, absent: 1, late: 0 },
    { dept: "Sales", present: 10, absent: 1, late: 1 },
    { dept: "HR", present: 5, absent: 0, late: 0 },
    { dept: "Finance", present: 7, absent: 0, late: 0 },
]

const workModeDistribution = [
    { name: "On-site", value: 45, fill: "var(--color-chart-1)" },
    { name: "Hybrid", value: 14, fill: "var(--color-chart-2)" },
    { name: "Remote", value: 3, fill: "var(--color-chart-3)" },
]

const chartConfig = {
    present: { label: "Present", color: "hsl(var(--color-chart-1))" },
    absent: { label: "Absent", color: "hsl(var(--color-chart-5))" },
    late: { label: "Late", color: "hsl(var(--color-chart-4))" },
    onsite: { label: "On-site", color: "hsl(var(--color-chart-1))" },
    hybrid: { label: "Hybrid", color: "hsl(var(--color-chart-2))" },
    remote: { label: "Remote", color: "hsl(var(--color-chart-3))" },
}

export default function DepartmentsPage() {
    const [selectedDept, setSelectedDept] = useState<number | null>(1)
    const [departments, setDepartments] = useState(departmentData)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")
    const [editingDept, setEditingDept] = useState<DepartmentFormData | undefined>()

    const handleNewDepartment = () => {
        setModalMode("create")
        setEditingDept(undefined)
        setIsModalOpen(true)
    }

    const handleEditDepartment = (dept: (typeof departmentData)[0]) => {
        setModalMode("edit")
        setEditingDept({
            name: dept.name,
            head: dept.head,
            employees: dept.employees.toString(),
            onsite: dept.onsite.toString(),
            hybrid: dept.hybrid.toString(),
            remote: dept.remote.toString(),
        })
        setIsModalOpen(true)
    }

    const handleSubmitDepartment = (data: DepartmentFormData) => {
        if (modalMode === "create") {
            const newDept = {
                id: Math.max(...departments.map((d) => d.id)) + 1,
                name: data.name,
                head: data.head,
                employees: Number.parseInt(data.employees) || 0,
                onsite: Number.parseInt(data.onsite) || 0,
                hybrid: Number.parseInt(data.hybrid) || 0,
                remote: Number.parseInt(data.remote) || 0,
                rate: "0%",
            }
            setDepartments([...departments, newDept])
        } else {
            setDepartments(
                departments.map((dept) =>
                    dept.id === selectedDept
                        ? {
                            ...dept,
                            name: data.name,
                            head: data.head,
                            employees: Number.parseInt(data.employees) || 0,
                            onsite: Number.parseInt(data.onsite) || 0,
                            hybrid: Number.parseInt(data.hybrid) || 0,
                            remote: Number.parseInt(data.remote) || 0,
                        }
                        : dept,
                ),
            )
        }
    }

    const selectedDeptData = departments.find((d) => d.id === selectedDept)

    const stats = [
        { label: "Total Departments", value: "6", icon: Building2, color: "text-blue-600" },
        { label: "Total Employees", value: "62", icon: Users, color: "text-green-600" },
        { label: "Avg. Attendance", value: "93.2%", icon: TrendingUp, color: "text-purple-600" },
        { label: "On-site Days", value: "45", icon: MapPin, color: "text-orange-600" },
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
                                        <BarChart data={departmentAttendance}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                            <XAxis dataKey="dept" stroke="var(--color-muted-foreground)" />
                                            <YAxis stroke="var(--color-muted-foreground)" />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="present" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="late" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
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
                                        <span className="text-sm text-muted-foreground">Total Present</span>
                                        <Badge className="bg-green-100 text-green-700">57/62</Badge>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-border/20">
                                        <span className="text-sm text-muted-foreground">Absent</span>
                                        <Badge variant="outline">3</Badge>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-border/20">
                                        <span className="text-sm text-muted-foreground">Late</span>
                                        <Badge className="bg-yellow-100 text-yellow-700">2</Badge>
                                    </div>
                                    <div className="flex justify-between items-center pt-3">
                                        <span className="text-sm font-semibold">Avg. Rate</span>
                                        <span className="text-lg font-serif text-green-600">91.9%</span>
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
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                            <Button size="sm" className="gap-2" onClick={handleNewDepartment}>
                                <Plus className="w-4 h-4" />
                                New Department
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((dept) => (
                            <Card
                                key={dept.id}
                                className={`p-6 border cursor-pointer transition-all ${selectedDept === dept.id ? "border-primary bg-primary/5" : "border-border/40 hover:border-border/60"
                                    }`}
                                onClick={() => setSelectedDept(dept.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="font-serif text-lg mb-1">{dept.name}</h4>
                                        <p className="text-sm text-muted-foreground">Head: {dept.head}</p>
                                    </div>
                                    <Badge className={dept.rate === "100%" ? "bg-green-100 text-green-700" : ""}>{dept.rate}</Badge>
                                </div>

                                <div className="space-y-3 border-t border-border/20 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Employees</span>
                                        <span className="font-serif">{dept.employees}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge variant="secondary" className="text-xs">
                                            On-site: {dept.onsite}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            Hybrid: {dept.hybrid}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            Remote: {dept.remote}
                                        </Badge>
                                    </div>

                                    {selectedDept === dept.id && (
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
                                            <p className="text-xs text-muted-foreground">{Math.round((mode.value / 62) * 100)}% of total</p>
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
                                    {departments.map((dept) => (
                                        <tr key={dept.id} className="border-b border-border/10 hover:bg-secondary/20 transition-colors">
                                            <td className="py-4 text-sm font-medium">{dept.name}</td>
                                            <td className="py-4 text-sm text-muted-foreground">{dept.head}</td>
                                            <td className="py-4 text-sm">{dept.employees}</td>
                                            <td className="py-4 text-sm">{dept.onsite}</td>
                                            <td className="py-4 text-sm">{dept.hybrid}</td>
                                            <td className="py-4 text-sm">{dept.remote}</td>
                                            <td className="py-4">
                                                <Badge className={dept.rate === "100%" ? "bg-green-100 text-green-700" : ""}>{dept.rate}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
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
