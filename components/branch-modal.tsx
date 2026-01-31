"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateBranchMutation, useUpdateBranchMutation } from "@/lib/queries/presence-queries"
import { toast } from "sonner"
import { ControllerRenderProps } from "react-hook-form"

const branchSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    location: z.string().optional(),
    address: z.string().optional(),
})

type BranchFormValues = z.infer<typeof branchSchema>

interface BranchModalProps {
    isOpen: boolean
    onClose: () => void
    initialData?: { id: string; name: string; location?: string; address?: string }
}

export function BranchModal({ isOpen, onClose, initialData }: BranchModalProps) {
    const createBranch = useCreateBranchMutation()
    const updateBranch = useUpdateBranchMutation()

    const form = useForm<BranchFormValues>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            name: "",
            location: "",
            address: "",
        },
    })

    React.useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                location: initialData.location || "",
                address: initialData.address || "",
            })
        } else {
            form.reset({
                name: "",
                location: "",
                address: "",
            })
        }
    }, [initialData, form, isOpen])

    const onSubmit = (values: BranchFormValues) => {
        if (initialData) {
            updateBranch.mutate({
                branchId: initialData.id,
                ...values
            }, {
                onSuccess: () => {
                    toast.success("Branch updated successfully")
                    onClose()
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to update branch")
                }
            })
        } else {
            createBranch.mutate(values, {
                onSuccess: () => {
                    toast.success("Branch created successfully")
                    onClose()
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to create branch")
                }
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">
                        {initialData ? "Edit Branch" : "Add New Branch"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update the details of this location." : "Create a new physical location for your company."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }: { field: ControllerRenderProps<BranchFormValues, "name"> }) => (
                                <FormItem>
                                    <FormLabel>Branch Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Head Office, Lagos" {...field} className="rounded-xl border-border/40" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }: { field: ControllerRenderProps<BranchFormValues, "location"> }) => (
                                <FormItem>
                                    <FormLabel>Region / City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Ikeja, Lagos" {...field} className="rounded-xl border-border/40" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }: { field: ControllerRenderProps<BranchFormValues, "address"> }) => (
                                <FormItem>
                                    <FormLabel>Full Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Example Street..." {...field} className="rounded-xl border-border/40" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl px-8 bg-primary"
                                disabled={createBranch.isPending || updateBranch.isPending}
                            >
                                {createBranch.isPending || updateBranch.isPending ? "Saving..." : initialData ? "Update Branch" : "Create Branch"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
