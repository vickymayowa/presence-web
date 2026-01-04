"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Plus,
    Calendar,
    Clock,
    FileText,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Filter,
    Briefcase,
    Stethoscope,
    Home,
    Baby,
    Loader2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { leaveRequests, getUserById, users } from "@/lib/mock-data"
import type { LeaveRequest } from "@/lib/types"

const leaveTypes = [
    { value: 'annual', label: 'Annual Leave', icon: Briefcase, color: 'text-blue-600 bg-blue-100' },
    { value: 'sick', label: 'Sick Leave', icon: Stethoscope, color: 'text-red-600 bg-red-100' },
    { value: 'personal', label: 'Personal Leave', icon: Calendar, color: 'text-purple-600 bg-purple-100' },
    { value: 'work-from-home', label: 'Work from Home', icon: Home, color: 'text-green-600 bg-green-100' },
    { value: 'maternity', label: 'Maternity Leave', icon: Baby, color: 'text-pink-600 bg-pink-100' },
    { value: 'paternity', label: 'Paternity Leave', icon: Baby, color: 'text-cyan-600 bg-cyan-100' },
]

export default function LeavesPage() {
    const { user } = useAuth()
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [newRequest, setNewRequest] = React.useState({
        type: '',
        startDate: '',
        endDate: '',
        reason: ''
    })

    if (!user) return null

    // Get relevant leave requests based on role
    const getRelevantRequests = (): LeaveRequest[] => {
        if (user.role === 'staff') {
            return leaveRequests.filter(r => r.userId === user.id)
        }
        if (user.role === 'manager') {
            // Get requests from team members
            const teamMembers = users.filter(u => u.managerId === user.id)
            return leaveRequests.filter(r =>
                teamMembers.some(m => m.id === r.userId) || r.userId === user.id
            )
        }
        // HR and CEO see all requests
        return leaveRequests
    }

    const requests = getRelevantRequests()
    const filteredRequests = statusFilter === 'all'
        ? requests
        : requests.filter(r => r.status === statusFilter)

    const pendingCount = requests.filter(r => r.status === 'pending').length
    const approvedCount = requests.filter(r => r.status === 'approved').length
    const rejectedCount = requests.filter(r => r.status === 'rejected').length

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsDialogOpen(false)
        setNewRequest({ type: '', startDate: '', endDate: '', reason: '' })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 gap-1">
                        <AlertCircle className="size-3" />
                        Pending
                    </Badge>
                )
            case 'approved':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1">
                        <CheckCircle2 className="size-3" />
                        Approved
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1">
                        <XCircle className="size-3" />
                        Rejected
                    </Badge>
                )
            default:
                return null
        }
    }

    const canApprove = user.role === 'manager' || user.role === 'hr' || user.role === 'ceo'

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">
                        {user.role === 'staff' ? 'My Leave Requests' : 'Leave Management'}
                    </h1>
                    <p className="text-muted-foreground font-light mt-1">
                        {user.role === 'staff'
                            ? 'Request time off and track your leave balance'
                            : 'Review and manage employee leave requests'
                        }
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl px-6">
                            <Plus className="size-4 mr-2" />
                            New Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl">Request Leave</DialogTitle>
                            <DialogDescription>
                                Submit a new leave request for approval
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Leave Type</Label>
                                <Select
                                    value={newRequest.type}
                                    onValueChange={(value) => setNewRequest(prev => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue placeholder="Select leave type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leaveTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div className="flex items-center gap-2">
                                                    <type.icon className="size-4" />
                                                    {type.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={newRequest.startDate}
                                        onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                                        className="h-11 rounded-xl"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={newRequest.endDate}
                                        onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                                        className="h-11 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Textarea
                                    value={newRequest.reason}
                                    onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                                    placeholder="Please provide a reason for your leave request..."
                                    className="min-h-[100px] rounded-xl resize-none"
                                    required
                                />
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="size-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Request'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Leave Balance (for Staff) */}
            {user.role === 'staff' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-600/70">Annual</p>
                            <p className="text-2xl font-serif text-blue-700 mt-1">12 <span className="text-sm font-light">days</span></p>
                            <p className="text-xs text-blue-600/60 mt-1">5 used</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50/50 border-red-100">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-red-600/70">Sick</p>
                            <p className="text-2xl font-serif text-red-700 mt-1">8 <span className="text-sm font-light">days</span></p>
                            <p className="text-xs text-red-600/60 mt-1">2 used</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-50/50 border-purple-100">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-purple-600/70">Personal</p>
                            <p className="text-2xl font-serif text-purple-700 mt-1">3 <span className="text-sm font-light">days</span></p>
                            <p className="text-xs text-purple-600/60 mt-1">1 used</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50/50 border-green-100">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-green-600/70">WFH</p>
                            <p className="text-2xl font-serif text-green-700 mt-1">∞ <span className="text-sm font-light">days</span></p>
                            <p className="text-xs text-green-600/60 mt-1">Flexible</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Request Stats (for Managers/HR/CEO) */}
            {canApprove && (
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-orange-50/50 border-orange-100 cursor-pointer hover:bg-orange-50 transition-colors"
                        onClick={() => setStatusFilter('pending')}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-orange-600/70">Pending</p>
                                    <p className="text-3xl font-serif text-orange-700 mt-1">{pendingCount}</p>
                                </div>
                                <AlertCircle className="size-8 text-orange-400/50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-50/50 border-green-100 cursor-pointer hover:bg-green-50 transition-colors"
                        onClick={() => setStatusFilter('approved')}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-green-600/70">Approved</p>
                                    <p className="text-3xl font-serif text-green-700 mt-1">{approvedCount}</p>
                                </div>
                                <CheckCircle2 className="size-8 text-green-400/50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-50/50 border-red-100 cursor-pointer hover:bg-red-50 transition-colors"
                        onClick={() => setStatusFilter('rejected')}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-red-600/70">Rejected</p>
                                    <p className="text-3xl font-serif text-red-700 mt-1">{rejectedCount}</p>
                                </div>
                                <XCircle className="size-8 text-red-400/50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <Button
                        key={status}
                        variant={statusFilter === status ? "default" : "outline"}
                        size="sm"
                        className="rounded-xl capitalize"
                        onClick={() => setStatusFilter(status)}
                    >
                        {status}
                        {status !== 'all' && (
                            <span className="ml-1.5 text-[10px] opacity-70">
                                ({requests.filter(r => r.status === status).length})
                            </span>
                        )}
                    </Button>
                ))}
            </div>

            {/* Leave Requests List */}
            <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                    <Card className="border-border/30">
                        <CardContent className="p-12 text-center">
                            <FileText className="size-12 mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-medium mb-1">No requests found</h3>
                            <p className="text-sm text-muted-foreground">
                                {statusFilter === 'all'
                                    ? "You haven't made any leave requests yet"
                                    : `No ${statusFilter} requests`
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredRequests.map(request => {
                        const requestUser = getUserById(request.userId)
                        const leaveType = leaveTypes.find(t => t.value === request.type)
                        const approver = request.approvedBy ? getUserById(request.approvedBy) : null

                        return (
                            <Card key={request.id} className="border-border/30 overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Left: Request Details */}
                                        <div className="flex-1 p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-10">
                                                        <AvatarFallback className="bg-primary/10 text-sm">
                                                            {requestUser?.firstName[0]}{requestUser?.lastName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{requestUser?.firstName} {requestUser?.lastName}</p>
                                                        <p className="text-xs text-muted-foreground">{requestUser?.department}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(request.status)}
                                            </div>

                                            <div className="flex items-center gap-3 mb-3">
                                                {leaveType && (
                                                    <Badge variant="secondary" className={`gap-1 ${leaveType.color}`}>
                                                        <leaveType.icon className="size-3" />
                                                        {leaveType.label}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4" />
                                                    <span>{formatDateRange(request.startDate, request.endDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-4" />
                                                    <span>{getDayCount(request.startDate, request.endDate)} day(s)</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground">{request.reason}</p>

                                            {approver && (
                                                <p className="text-xs text-muted-foreground mt-3">
                                                    {request.status === 'approved' ? 'Approved' : 'Reviewed'} by {approver.firstName} {approver.lastName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Right: Actions (for pending requests that user can approve) */}
                                        {canApprove && request.status === 'pending' && request.userId !== user.id && (
                                            <div className="flex md:flex-col gap-2 p-4 md:border-l border-t md:border-t-0 bg-secondary/10 justify-center">
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl flex-1 md:flex-none">
                                                    <CheckCircle2 className="size-4 mr-1" />
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="rounded-xl flex-1 md:flex-none text-destructive hover:text-destructive">
                                                    <XCircle className="size-4 mr-1" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}

function formatDateRange(start: string, end: string): string {
    const startDate = new Date(start)
    const endDate = new Date(end)

    const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    if (start === end) {
        return startStr + ', ' + startDate.getFullYear()
    }
    return `${startStr} - ${endStr}`
}

function getDayCount(start: string, end: string): number {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}
