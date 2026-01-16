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
import { Calendar as CalendarIcon } from "lucide-react"

interface RequestLeaveModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    loading?: boolean
}

export function RequestLeaveModal({ isOpen, onClose, onSubmit, loading }: RequestLeaveModalProps) {
    const [formData, setFormData] = React.useState({
        type: "annual",
        startDate: "",
        endDate: "",
        reason: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none bg-background">
                <div className="bg-primary/5 p-8 border-b border-primary/10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                    </div>
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-2xl font-serif">Request Leave</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Submit a new leave request for approval.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                Leave Type
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger className="h-11 rounded-xl border-border/40 bg-secondary/5">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="annual">Annual Leave</SelectItem>
                                    <SelectItem value="sick">Sick Leave</SelectItem>
                                    <SelectItem value="personal">Personal Leave</SelectItem>
                                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                                    <SelectItem value="paternity">Paternity Leave</SelectItem>
                                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                                    <SelectItem value="work_from_home">Work From Home</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                    className="h-11 rounded-xl border-border/40 bg-secondary/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                    End Date
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                    className="h-11 rounded-xl border-border/40 bg-secondary/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                Reason
                            </Label>
                            <Textarea
                                id="reason"
                                placeholder="State the reason for your leave..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                                className="min-h-[100px] rounded-xl border-border/40 bg-secondary/5 resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
