"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useActivitiesQuery } from "@/lib/queries/presence-queries"
import {
    LogIn,
    LogOut,
    Eye,
    UserPlus,
    Activity,
    Building2,
    Calendar,
    CheckCircle2,
    XCircle,
    Megaphone
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityLogProps {
    scope?: 'company' | 'user'
    limit?: number
    className?: string
}

const getActivityIcon = (action: string) => {
    switch (action) {
        case 'LOGIN': return LogIn
        case 'REGISTER': return UserPlus
        case 'CREATE_USER': return UserPlus
        case 'CHECK_IN': return LogIn
        case 'CHECK_OUT': return LogOut
        case 'PAGE_VIEW': return Eye
        case 'CREATE_DEPARTMENT': return Building2
        case 'REQUEST_LEAVE': return Calendar
        case 'LEAVE_APPROVED': return CheckCircle2
        case 'LEAVE_REJECTED': return XCircle
        case 'BROADCAST_ANNOUNCEMENT': return Megaphone
        default: return Activity
    }
}

const getActivityColor = (action: string) => {
    switch (action) {
        case 'LOGIN':
        case 'REGISTER':
        case 'CREATE_USER':
            return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'CHECK_IN':
        case 'LEAVE_APPROVED':
            return 'bg-green-100 text-green-700 border-green-200'
        case 'CHECK_OUT':
        case 'REQUEST_LEAVE':
            return 'bg-orange-100 text-orange-700 border-orange-200'
        case 'LEAVE_REJECTED':
            return 'bg-red-100 text-red-700 border-red-200'
        case 'PAGE_VIEW':
        case 'CREATE_DEPARTMENT':
        case 'BROADCAST_ANNOUNCEMENT':
            return 'bg-purple-100 text-purple-700 border-purple-200'
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

export function ActivityLog({ scope = 'company', limit = 10, className = '' }: ActivityLogProps) {
    const { data: activities = [], isLoading } = useActivitiesQuery(scope, limit)

    if (isLoading) {
        return (
            <Card className={`border-border/40 ${className}`}>
                <CardHeader>
                    <CardTitle className="font-serif text-xl">Recent Activity</CardTitle>
                    <CardDescription>Loading activity logs...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={`border-border/40 ${className}`}>
            <CardHeader>
                <CardTitle className="font-serif text-xl">Recent Activity</CardTitle>
                <CardDescription>
                    {scope === 'company' ? 'Company-wide activity log' : 'Your recent activity'}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {activities.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground italic text-sm">
                        No activity recorded yet
                    </div>
                ) : (
                    <div className="divide-y divide-border/30">
                        {activities.map((activity: any) => {
                            const Icon = getActivityIcon(activity.action)
                            const colorClass = getActivityColor(activity.action)

                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 p-4 hover:bg-secondary/20 transition-colors"
                                >
                                    <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {activity.user && (
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs">
                                                        {activity.user.firstName?.[0]}{activity.user.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <p className="text-sm font-medium leading-none">
                                                {activity.user
                                                    ? `${activity.user.firstName} ${activity.user.lastName}`
                                                    : 'Unknown User'
                                                }
                                            </p>
                                            {activity.user?.role && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                                                    {activity.user.role}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            {activity.description || activity.action}
                                        </p>

                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className={`rounded-lg text-[10px] uppercase font-bold ${colorClass}`}
                                    >
                                        {activity.action.replace('_', ' ')}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
