"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Search,
    Mail,
    Phone,
    Building2,
    Clock,
    Calendar,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    AlertCircle,
    TrendingUp,
    Users
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { users, attendanceRecords, getUsersByManager, getTodayAttendance } from "@/lib/mock-data"

export default function TeamPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = React.useState("")

    if (!user) return null

    // Get team members based on role
    const getTeamMembers = () => {
        if (user.role === 'manager') {
            return getUsersByManager(user.id)
        }
        // HR and CEO see all employees
        return users.filter(u => u.id !== user.id)
    }

    const teamMembers = getTeamMembers()
    const today = new Date().toISOString().split('T')[0]

    // Filter by search
    const filteredMembers = teamMembers.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Team stats
    const presentCount = teamMembers.filter(m => {
        const attendance = getTodayAttendance(m.id)
        return attendance?.status === 'present' || attendance?.status === 'late'
    }).length

    const lateCount = teamMembers.filter(m => {
        const attendance = getTodayAttendance(m.id)
        return attendance?.status === 'late'
    }).length

    const onLeaveCount = teamMembers.filter(m => {
        const attendance = getTodayAttendance(m.id)
        return attendance?.status === 'leave'
    }).length

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
                    {user.role === 'manager' ? 'My Team' : 'All Employees'}
                </h1>
                <p className="text-muted-foreground font-light mt-1">
                    {user.role === 'manager'
                        ? `Manage and track your direct reports (${teamMembers.length} members)`
                        : `Complete employee directory (${teamMembers.length} employees)`
                    }
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-secondary/20 border-border/30">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Total</p>
                                <p className="text-2xl font-serif mt-1">{teamMembers.length}</p>
                            </div>
                            <Users className="size-8 text-primary/30" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50/50 border-green-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-green-600/70">Present</p>
                                <p className="text-2xl font-serif text-green-700 mt-1">{presentCount}</p>
                            </div>
                            <CheckCircle2 className="size-8 text-green-400/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50/50 border-orange-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-orange-600/70">Late Today</p>
                                <p className="text-2xl font-serif text-orange-700 mt-1">{lateCount}</p>
                            </div>
                            <AlertCircle className="size-8 text-orange-400/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50/50 border-blue-100">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600/70">On Leave</p>
                                <p className="text-2xl font-serif text-blue-700 mt-1">{onLeaveCount}</p>
                            </div>
                            <Calendar className="size-8 text-blue-400/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-border/40 bg-secondary/30"
                />
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMembers.map(member => {
                    const attendance = getTodayAttendance(member.id)
                    const status = attendance?.status || 'absent'

                    const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
                        present: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Present', icon: CheckCircle2 },
                        late: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Late', icon: AlertCircle },
                        leave: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'On Leave', icon: Calendar },
                        absent: { color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Absent', icon: XCircle },
                    }

                    const currentStatus = statusConfig[status] || statusConfig.absent

                    return (
                        <Card
                            key={member.id}
                            className="border-border/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                        >
                            <CardContent className="p-0">
                                {/* Top gradient bar */}
                                <div className={`h-1 ${status === 'present' ? 'bg-green-500' :
                                        status === 'late' ? 'bg-orange-500' :
                                            status === 'leave' ? 'bg-blue-500' : 'bg-gray-300'
                                    }`} />

                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-12 ring-2 ring-background shadow-md">
                                                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                    {member.firstName[0]}{member.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                                                <p className="text-sm text-muted-foreground">{member.position}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Building2 className="size-4" />
                                            <span>{member.department}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="size-4" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                        {member.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="size-4" />
                                                <span>{member.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                        <Badge variant="outline" className={`gap-1 text-[10px] uppercase font-bold ${currentStatus.color}`}>
                                            <currentStatus.icon className="size-3" />
                                            {currentStatus.label}
                                        </Badge>
                                        {attendance?.checkIn && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {attendance.checkIn}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filteredMembers.length === 0 && (
                <Card className="border-border/30">
                    <CardContent className="p-12 text-center">
                        <Users className="size-12 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-1">No team members found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your search query
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
