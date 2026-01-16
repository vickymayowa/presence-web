"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Calendar,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    Search,
    Filter
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useLeavesQuery, useRequestLeaveMutation, useUpdateLeaveMutation } from "@/lib/queries/presence-queries"
import { toast } from "sonner"
import { RequestLeaveModal } from "@/components/request-leave-modal"

export default function LeavesPage() {
    const { user } = useAuth()
    const { data: leaves = [], isLoading } = useLeavesQuery()
    const requestLeave = useRequestLeaveMutation()
    const updateLeave = useUpdateLeaveMutation()
    const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false)

    if (!user) return null

    const myLeaves = leaves.filter(l => l.userId === user.id)
    const pendingApprovals = user.role !== 'staff' ? leaves.filter(l => l.status === 'pending') : []

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200'
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-secondary text-secondary-foreground'
        }
    }

    const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await updateLeave.mutateAsync({ id, status })
            toast.success(`Leave request ${status} successfully`)
        } catch (error) {
            toast.error(`Failed to ${status} leave request`)
        }
    }

    const handleRequestLeave = async (data: any) => {
        try {
            await requestLeave.mutateAsync(data)
            toast.success("Leave request submitted successfully")
            setIsRequestModalOpen(false)
        } catch (error) {
            toast.error("Failed to submit leave request")
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-serif tracking-tight">Leave Management</h2>
                    <p className="text-muted-foreground font-light text-lg">
                        Plan your time off and track your leave requests.
                    </p>
                </div>
                <Button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="rounded-2xl h-12 px-6 bg-primary text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="mr-2 h-4 w-4" /> Request Leave
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Leave Balance Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-border/40 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <CardHeader>
                            <CardTitle className="font-serif text-xl">Your Balance</CardTitle>
                            <CardDescription>Available days for this year</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <BalanceItem label="Annual Leave" used={12} total={24} color="bg-primary" />
                            <BalanceItem label="Sick Leave" used={2} total={10} color="bg-orange-500" />
                            <BalanceItem label="Unpaid Leave" used={0} total={5} color="bg-blue-500" />
                        </CardContent>
                    </Card>

                    <Card className="border-border/40">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3 text-sm">
                                <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                                <p className="text-muted-foreground font-light">Requests take 2-3 business days to process.</p>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-primary shrink-0" />
                                <p className="text-muted-foreground font-light">Next public holiday: Friday, Jan 24 (Lunar New Year)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Areas */}
                <div className="lg:col-span-2 space-y-8">
                    {user.role !== 'staff' && pendingApprovals.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-serif">Pending Approvals</h3>
                            <div className="grid gap-4">
                                {pendingApprovals.map(leave => (
                                    <Card key={leave.id} className="border-primary/20 bg-primary/2">
                                        <CardContent className="p-4 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={leave.user?.avatar || undefined} />
                                                    <AvatarFallback>{leave.user?.firstName?.[0]}{leave.user?.lastName?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{leave.user?.firstName} {leave.user?.lastName}</p>
                                                    <p className="text-xs text-muted-foreground">{leave.type} • {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-lg h-8 border-red-200 text-red-600 hover:bg-red-50"
                                                    disabled={updateLeave.isPending}
                                                    onClick={() => handleUpdateStatus(leave.id, 'rejected')}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="rounded-lg h-8 bg-green-600 hover:bg-green-700 text-white border-0"
                                                    disabled={updateLeave.isPending}
                                                    onClick={() => handleUpdateStatus(leave.id, 'approved')}
                                                >
                                                    Approve
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-serif">Request History</h3>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search..." className="pl-9 h-9 w-[150px] md:w-[200px] rounded-xl border-border/40" />
                                </div>
                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/40">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <Card className="border-border/30 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/30">
                                    {isLoading ? (
                                        <div className="p-8 text-center text-muted-foreground italic">Loading history...</div>
                                    ) : myLeaves.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                                            <p className="text-muted-foreground font-light">No leave history found.</p>
                                        </div>
                                    ) : (
                                        myLeaves.map(leave => (
                                            <div key={leave.id} className="flex items-center justify-between p-6 hover:bg-secondary/20 transition-colors">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm capitalize">{leave.type.replace('-', ' ')}</p>
                                                        <Badge className={`rounded-lg uppercase text-[9px] font-bold ${getStatusStyle(leave.status)}`}>
                                                            {leave.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground font-light">
                                                        {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()} • {calculateDays(leave.startDate, leave.endDate)} days
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="rounded-full">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <RequestLeaveModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                onSubmit={handleRequestLeave}
                loading={requestLeave.isPending}
            />
        </div>
    )
}

function BalanceItem({ label, used, total, color }: { label: string; used: number; total: number; color: string }) {
    const percentage = (used / total) * 100
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-light text-muted-foreground">{label}</span>
                <span className="font-medium">{total - used} left</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-1000`}
                    style={{ width: `${100 - percentage}%` }}
                />
            </div>
        </div>
    )
}

function calculateDays(start: string, end: string) {
    const s = new Date(start)
    const e = new Date(end)
    const diff = e.getTime() - s.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1
}
