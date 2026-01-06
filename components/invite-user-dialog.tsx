"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserPlus, Loader2, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import type { UserRole } from "@/lib/types"

export function InviteUserDialog({
    companySlug,
    onInvite
}: {
    companySlug: string;
    onInvite?: () => void;
}) {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [role, setRole] = React.useState<UserRole>("staff")
    const [inviteLink, setInviteLink] = React.useState("")
    const [copied, setCopied] = React.useState(false)

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Generate mock invite link
        const link = `https://presence.io/${companySlug}/join?token=${Math.random().toString(36).substring(7)}`
        setInviteLink(link)

        toast.success("Invite Link Generated", {
            description: email ? `Email sent to ${email}` : "Link ready to copy"
        })

        setIsLoading(false)
        if (onInvite) onInvite()
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success("Link copied to clipboard")
    }

    const reset = () => {
        setInviteLink("")
        setEmail("")
        setRole("staff")
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) setTimeout(reset, 300)
        }}>
            <DialogTrigger asChild>
                <Button className="rounded-xl">
                    <UserPlus className="size-4 mr-2" />
                    Invite Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Invite New Member</DialogTitle>
                    <DialogDescription>
                        Send an invitation link to a new employee to join your workspace.
                    </DialogDescription>
                </DialogHeader>

                {!inviteLink ? (
                    <form onSubmit={handleInvite} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email address <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                                <SelectTrigger id="role" className="rounded-xl">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="hr">HR Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                                Cancel
                            </Button>
                            <Button type="button" variant="secondary" onClick={handleInvite} disabled={isLoading} className="rounded-xl">
                                Generate Link
                            </Button>
                            <Button type="submit" disabled={isLoading || !email} className="rounded-xl">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Invitation"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="space-y-4 py-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center">
                            <Check className="size-8 mx-auto mb-2" />
                            <p className="font-medium">Invitation Sent!</p>
                            <p className="text-xs opacity-90">We've emailed {email} with instructions.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Copy Invite Link</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={inviteLink}
                                    readOnly
                                    className="booking-wider text-xs font-mono bg-secondary/30 rounded-xl"
                                />
                                <Button size="icon" variant="outline" onClick={copyToClipboard} className="rounded-xl shrink-0">
                                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                                </Button>
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button onClick={() => setOpen(false)} className="rounded-xl w-full">
                                Done
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
