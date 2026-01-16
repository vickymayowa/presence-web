"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Calendar,
    Clock,
    FileText,
    Briefcase,
    Stethoscope,
    Home,
    Baby,
    Loader2,
    MessageSquare
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useLeavesQuery, useUsersQuery, useUpdateLeaveMutation } from "@/lib/queries/presence-queries"
import type { LeaveRequest } from "@/lib/types"
import { toast } from "sonner"

const leaveTypeConfig: Record<string, { icon: any; color: string; label: string }> = {
    annual: { icon: Briefcase, color: 'text-blue-600 bg-blue-100', label: 'Annual Leave' },
    sick: { icon: Stethoscope, color: 'text-red-600 bg-red-100', label: 'Sick Leave' },
    personal: { icon: Calendar, color: 'text-purple-600 bg-purple-100', label: 'Personal Leave' },
    'work-from-home': { icon: Home, color: 'text-green-600 bg-green-100', label: 'Work from Home' },
    maternity: { icon: Baby, color: 'text-pink-600 bg-pink-100', label: 'Maternity Leave' },
    paternity: { icon: Baby, color: 'text-cyan-600 bg-cyan-100', label: 'Paternity Leave' },
}

export default function ApprovalsPage() {
    const { user } = useAuth()
    const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null)
    const [actionType, setActionType] = React.useState<'approve' | 'reject' | null>(null)
    const [rejectionReason, setRejectionReason] = React.useState("")
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [filter, setFilter] = React.useState<'all' | 'pending' | 'processed'>('pending')

    const { data: leaveRequests = [], isLoading: isLeavesLoading } = useLeavesQuery()
    const { data: allUsers = [], isLoading: isUsersLoading } = useUsersQuery()
    const updateLeave = useUpdateLeaveMutation()

    if (!user) return null
    if (isLeavesLoading || isUsersLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    const getUserById = (id: string) => allUsers.find(u => u.id === id)

    // Get requests that need this user's approval
    const getPendingRequests = () => {
        if (user.role === 'manager') {
            const teamMembers = allUsers.filter(u => u.managerId === user.id)
            return leaveRequests.filter(r =>
                teamMembers.some(m => m.id === r.userId)
            )
        }
        if (user.role === 'hr' || user.role === 'ceo') {
            return leaveRequests
        }
        return []
    }

    const allRelevantRequests = getPendingRequests()
    const pendingRequests = allRelevantRequests.filter(r => r.status === 'pending')
    const processedRequests = allRelevantRequests.filter(r => r.status !== 'pending')

    const displayRequests = filter === 'pending'
        ? pendingRequests
        : filter === 'processed'
            ? processedRequests
            : allRelevantRequests

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return

        setIsProcessing(true)
        try {
            const status = actionType === 'approve' ? 'approved' : 'rejected'
            await updateLeave.mutateAsync({
                id: selectedRequest.id,
                status
            })
            toast.success(`Leave request ${status} successfully`)
            setSelectedRequest(null)
            setActionType(null)
            setRejectionReason("")
        } catch (error) {
            toast.error(`Failed to ${actionType} leave request`)
        } finally {
            setIsProcessing(false)
        }
    }
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Approvals</h1>
                    <p className="text-muted-foreground font-light mt-1">
                        Review and manage pending approval requests
                    </p>
                </div>
                <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 text-sm px-4 py-2 w-fit"
                >
                    <AlertCircle className="size-4 mr-2" />
                    {pendingRequests.length} pending
                </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card
                    className={`border-border/30 cursor-pointer transition-all ${filter === 'pending' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-orange-600/70">Pending</p>
                                <p className="text-2xl font-serif text-orange-700 mt-1">{pendingRequests.length}</p>
                            </div>
                            <AlertCircle className="size-8 text-orange-400/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`border-border/30 cursor-pointer transition-all ${filter === 'processed' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setFilter('processed')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-green-600/70">Processed</p>
                                <p className="text-2xl font-serif text-green-700 mt-1">{processedRequests.length}</p>
                            </div>
                            <CheckCircle2 className="size-8 text-green-400/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`border-border/30 cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Total</p>
                                <p className="text-2xl font-serif mt-1">{allRelevantRequests.length}</p>
                            </div>
                            <FileText className="size-8 text-muted-foreground/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {displayRequests.length === 0 ? (
                    <Card className="border-border/30">
                        <CardContent className="p-12 text-center">
                            <CheckCircle2 className="size-12 mx-auto text-green-500/50 mb-4" />
                            <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                            <p className="text-sm text-muted-foreground">
                                No pending requests require your attention
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    displayRequests.map(request => {
                        const requestUser = getUserById(request.userId)
                        const typeConfig = leaveTypeConfig[request.type] || leaveTypeConfig.annual
                        const TypeIcon = typeConfig.icon

                        return (
                            <Card key={request.id} className="border-border/30 overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Request Details */}
                                        <div className="flex-1 p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-12">
                                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                            {requestUser?.firstName[0]}{requestUser?.lastName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-semibold">{requestUser?.firstName} {requestUser?.lastName}</h3>
                                                        <p className="text-sm text-muted-foreground">{requestUser?.position}</p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`gap-1 ${request.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                        request.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                                                            'bg-red-50 text-red-600 border-red-200'
                                                        }`}
                                                >
                                                    {request.status === 'pending' && <AlertCircle className="size-3" />}
                                                    {request.status === 'approved' && <CheckCircle2 className="size-3" />}
                                                    {request.status === 'rejected' && <XCircle className="size-3" />}
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </Badge>
                                            </div>

                                            <Badge variant="secondary" className={`gap-1.5 mb-3 ${typeConfig.color}`}>
                                                <TypeIcon className="size-3.5" />
                                                {typeConfig.label}
                                            </Badge>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4" />
                                                    <span>
                                                        {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        {request.startDate !== request.endDate && (
                                                            <> - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-4" />
                                                    <span>{getDayCount(request.startDate, request.endDate)} day(s)</span>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/30">
                                                <MessageSquare className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                <p className="text-sm">{request.reason}</p>
                                            </div>

                                            {request.rejectionReason && (
                                                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100">
                                                    <p className="text-sm text-red-700">
                                                        <strong>Rejection reason:</strong> {request.rejectionReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        {request.status === 'pending' && (
                                            <div className="flex lg:flex-col gap-3 p-4 lg:border-l border-t lg:border-t-0 bg-secondary/10 justify-center lg:w-40">
                                                <Button
                                                    className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 rounded-xl"
                                                    onClick={() => {
                                                        setSelectedRequest(request)
                                                        setActionType('approve')
                                                    }}
                                                >
                                                    <CheckCircle2 className="size-4 mr-1.5" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 lg:flex-none rounded-xl text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                                                    onClick={() => {
                                                        setSelectedRequest(request)
                                                        setActionType('reject')
                                                    }}
                                                >
                                                    <XCircle className="size-4 mr-1.5" />
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

            {/* Action Dialog */}
            <Dialog open={!!actionType} onOpenChange={() => {
                setActionType(null)
                setSelectedRequest(null)
                setRejectionReason("")
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">
                            {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve'
                                ? 'Are you sure you want to approve this leave request?'
                                : 'Please provide a reason for rejecting this request'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="p-4 rounded-xl bg-secondary/30 my-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar className="size-10">
                                    <AvatarFallback className="bg-primary/10 text-sm">
                                        {getUserById(selectedRequest.userId)?.firstName[0]}
                                        {getUserById(selectedRequest.userId)?.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">
                                        {getUserById(selectedRequest.userId)?.firstName} {getUserById(selectedRequest.userId)?.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {leaveTypeConfig[selectedRequest.type]?.label} • {getDayCount(selectedRequest.startDate, selectedRequest.endDate)} day(s)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {actionType === 'reject' && (
                        <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please explain why this request is being rejected..."
                            className="min-h-[100px] rounded-xl"
                        />
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setActionType(null)
                                setSelectedRequest(null)
                                setRejectionReason("")
                            }}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAction}
                            disabled={isProcessing || (actionType === 'reject' && !rejectionReason.trim())}
                            className={`rounded-xl ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive hover:bg-destructive/90'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {actionType === 'approve' ? (
                                        <><CheckCircle2 className="size-4 mr-1.5" /> Confirm Approval</>
                                    ) : (
                                        <><XCircle className="size-4 mr-1.5" /> Confirm Rejection</>
                                    )}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function getDayCount(start: string, end: string): number {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}
