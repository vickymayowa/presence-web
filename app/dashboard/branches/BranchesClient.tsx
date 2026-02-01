"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    MapPin,
    Plus,
    Users,
    Building2,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    ArrowRight
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useBranchesQuery, useDeleteBranchMutation, useBranchQuery } from "@/lib/queries/presence-queries"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BranchModal } from "@/components/branch-modal"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function BranchesPage() {
    const { user: currentUser } = useAuth()
    const { data: branches = [], isLoading } = useBranchesQuery()
    const deleteBranchMutation = useDeleteBranchMutation()

    const [searchQuery, setSearchQuery] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedBranch, setSelectedBranch] = React.useState<any>(null)
    const [branchToDelete, setBranchToDelete] = React.useState<string | null>(null)
    const [viewingBranchId, setViewingBranchId] = React.useState<string | null>(null)

    const { data: branchDetails, isLoading: isLoadingDetails } = useBranchQuery(viewingBranchId || "")

    if (!currentUser) return null

    const filteredBranches = branches.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (branch: any) => {
        setSelectedBranch(branch)
        setIsModalOpen(true)
    }

    const handleDelete = async () => {
        if (!branchToDelete) return
        try {
            await deleteBranchMutation.mutateAsync(branchToDelete)
            toast.success("Branch deleted successfully")
            setBranchToDelete(null)
        } catch (error) {
            toast.error("Failed to delete branch")
        }
    }

    const isAuthorized = currentUser.role === 'ceo' || currentUser.role === 'hr'

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-serif tracking-tight">Company Branches</h2>
                    <p className="text-muted-foreground font-light text-lg">
                        Manage your physical office locations and staff assignments.
                    </p>
                </div>
                {isAuthorized && (
                    <Button
                        onClick={() => { setSelectedBranch(null); setIsModalOpen(true); }}
                        className="rounded-2xl h-12 px-6 bg-primary text-primary-foreground transition-all hover:scale-[1.02]"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Branch
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search branches by name or location..."
                        className="pl-10 h-12 rounded-xl border-border/40 bg-secondary/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="border-border/40 animate-pulse">
                            <CardContent className="h-48" />
                        </Card>
                    ))
                ) : filteredBranches.length === 0 ? (
                    <Card className="col-span-full py-12 border-dashed flex flex-col items-center justify-center text-center text-muted-foreground bg-secondary/5">
                        <Building2 className="h-12 w-12 mb-4 opacity-20" />
                        <p className="font-light italic">No branches found.</p>
                        {isAuthorized && (
                            <Button variant="link" onClick={() => setIsModalOpen(true)}>Add your first branch</Button>
                        )}
                    </Card>
                ) : (
                    filteredBranches.map(branch => (
                        <Card key={branch.id} className="group border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                            <CardHeader className="relative pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-primary/5 rounded-2xl">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    {isAuthorized && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                                                <DropdownMenuItem onClick={() => handleEdit(branch)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit Branch
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setBranchToDelete(branch.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Branch
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <CardTitle className="font-serif text-xl">{branch.name}</CardTitle>
                                    <div className="flex items-center gap-1.5 text-muted-foreground mt-1 text-sm font-light">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {branch.location || 'No location set'}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                {branch.address && (
                                    <p className="text-xs text-muted-foreground font-light line-clamp-2 min-h-[2rem]">
                                        {branch.address}
                                    </p>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {/* Static preview avatars if we had user counts, for now just show count */}
                                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border-2 border-background">
                                                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {branch._count?.users || 0} Staff Members
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-xl h-8 px-3 text-xs gap-1 hover:bg-primary/5 hover:text-primary transition-colors"
                                        onClick={() => setViewingBranchId(branch.id)}
                                    >
                                        View Staff <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Branch Staff List (Side Panel / Overlay style) */}
            {viewingBranchId && (
                <Card className="mt-8 border-primary/20 bg-primary/5 animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
                        <div>
                            <CardTitle className="font-serif text-2xl">
                                Staff at {branches.find(b => b.id === viewingBranchId)?.name}
                            </CardTitle>
                            <CardDescription>
                                List of all employees assigned to this location.
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setViewingBranchId(null)} className="rounded-xl">
                            Close
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isLoadingDetails ? (
                            <div className="py-12 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : branchDetails?.users?.length === 0 ? (
                            <p className="py-12 text-center text-muted-foreground italic font-light font-serif">
                                No staff assigned to this branch yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {branchDetails?.users?.map((staff: any) => (
                                    <div key={staff.id} className="flex items-center gap-3 p-3 bg-background rounded-2xl border border-border/40 shadow-sm">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={staff.avatar} />
                                            <AvatarFallback>{staff.firstName[0]}{staff.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">{staff.firstName} {staff.lastName}</p>
                                            <p className="text-[10px] text-muted-foreground truncate">{staff.position || staff.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <BranchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedBranch}
            />

            <AlertDialog open={!!branchToDelete} onOpenChange={(open) => !open && setBranchToDelete(null)}>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-serif">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the branch
                            from your organization records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-xl bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
