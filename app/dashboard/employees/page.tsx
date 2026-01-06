"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Search,
    Filter,
    Plus,
    Mail,
    Phone,
    Building2,
    ChevronRight,
    UserPlus,
    MoreHorizontal,
    Download,
    Users
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { users, departments, getTodayAttendance } from "@/lib/mock-data"
import type { UserRole } from "@/lib/types"
import { InviteUserDialog } from "@/components/invite-user-dialog"

const roleColors: Record<UserRole, string> = {
    ceo: 'bg-purple-100 text-purple-700',
    hr: 'bg-blue-100 text-blue-700',
    manager: 'bg-green-100 text-green-700',
    staff: 'bg-gray-100 text-gray-600',
}

const roleLabels: Record<UserRole, string> = {
    ceo: 'CEO',
    hr: 'HR',
    manager: 'Manager',
    staff: 'Staff',
}

export default function EmployeesPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [departmentFilter, setDepartmentFilter] = React.useState("all")
    const [roleFilter, setRoleFilter] = React.useState("all")

    if (!user) return null

    // Filter employees by Company and other criteria
    const filteredEmployees = users.filter(employee => {
        // Ensure employee belongs to the same company
        if (employee.companyId !== user.companyId) return false;

        const matchesSearch =
            `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.position.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter
        const matchesRole = roleFilter === 'all' || employee.role === roleFilter

        return matchesSearch && matchesDepartment && matchesRole
    })

    // Group by department
    const groupedByDepartment = filteredEmployees.reduce((acc, emp) => {
        if (!acc[emp.department]) {
            acc[emp.department] = []
        }
        acc[emp.department].push(emp)
        return acc
    }, {} as Record<string, typeof users>)

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Employees</h1>
                    <p className="text-muted-foreground font-light mt-1">
                        Manage all employees across the organization ({filteredEmployees.length} total)
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl">
                        <Download className="size-4 mr-2" />
                        Export
                    </Button>
                    <InviteUserDialog companySlug={user.companyId === 'comp-001' ? 'presence' : 'acme'} />
                </div>
            </div>

            {/* Filters */}
            <Card className="border-border/30">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or position..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-xl border-border/40 bg-secondary/30"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-44 h-10 rounded-xl border-border/40 bg-secondary/30">
                                    <Building2 className="size-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-36 h-10 rounded-xl border-border/40 bg-secondary/30">
                                    <Filter className="size-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="ceo">CEO</SelectItem>
                                    <SelectItem value="hr">HR</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Department Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {departments.map(dept => (
                    <Card
                        key={dept.id}
                        className={`border-border/30 cursor-pointer hover:shadow-md transition-all ${departmentFilter === dept.name ? 'ring-2 ring-primary' : ''
                            }`}
                        onClick={() => setDepartmentFilter(dept.name === departmentFilter ? 'all' : dept.name)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{dept.name}</p>
                                    <p className="text-2xl font-serif mt-1">{dept.headCount}</p>
                                </div>
                                <Building2 className="size-8 text-primary/20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Employee List Grouped by Department */}
            <div className="space-y-6">
                {Object.entries(groupedByDepartment).map(([department, employees]) => (
                    <Card key={department} className="border-border/30 overflow-hidden">
                        <CardHeader className="border-b bg-secondary/10 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Building2 className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{department}</CardTitle>
                                        <CardDescription>{employees.length} employees</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    View All <ChevronRight className="size-4 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/30">
                                {employees.map(employee => {
                                    const attendance = getTodayAttendance(employee.id)

                                    return (
                                        <div
                                            key={employee.id}
                                            className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar className="size-11">
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                                        {employee.firstName[0]}{employee.lastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0 ${roleColors[employee.role]}`}
                                                        >
                                                            {roleLabels[employee.role]}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                                                    <a href={`mailto:${employee.email}`} className="flex items-center gap-1.5 hover:text-foreground">
                                                        <Mail className="size-4" />
                                                        <span className="hidden lg:inline">{employee.email}</span>
                                                    </a>
                                                    {employee.phone && (
                                                        <a href={`tel:${employee.phone}`} className="flex items-center gap-1.5 hover:text-foreground">
                                                            <Phone className="size-4" />
                                                            <span className="hidden lg:inline">{employee.phone}</span>
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {attendance?.status && (
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[10px] uppercase font-bold ${attendance.status === 'present' ? 'bg-green-50 text-green-600 border-green-200' :
                                                                attendance.status === 'late' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                                    attendance.status === 'leave' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                                        'bg-gray-50 text-gray-600'
                                                                }`}
                                                        >
                                                            {attendance.status}
                                                        </Badge>
                                                    )}
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <Card className="border-border/30">
                    <CardContent className="p-12 text-center">
                        <Users className="size-12 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-1">No employees found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
