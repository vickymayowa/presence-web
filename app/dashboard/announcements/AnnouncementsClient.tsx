"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Send, Users, User, Shield, Info, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AnnouncementsPage() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [title, setTitle] = React.useState("")
    const [message, setMessage] = React.useState("")
    const [target, setTarget] = React.useState("all")

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !message) {
            toast.error("Please fill in all fields")
            return
        }

        setIsLoading(true)
        // Simulate sending push notification
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)

        toast.success(`Announcement sent to ${target === 'all' ? 'all staffs' : target}!`)
        setTitle("")
        setMessage("")
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground">Announcements</h1>
                <p className="text-muted-foreground font-light mt-1">
                    Send push notifications and alerts to your team members
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2 border-border/30 overflow-hidden">
                    <div className="h-1 bg-primary" />
                    <CardHeader>
                        <CardTitle className="font-serif">Create New Announcement</CardTitle>
                        <CardDescription>This will be sent as a push notification to selected users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSend} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Notification Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Team Meeting Reminder"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="rounded-xl h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Details of the announcement..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="rounded-xl min-h-[120px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Recipient Group</Label>
                                <Select value={target} onValueChange={setTarget}>
                                    <SelectTrigger className="h-11 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <Users className="size-4" />
                                                <span>All Staffs</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="engineering">Engineering Team</SelectItem>
                                        <SelectItem value="marketing">Marketing Team</SelectItem>
                                        <SelectItem value="managers">All Managers</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="size-4 mr-2 animate-spin" /> Sending...</>
                                ) : (
                                    <><Send className="size-4 mr-2" /> Broadcast Announcement</>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-border/30 bg-secondary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                                <Megaphone className="size-4" />
                                Recent Broadcasts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 rounded-lg bg-card border border-border/40">
                                <p className="text-sm font-medium">Holiday Notice</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">Office will be closed on Friday...</p>
                                <p className="text-[10px] text-muted-foreground mt-2">2 days ago • All Staff</p>
                            </div>
                            <div className="p-3 rounded-lg bg-card border border-border/40">
                                <p className="text-sm font-medium">Systems Update</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">HR portal will be down for maintenance...</p>
                                <p className="text-[10px] text-muted-foreground mt-2">5 days ago • Engineering</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/30 bg-blue-50/50">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Push Notifications</p>
                                    <p className="text-xs text-blue-700/70 mt-1">
                                        Announcement will be delivered directly to employee mobile devices and browsers if they have enabled notifications.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
