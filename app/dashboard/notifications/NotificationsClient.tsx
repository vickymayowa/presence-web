"use client"

import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { useNotificationsQuery, useUpdateNotificationMutation, useDeleteNotificationMutation } from "@/lib/queries/presence-queries"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Bell,
    CheckCircle2,
    Clock,
    Info,
    Megaphone,
    Trash2,
    Calendar,
    ChevronRight,
    Loader2,
    MoreVertical,
    Edit2
} from "lucide-react"
import { format } from "date-fns"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const notificationTypeConfig: Record<string, { icon: any, color: string, bg: string }> = {
    attendance: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100/50" },
    announcement: { icon: Megaphone, color: "text-purple-600", bg: "bg-purple-100/50" },
    leave: { icon: Calendar, color: "text-orange-600", bg: "bg-orange-100/50" },
    reminder: { icon: Info, color: "text-amber-600", bg: "bg-amber-100/50" },
    info: { icon: Info, color: "text-slate-600", bg: "bg-slate-100/50" },
    success: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100/50" },
    error: { icon: Info, color: "text-red-600", bg: "bg-red-100/50" },
    warning: { icon: Info, color: "text-amber-600", bg: "bg-amber-100/50" },
}

export default function NotificationsClient() {
    const { user } = useAuth()
    const { data: notifications = [], isLoading } = useNotificationsQuery(user?.id || "")
    const updateMutation = useUpdateNotificationMutation()
    const deleteMutation = useDeleteNotificationMutation()

    const [editingNotification, setEditingNotification] = React.useState<any>(null)

    const unreadCount = notifications.filter(n => !n.read).length

    const handleMarkAsRead = (id: string) => {
        updateMutation.mutate({ id, read: true })
    }

    const handleMarkAllRead = () => {
        updateMutation.mutate({ id: "all", all: true, read: true })
    }

    const handleDelete = (id: string) => {
        deleteMutation.mutate({ id })
        toast.success("Notification deleted")
    }

    if (!user) return null

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif tracking-tight">Notification Center</h1>
                    <p className="text-lg text-muted-foreground font-light">
                        Stay updated with real-time signals and communications from management.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        onClick={handleMarkAllRead}
                        className="rounded-2xl h-11 border-primary/20 hover:bg-primary/5 text-primary"
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="bg-secondary/5 p-1 h-auto rounded-2xl border border-border/40 inline-flex">
                    <TabsTrigger value="all" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        All Signals
                        <Badge variant="secondary" className="ml-2 bg-secondary/20">{notifications.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Unread
                        {unreadCount > 0 && (
                            <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount}</Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <NotificationList
                        notifications={notifications}
                        isLoading={isLoading}
                        onMarkRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        onEdit={setEditingNotification}
                    />
                </TabsContent>

                <TabsContent value="unread" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <NotificationList
                        notifications={notifications.filter(n => !n.read)}
                        isLoading={isLoading}
                        onMarkRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        onEdit={setEditingNotification}
                    />
                </TabsContent>
            </Tabs>

            <EditNotificationDialog
                notification={editingNotification}
                open={!!editingNotification}
                onOpenChange={(open) => !open && setEditingNotification(null)}
            />
        </div>
    )
}

function NotificationList({ notifications, isLoading, onMarkRead, onDelete, onEdit }: {
    notifications: any[],
    isLoading: boolean,
    onMarkRead: (id: string) => void,
    onDelete: (id: string) => void,
    onEdit: (notif: any) => void
}) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                <p className="text-muted-foreground font-light italic">Synchronizing signals...</p>
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <Card className="border-border/30 bg-secondary/5">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="p-4 bg-background rounded-full border border-border/20">
                        <Bell className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div className="max-w-xs space-y-2">
                        <p className="font-serif text-xl">Silence is golden</p>
                        <p className="text-sm text-muted-foreground font-light">
                            You're all caught up! No new notifications at the moment.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            {notifications.map((notification) => (
                <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkRead={onMarkRead}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}

function NotificationCard({ notification, onMarkRead, onDelete, onEdit }: {
    notification: any,
    onMarkRead: (id: string) => void,
    onDelete: (id: string) => void,
    onEdit: (notif: any) => void
}) {
    const { user } = useAuth()
    const config = notificationTypeConfig[notification.type] || notificationTypeConfig.info
    const Icon = config.icon
    const isManagement = user?.role === 'ceo' || user?.role === 'hr'

    return (
        <Card
            className={cn(
                "border-border/30 transition-all hover:bg-secondary/5 cursor-pointer group",
                !notification.read && "bg-primary/[0.02] border-primary/20 shadow-sm"
            )}
            onClick={() => !notification.read && onMarkRead(notification.id)}
        >
            <CardContent className="p-5 flex gap-5">
                <div className={cn("shrink-0 p-3 rounded-2xl border border-transparent", config.bg, config.color)}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className={cn("text-sm font-semibold", !notification.read && "text-primary")}>
                                {notification.title}
                            </p>
                            {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
                                {format(new Date(notification.createdAt), "MMM dd, hh:mm a")}
                            </p>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl w-40">
                                    {!notification.read && (
                                        <DropdownMenuItem onClick={() => onMarkRead(notification.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Mark as read
                                        </DropdownMenuItem>
                                    )}
                                    {isManagement && (
                                        <DropdownMenuItem onClick={() => onEdit(notification)}>
                                            <Edit2 className="mr-2 h-4 w-4" />
                                            Edit Signal
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => onDelete(notification.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        {notification.message}
                    </p>
                    {notification.actionUrl && (
                        <Button
                            variant="link"
                            className="p-0 h-auto text-xs text-primary font-medium hover:no-underline"
                            asChild
                        >
                            <a href={notification.actionUrl} className="flex items-center gap-1 group/link">
                                Take Action
                                <ChevronRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </Button>
                    )}
                </div>
                <div className="shrink-0 self-center">
                    {/* Actions moved to dropdown */}
                </div>
            </CardContent>
        </Card>
    )
}

function EditNotificationDialog({ notification, open, onOpenChange }: {
    notification: any,
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    const updateMutation = useUpdateNotificationMutation()
    const [title, setTitle] = React.useState("")
    const [message, setMessage] = React.useState("")

    React.useEffect(() => {
        if (notification) {
            setTitle(notification.title)
            setMessage(notification.message)
        }
    }, [notification])

    const handleSave = async () => {
        try {
            await updateMutation.mutateAsync({
                id: notification.id,
                title,
                message
            })
            toast.success("Notification updated")
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to update notification")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">Edit Signal</DialogTitle>
                    <DialogDescription>
                        Update the content of this notification. Changes apply only to this instance.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-xl h-12 bg-secondary/5"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message Body</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="rounded-xl min-h-[120px] bg-secondary/5 resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="rounded-xl bg-primary px-8"
                    >
                        {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
