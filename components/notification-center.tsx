"use client"

import * as React from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Bell,
    BellOff,
    CheckCheck,
    Megaphone,
    Clock,
    UserCheck,
    Calendar,
    MessageSquare,
    Settings
} from "lucide-react"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

export function NotificationCenter() {
    const { isSubscribed, subscribe } = usePushNotifications()
    const [notifications, setNotifications] = React.useState<any[]>([])
    const [unreadCount, setUnreadCount] = React.useState(0)
    const [open, setOpen] = React.useState(false)

    const fetchNotifications = React.useCallback(async () => {
        try {
            const res = await fetch("/api/notifications")
            if (res.ok) {
                const { data } = await res.json()
                setNotifications(data)
                setUnreadCount(data.filter((n: any) => !n.read).length)
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err)
        }
    }, [])

    React.useEffect(() => {
        fetchNotifications()
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [fetchNotifications])

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            fetchNotifications()
        } catch (err) {
            console.error("Failed to mark as read:", err)
        }
    }

    const markAllAsRead = async () => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ all: true })
            })
            fetchNotifications()
            toast.success("All notifications marked as read")
        } catch (err) {
            console.error("Failed to mark all as read:", err)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'attendance': return <UserCheck className="w-4 h-4 text-green-500" />
            case 'announcement': return <Megaphone className="w-4 h-4 text-blue-500" />
            case 'reminder': return <Clock className="w-4 h-4 text-orange-500" />
            case 'leave': return <Calendar className="w-4 h-4 text-purple-500" />
            default: return <MessageSquare className="w-4 h-4 text-muted-foreground" />
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-muted-foreground hover:text-foreground relative"
                >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 rounded-2xl border-border/40 overflow-hidden shadow-2xl" align="end">
                <div className="bg-secondary/30 p-4 border-b border-border/20 flex items-center justify-between">
                    <div>
                        <h3 className="font-serif text-lg leading-none">Notifications</h3>
                        <p className="text-xs text-muted-foreground mt-1">You have {unreadCount} unread messages</p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={markAllAsRead} title="Mark all as read">
                            <CheckCheck className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-lg ${isSubscribed ? 'text-green-500' : 'text-muted-foreground'}`}
                            onClick={subscribe}
                            title={isSubscribed ? 'Notifications Enabled' : 'Enable Push Notifications'}
                        >
                            {isSubscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-border/10">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 flex gap-4 hover:bg-secondary/10 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0 border border-border/20`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm font-medium leading-none ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                                <Bell className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h4 className="font-serif text-base">All caught up!</h4>
                            <p className="text-xs text-muted-foreground mt-1 px-8">No new notifications at the moment.</p>
                        </div>
                    )}
                </ScrollArea>

                <div className="p-3 bg-secondary/10 border-t border-border/20 text-center">
                    <Button variant="link" className="text-[10px] h-auto p-0 font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                        View Notification History
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
