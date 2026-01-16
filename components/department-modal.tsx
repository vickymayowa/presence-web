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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsersQuery } from "@/lib/queries/presence-queries"

interface DepartmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    initialData?: any
    mode?: "create" | "edit"
}

export function DepartmentModal({ isOpen, onClose, onSubmit, initialData, mode = "create" }: DepartmentModalProps) {
    const { toast } = useToast()
    const { data: users = [] } = useUsersQuery()
    console.log(users)
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState<any>(
        initialData || {
            name: "",
            managerId: "",
            description: "",
        },
    )

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                name: "",
                managerId: "",
                description: "",
            })
        }
    }, [initialData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleManagerChange = (value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            managerId: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.managerId) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        try {
            await onSubmit(formData)
            onClose()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process department",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">
                        {mode === "create" ? "Create New Department" : "Edit Department"}
                    </DialogTitle>
                    <DialogDescription className="font-light">
                        {mode === "create"
                            ? "Add a new department to your organization with staffing details."
                            : "Update department information and staffing configuration."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Department Name */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Department Name *
                        </Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Engineering"
                            className="h-11 rounded-xl border-border/30 bg-secondary/10"
                        />
                    </div>

                    {/* Department Head (Manager Selection) */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Department Head *
                        </Label>
                        <Select value={formData.managerId} onValueChange={handleManagerChange}>
                            <SelectTrigger className="h-11 rounded-xl border-border/30 bg-secondary/10">
                                <SelectValue placeholder="Select a manager" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">

                                {/* <SelectValue placeholder="Select a Department Head" /> */}
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.firstName} ({user.role})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-11 rounded-xl bg-transparent"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 h-11 rounded-xl font-serif" disabled={loading}>
                            {loading ? "Processing..." : mode === "create" ? "Create Department" : "Update Department"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
