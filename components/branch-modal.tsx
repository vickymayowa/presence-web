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
import { useCreateBranchMutation, useUpdateBranchMutation, useUsersQuery } from "@/lib/queries/presence-queries"
import { toast } from "sonner"
import { ControllerRenderProps } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"

const branchSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    location: z.string().optional(),
    address: z.string().optional(),
    userIds: z.array(z.string()).optional(),
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
            userIds: [],
        },
    })

    const { data: users = [] } = useUsersQuery()
    const [searchTerm, setSearchTerm] = React.useState("")

    const filteredUsers = React.useMemo(() => {
        return users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [users, searchTerm])

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
                userIds: [],
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

                        {!initialData && (
                            <div className="space-y-3 pt-2">
                                <FormLabel className="text-sm font-medium">Assign Initial Staff (Optional)</FormLabel>
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search employees..."
                                        className="pl-9 h-9 rounded-xl border-border/30 bg-secondary/5"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <ScrollArea className="h-48 rounded-xl border border-border/40 p-2">
                                    <div className="space-y-1">
                                        {filteredUsers.length === 0 ? (
                                            <p className="text-xs text-center py-8 text-muted-foreground italic">No employees found</p>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                                                    <Checkbox
                                                        id={`user-${user.id}`}
                                                        checked={form.watch("userIds")?.includes(user.id)}
                                                        onCheckedChange={(checked) => {
                                                            const currentIds = form.getValues("userIds") || []
                                                            if (checked) {
                                                                form.setValue("userIds", [...currentIds, user.id])
                                                            } else {
                                                                form.setValue("userIds", currentIds.filter(id => id !== user.id))
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`user-${user.id}`}
                                                        className="text-sm font-light flex-1 cursor-pointer"
                                                    >
                                                        {user.firstName} {user.lastName}
                                                        <span className="text-[10px] text-muted-foreground block leading-none">{user.position} • {user.department}</span>
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

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
