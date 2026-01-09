"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Building2,
    Calendar,
    ChevronDown
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useUsersQuery } from "@/lib/queries/presence-queries"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

export default function EmployeesPage() {
    const { user: currentUser } = useAuth()
    const { data: allUsers = [], isLoading } = useUsersQuery()
    const [searchQuery, setSearchQuery] = React.useState("")

    if (!currentUser) return null

    const filteredEmployees = allUsers.filter(u =>
        `${u.firstName} ${u.lastName} ${u.email} ${u.department}`.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-serif tracking-tight">Employee Directory</h2>
                    <p className="text-muted-foreground font-light text-lg">
                        Browse and manage all personnel across your organization.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-border/40">
                        Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    {(currentUser.role === 'ceo' || currentUser.role === 'hr') && (
                        <Button className="rounded-2xl h-12 px-6 bg-primary text-primary-foreground">
                            Add Employee
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border-border/40 overflow-hidden">
                <CardHeader className="bg-secondary/5 border-b border-border/10 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                className="pl-10 h-10 rounded-xl border-border/40"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-xl h-10 gap-2">
                                <Filter className="h-4 w-4" /> Filter
                            </Button>
                            <div className="h-6 w-px bg-border/40 mx-2" />
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                {filteredEmployees.length} Results
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/10">
                                <TableHead className="w-[300px] text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Employee</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Department</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Role</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Start Date</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Status</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse">
                                        <TableCell colSpan={6} className="h-16 bg-secondary/10" />
                                    </TableRow>
                                ))
                            ) : filteredEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-light italic">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id} className="group border-border/10 hover:bg-secondary/20 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="text-xs">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-medium">{employee.firstName} {employee.lastName}</p>
                                                    <p className="text-xs text-muted-foreground font-light">{employee.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                {employee.department}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize rounded-lg px-2 py-0 h-6 text-[10px] font-bold tracking-wider border-primary/20 bg-primary/5 text-primary">
                                                {employee.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Nov 12, 2024
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                <span className="text-xs font-medium">Active</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
