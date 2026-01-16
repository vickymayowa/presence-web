"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Megaphone, Send } from "lucide-react"

interface BroadcastModalProps {
    isOpen: boolean
    onClose: () => void
}

export function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        title: "",
        message: "",
        type: "announcement",
        role: "all",
        actionUrl: "/dashboard",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/notifications/broadcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    role: formData.role === "all" ? undefined : formData.role
                }),
            })

            if (!res.ok) throw new Error("Failed to send broadcast")

            toast.success("Broadcast sent successfully!")
            onClose()
            setFormData({
                title: "",
                message: "",
                type: "announcement",
                role: "all",
                actionUrl: "/dashboard",
            })
        } catch (error) {
            toast.error("Failed to send broadcast. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none bg-background">
                <div className="bg-primary/5 p-8 border-b border-primary/10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Megaphone className="w-6 h-6 text-primary" />
                    </div>
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-2xl font-serif">Send Broadcast</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Send a real-time notification to your team members.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                Title
                            </Label>
                            <Input
                                id="title"
                                placeholder="Standup Update / Important Announcement"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="h-11 rounded-xl border-border/40 bg-secondary/5 focus-visible:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Enter your message here..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                className="min-h-[120px] rounded-xl border-border/40 bg-secondary/5 focus-visible:ring-primary/20 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Target Group
                                </Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-border/40 bg-secondary/5">
                                        <SelectValue placeholder="Select target" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="all">Everyone</SelectItem>
                                        <SelectItem value="staff">Staff Only</SelectItem>
                                        <SelectItem value="manager">Managers Only</SelectItem>
                                        <SelectItem value="hr">HR Only</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Category
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl border-border/40 bg-secondary/5">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="reminder">Reminder</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 lg:pt-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border-border/40 bg-transparent hover:bg-secondary/20 transition-all font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium gap-2 shadow-lg shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin rounded-full" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Broadcast
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
