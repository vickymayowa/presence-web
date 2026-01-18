"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Send, Users, Shield, Info, Loader2 } from "lucide-react"
import { useBroadcastNotificationMutation } from "@/lib/queries/presence-queries"
import { toast } from "sonner"

export default function AnnouncementsPage() {
    const broadcastMutation = useBroadcastNotificationMutation()
    const [title, setTitle] = React.useState("")
    const [message, setMessage] = React.useState("")
    const [role, setRole] = React.useState("staff")
    const [type, setType] = React.useState("announcement")

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !message) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            await broadcastMutation.mutateAsync({
                title,
                message,
                type,
                role: role === 'all' ? undefined : role,
                actionUrl: "/dashboard"
            })

            toast.success(`Announcement broadcasted successfully!`)
            setTitle("")
            setMessage("")
        } catch (error: any) {
            toast.error(error.message || "Failed to broadcast announcement")
        }
    }

    return (
        <div className="space-y-10 pb-12 max-w-5xl mx-auto">
            <div className="space-y-2 border-b border-border/10 pb-8">
                <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Management Broadcast</h1>
                <p className="text-lg text-muted-foreground font-light">
                    Dispatch organizational signals and critical updates to your workforce.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-border/40 shadow-xl shadow-primary/5 overflow-hidden">
                        <div className="h-1.5 bg-primary/20" />
                        <CardHeader className="bg-secondary/5 border-b border-border/5">
                            <CardTitle className="font-serif text-2xl">Compose Signal</CardTitle>
                            <CardDescription>This message will be distributed across all employee notification centers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSend} className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Title</Label>
                                    <Input
                                        placeholder="e.g. End of Quarter Review"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="rounded-2xl h-12 bg-secondary/5 border-border/40 focus:ring-primary/20 text-base"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Message Body</Label>
                                    <Textarea
                                        placeholder="Type your strategic update or announcement here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="rounded-2xl min-h-[160px] bg-secondary/5 border-border/40 focus:ring-primary/20 text-base resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Recipient Tier</Label>
                                        <Select value={role} onValueChange={setRole}>
                                            <SelectTrigger className="h-12 rounded-2xl bg-secondary/5 border-border/40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="all">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="size-4" />
                                                        <span>Global (All Personnel)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="manager">Management Tier</SelectItem>
                                                <SelectItem value="staff">Associate Tier (Staff)</SelectItem>
                                                <SelectItem value="hr">HR Department</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Signal Type</Label>
                                        <Select value={type} onValueChange={setType}>
                                            <SelectTrigger className="h-12 rounded-2xl bg-secondary/5 border-border/40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="announcement">Global Announcement</SelectItem>
                                                <SelectItem value="reminder">Operational Reminder</SelectItem>
                                                <SelectItem value="info">General Information</SelectItem>
                                                <SelectItem value="attendance">Attendance Policy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl text-lg font-semibold bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                                    disabled={broadcastMutation.isPending}
                                >
                                    {broadcastMutation.isPending ? (
                                        <><Loader2 className="size-5 mr-3 animate-spin" /> Distributing Signal...</>
                                    ) : (
                                        <><Send className="size-5 mr-3" /> Execute Global Broadcast</>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="border-border/40 bg-secondary/5 overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                <Shield className="size-4" />
                                Identity & Integrity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl h-fit">
                                    <Megaphone className="size-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Immutable Records</p>
                                    <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1">
                                        Broadcasts are logged permanently and attributed to your credentialed session.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-border/10">
                                <div className="p-3 bg-blue-50 rounded-2xl h-fit">
                                    <Info className="size-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-blue-900">Push-First Delivery</p>
                                    <p className="text-xs text-blue-700/70 font-light leading-relaxed mt-1">
                                        Announcements trigger instant mobile and desktop notifications for active subscribers.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                        <h4 className="text-sm font-semibold mb-2">Operational Analytics</h4>
                        <p className="text-xs text-muted-foreground font-light">
                            Broadcast reach is calculated based on active socket connections and push token validity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
