"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Send, Users, Shield, Info, Loader2, Plus, Calendar as CalendarIcon, Filter, Trash2, Clock } from "lucide-react"
import { useAnnouncementsQuery, useCreateAnnouncementMutation } from "@/lib/queries/presence-queries"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function AnnouncementsPage() {
    const { user } = useAuth()
    const { data: announcements = [], isLoading } = useAnnouncementsQuery()
    const createMutation = useCreateAnnouncementMutation()

    const [title, setTitle] = React.useState("")
    const [content, setContent] = React.useState("")
    const [type, setType] = React.useState("general") // "general", "urgent", "update"
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)

    const isAdmin = user?.role === 'ceo' || user?.role === 'hr'

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !content) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            await createMutation.mutateAsync({
                title,
                content,
                type
            })

            toast.success("Announcement published successfully!")
            setTitle("")
            setContent("")
            setType("general")
            setIsCreateOpen(false)
        } catch (error: any) {
            toast.error(error.message || "Failed to publish announcement")
        }
    }

    const typeColors: Record<string, string> = {
        urgent: "bg-red-500/10 text-red-600 border-red-200",
        update: "bg-blue-500/10 text-blue-600 border-blue-200",
        general: "bg-gray-500/10 text-gray-600 border-gray-200",
    }

    if (isLoading) {
        return (
            <div className="space-y-8 max-w-5xl mx-auto">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-64 rounded-xl" />
                    <Skeleton className="h-6 w-96 rounded-xl" />
                </div>
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-48 w-full rounded-3xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Announcements</h1>
                    <p className="text-lg text-muted-foreground font-light">
                        Stay updated with the latest organizational signals and workplace news.
                    </p>
                </div>
                {isAdmin && (
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl h-14 px-8 bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                                <Plus className="size-5 mr-3" />
                                Post Announcement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                            <div className="h-2 bg-primary" />
                            <form onSubmit={handleCreate}>
                                <DialogHeader className="p-8 pb-0">
                                    <DialogTitle className="text-2xl font-serif">New Announcement</DialogTitle>
                                    <DialogDescription>
                                        Share critical updates or general information with your team.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Title</Label>
                                        <Input
                                            placeholder="e.g., Upcoming Holiday Schedule"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="rounded-2xl h-12 bg-secondary/5 border-border/40 focus:ring-primary/10"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Type</Label>
                                        <Select value={type} onValueChange={setType}>
                                            <SelectTrigger className="rounded-2xl h-12 bg-secondary/5 border-border/40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="general">General Information</SelectItem>
                                                <SelectItem value="update">Policy Update</SelectItem>
                                                <SelectItem value="urgent">Urgent Announcement</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Content</Label>
                                        <Textarea
                                            placeholder="Write the announcement details here..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="rounded-2xl min-h-[150px] bg-secondary/5 border-border/40 resize-none p-4"
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="p-8 pt-0 flex gap-3 sm:justify-end">
                                    <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl">Cancel</Button>
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="rounded-xl px-8 bg-primary"
                                    >
                                        {createMutation.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-4 mr-2" />}
                                        Publish
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {announcements.length === 0 ? (
                    <div className="py-20 text-center space-y-4 bg-secondary/5 rounded-[40px] border border-dashed border-border/40">
                        <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                            <Megaphone className="size-10 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-medium">No Announcements Yet</h3>
                            <p className="text-muted-foreground font-light">
                                Check back later for official workplace signals.
                            </p>
                        </div>
                    </div>
                ) : (
                    announcements.map((announcement: any) => (
                        <Card key={announcement.id} className="group overflow-hidden rounded-[40px] border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                            <CardHeader className="p-8 pb-0 flex flex-row items-start justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={`capitalize rounded-lg px-2.5 py-0.5 text-[11px] font-bold tracking-wider ${typeColors[announcement.type] || typeColors.general}`}>
                                            {announcement.type}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
                                            <Clock className="size-3.5" />
                                            {format(new Date(announcement.createdAt), "MMM d, yyyy • h:mm a")}
                                        </div>
                                    </div>
                                    <CardTitle className="text-3xl font-serif">{announcement.title}</CardTitle>
                                </div>
                                <div className="p-4 bg-secondary/5 rounded-3xl opacity-40 group-hover:opacity-100 transition-opacity">
                                    <Megaphone className="size-6 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-6">
                                <p className="text-lg text-muted-foreground/80 font-light leading-relaxed whitespace-pre-wrap">
                                    {announcement.content}
                                </p>
                            </CardContent>
                            <Separator className="mx-8 w-auto opacity-40" />
                            <CardFooter className="p-8 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-10 border-2 border-white shadow-sm">
                                        <AvatarImage src={announcement.author.avatar || ""} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {announcement.author.firstName[0]}{announcement.author.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{announcement.author.firstName} {announcement.author.lastName}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">Official Broadcast</span>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <Button variant="ghost" size="icon" className="rounded-2xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <Trash2 className="size-5" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
