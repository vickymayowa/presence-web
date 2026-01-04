"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Search,
    Filter,
    Download,
    Calendar,
    Clock,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MapPin
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { attendanceRecords, users, getUserById } from "@/lib/mock-data"

export default function AttendancePage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState("today")

    if (!user) return null

    // Get attendance records based on role
    const getRelevantRecords = () => {
        if (user.role === 'staff') {
            // Staff only sees their own records
            return attendanceRecords.filter(r => r.userId === user.id)
        }
        // Other roles see all records
        return attendanceRecords
    }

    const records = getRelevantRecords()

    // Filter records
    const filteredRecords = records.filter(record => {
        const recordUser = getUserById(record.userId)
        const matchesSearch = recordUser &&
            (`${recordUser.firstName} ${recordUser.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recordUser.department.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesStatus = statusFilter === 'all' || record.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            present: "bg-green-100 text-green-700 border-green-200",
            late: "bg-orange-100 text-orange-700 border-orange-200",
            absent: "bg-red-100 text-red-700 border-red-200",
            leave: "bg-blue-100 text-blue-700 border-blue-200",
            "half-day": "bg-yellow-100 text-yellow-700 border-yellow-200",
            holiday: "bg-purple-100 text-purple-700 border-purple-200",
        }
        return styles[status] || "bg-gray-100 text-gray-700"
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <CheckCircle2 className="size-3.5" />
            case 'late': return <AlertCircle className="size-3.5" />
            case 'absent': return <XCircle className="size-3.5" />
            default: return null
        }
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
                        {user.role === 'staff' ? 'My Attendance' : 'Attendance Records'}
                    </h1>
                    <p className="text-muted-foreground font-light mt-1">
                        {user.role === 'staff'
                            ? 'View your attendance history and check-in records'
                            : 'Track and manage employee attendance across the organization'
                        }
                    </p>
                </div>
                {user.role !== 'staff' && (
                    <Button className="rounded-xl px-6">
                        <Download className="size-4 mr-2" />
                        Export Report
                    </Button>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-green-50/50 border-green-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-green-600/70">Present</p>
                                <p className="text-2xl font-serif text-green-700 mt-1">
                                    {filteredRecords.filter(r => r.status === 'present').length}
                                </p>
                            </div>
                            <CheckCircle2 className="size-8 text-green-500/30" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50/50 border-orange-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-orange-600/70">Late</p>
                                <p className="text-2xl font-serif text-orange-700 mt-1">
                                    {filteredRecords.filter(r => r.status === 'late').length}
                                </p>
                            </div>
                            <AlertCircle className="size-8 text-orange-500/30" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50/50 border-blue-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600/70">On Leave</p>
                                <p className="text-2xl font-serif text-blue-700 mt-1">
                                    {filteredRecords.filter(r => r.status === 'leave').length}
                                </p>
                            </div>
                            <Calendar className="size-8 text-blue-500/30" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gray-50/50 border-gray-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-600/70">Absent</p>
                                <p className="text-2xl font-serif text-gray-700 mt-1">
                                    {filteredRecords.filter(r => r.status === 'absent').length}
                                </p>
                            </div>
                            <XCircle className="size-8 text-gray-400/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-border/30">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-xl border-border/40 bg-secondary/30"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40 h-10 rounded-xl border-border/40 bg-secondary/30">
                                    <Filter className="size-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="late">Late</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="leave">On Leave</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger className="w-40 h-10 rounded-xl border-border/40 bg-secondary/30">
                                    <Calendar className="size-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card className="border-border/30 overflow-hidden">
                <CardHeader className="border-b bg-secondary/10 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                            {filteredRecords.length} Records
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Sort by:</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                Time <ArrowUpDown className="size-3 ml-1" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {/* Table Header */}
                <div className="hidden md:grid md:grid-cols-7 gap-4 p-4 border-b bg-secondary/5 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                    <div className="col-span-2">Employee</div>
                    <div>Date</div>
                    <div>Check In</div>
                    <div>Check Out</div>
                    <div>Work Mode</div>
                    <div>Status</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border/30">
                    {filteredRecords.map((record) => {
                        const recordUser = getUserById(record.userId)
                        if (!recordUser) return null

                        return (
                            <div
                                key={record.id}
                                className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 hover:bg-secondary/20 transition-colors"
                            >
                                {/* Employee */}
                                <div className="col-span-2 flex items-center gap-3">
                                    <Avatar className="size-10">
                                        <AvatarFallback className="bg-primary/10 text-sm">
                                            {recordUser.firstName[0]}{recordUser.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{recordUser.firstName} {recordUser.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{recordUser.department}</p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-center">
                                    <span className="text-sm">{formatDate(record.date)}</span>
                                </div>

                                {/* Check In */}
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-muted-foreground/50" />
                                    <span className="text-sm font-medium">
                                        {record.checkIn || "—"}
                                    </span>
                                </div>

                                {/* Check Out */}
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-muted-foreground/50" />
                                    <span className="text-sm font-medium">
                                        {record.checkOut || "—"}
                                    </span>
                                </div>

                                {/* Work Mode */}
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-4 text-muted-foreground/50" />
                                    <span className="text-sm capitalize">{record.workMode}</span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center">
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] uppercase font-bold tracking-wider gap-1 ${getStatusBadge(record.status)}`}
                                    >
                                        {getStatusIcon(record.status)}
                                        {record.status}
                                    </Badge>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t bg-secondary/5">
                    <p className="text-sm text-muted-foreground">
                        Showing 1-{filteredRecords.length} of {filteredRecords.length} records
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground">
                            1
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    })
}
