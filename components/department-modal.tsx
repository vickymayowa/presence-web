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

interface DepartmentModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: DepartmentFormData) => void
    initialData?: DepartmentFormData
    mode?: "create" | "edit"
}

export interface DepartmentFormData {
    name: string
    head: string
    employees: string
    onsite: string
    hybrid: string
    remote: string
}

export function DepartmentModal({ isOpen, onClose, onSubmit, initialData, mode = "create" }: DepartmentModalProps) {
    const { toast } = useToast()
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState<DepartmentFormData>(
        initialData || {
            name: "",
            head: "",
            employees: "",
            onsite: "",
            hybrid: "",
            remote: "",
        },
    )

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        } else {
            setFormData({
                name: "",
                head: "",
                employees: "",
                onsite: "",
                hybrid: "",
                remote: "",
            })
        }
    }, [initialData, isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.head) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        setLoading(false)

        onSubmit(formData)
        toast({
            title: mode === "create" ? "Department Created" : "Department Updated",
            description: `${formData.name} has been successfully ${mode === "create" ? "created" : "updated"}.`,
        })
        onClose()
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

                    {/* Department Head */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Department Head *
                        </Label>
                        <Input
                            name="head"
                            value={formData.head}
                            onChange={handleChange}
                            placeholder="e.g., Sarah Mitchell"
                            className="h-11 rounded-xl border-border/30 bg-secondary/10"
                        />
                    </div>

                    {/* Total Employees */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Total Employees
                        </Label>
                        <Input
                            name="employees"
                            type="number"
                            value={formData.employees}
                            onChange={handleChange}
                            placeholder="24"
                            className="h-11 rounded-xl border-border/30 bg-secondary/10"
                        />
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/20 border border-border/20 space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                            Work Mode Distribution
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-semibold text-muted-foreground">On-site</Label>
                                <Input
                                    name="onsite"
                                    type="number"
                                    value={formData.onsite}
                                    onChange={handleChange}
                                    placeholder="18"
                                    className="h-10 rounded-lg border-border/30 bg-background text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-semibold text-muted-foreground">Hybrid</Label>
                                <Input
                                    name="hybrid"
                                    type="number"
                                    value={formData.hybrid}
                                    onChange={handleChange}
                                    placeholder="4"
                                    className="h-10 rounded-lg border-border/30 bg-background text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-semibold text-muted-foreground">Remote</Label>
                                <Input
                                    name="remote"
                                    type="number"
                                    value={formData.remote}
                                    onChange={handleChange}
                                    placeholder="2"
                                    className="h-10 rounded-lg border-border/30 bg-background text-sm"
                                />
                            </div>
                        </div>
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
