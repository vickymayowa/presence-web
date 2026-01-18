"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Building2,
    Calendar,
    ChevronDown,
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Trash2,
    UserX,
    Download
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useUsersQuery, useCreateEmployeeMutation, useDepartmentsQuery } from "@/lib/queries/presence-queries"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"



export default function EmployeesPage() {
    const { user: currentUser } = useAuth()
    const { data: allUsers = [], isLoading: isUsersLoading } = useUsersQuery()
    const { data: departmentsData = [] } = useDepartmentsQuery()
    const createEmployeeMutation = useCreateEmployeeMutation()
    const { toast } = useToast()

    const [searchQuery, setSearchQuery] = React.useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "staff",
        department: "",
        position: ""
    })

    // Pagination state
    const [currentPage, setCurrentPage] = React.useState(1)
    const [itemsPerPage, setItemsPerPage] = React.useState(10)

    // Filter state
    const [roleFilter, setRoleFilter] = React.useState<string>("all")
    const [departmentFilter, setDepartmentFilter] = React.useState<string>("all")
    const [statusFilter, setStatusFilter] = React.useState<string>("all")

    // Bulk selection state
    const [selectedEmployees, setSelectedEmployees] = React.useState<Set<string>>(new Set())

    const handleAddEmployee = async () => {
        try {
            await createEmployeeMutation.mutateAsync(formData)
            toast({
                title: "Success",
                description: "Employee added successfully",
            })
            setIsAddDialogOpen(false)
            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "staff",
                department: "",
                position: ""
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to add employee",
                variant: "destructive"
            })
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Bulk selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(paginatedEmployees.map(emp => emp.id))
            setSelectedEmployees(allIds)
        } else {
            setSelectedEmployees(new Set())
        }
    }

    const handleSelectEmployee = (employeeId: string, checked: boolean) => {
        const newSelected = new Set(selectedEmployees)
        if (checked) {
            newSelected.add(employeeId)
        } else {
            newSelected.delete(employeeId)
        }
        setSelectedEmployees(newSelected)
    }

    const handleBulkDelete = () => {
        toast({
            title: "Bulk Delete",
            description: `${selectedEmployees.size} employee(s) will be deleted`,
        })
        // TODO: Implement bulk delete mutation
        setSelectedEmployees(new Set())
    }

    const handleBulkExport = () => {
        toast({
            title: "Export",
            description: `Exporting ${selectedEmployees.size} employee(s)`,
        })
        // TODO: Implement export functionality
    }

    // Get unique departments and roles for filters
    const departments = React.useMemo(() => {
        const depts = new Set(allUsers.map(u => u.department))
        return Array.from(depts).filter(Boolean)
    }, [allUsers])

    const roles = React.useMemo(() => {
        const roleSet = new Set(allUsers.map(u => u.role))
        return Array.from(roleSet).filter(Boolean)
    }, [allUsers])

    // Apply filters
    const filteredEmployees = React.useMemo(() => {
        return allUsers.filter(u => {
            // Search filter
            const searchMatch = `${u.firstName} ${u.lastName} ${u.email} ${u.department}`.toLowerCase().includes(searchQuery.toLowerCase())

            // Role filter
            const roleMatch = roleFilter === "all" || u.role === roleFilter

            // Department filter
            const departmentMatch = departmentFilter === "all" || u.department === departmentFilter

            // Status filter (assuming all active for now)
            const statusMatch = statusFilter === "all" || statusFilter === "active"

            return searchMatch && roleMatch && departmentMatch && statusMatch
        })
    }, [allUsers, searchQuery, roleFilter, departmentFilter, statusFilter])

    // Pagination logic
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex)

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, roleFilter, departmentFilter, statusFilter])

    if (!currentUser) return null

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-serif tracking-tight">Employee Directory</h2>
                    <p className="text-muted-foreground font-light text-lg">
                        Browse and manage all personnel across your organization.
                    </p>
                </div>
                <div className="flex gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-2xl h-12 px-6 border-border/40"
                                disabled={selectedEmployees.size === 0}
                            >
                                Bulk Actions ({selectedEmployees.size}) <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleBulkExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Selected
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleBulkDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {(currentUser.role === 'ceo' || currentUser.role === 'hr') && (
                        <Button
                            className="rounded-2xl h-12 px-6 bg-primary text-primary-foreground"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border-border/40 overflow-hidden">
                <CardHeader className="bg-secondary/5 border-b border-border/10 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                className="pl-10 h-10 rounded-xl border-border/40"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Role Filter */}
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="rounded-xl h-10 w-[140px]">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map(role => (
                                        <SelectItem key={role} value={role} className="capitalize">
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Department Filter */}
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="rounded-xl h-10 w-[160px]">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="rounded-xl h-10 w-[130px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {(roleFilter !== "all" || departmentFilter !== "all" || statusFilter !== "all") && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl h-10"
                                    onClick={() => {
                                        setRoleFilter("all")
                                        setDepartmentFilter("all")
                                        setStatusFilter("all")
                                    }}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear
                                </Button>
                            )}

                            <div className="h-6 w-px bg-border/40 mx-2" />
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                {filteredEmployees.length} Results
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/10">
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedEmployees.size === paginatedEmployees.length && paginatedEmployees.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="w-[300px] text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Employee</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Department</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Role</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Start Date</TableHead>
                                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Status</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isUsersLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse">
                                        <TableCell colSpan={6} className="h-16 bg-secondary/10" />
                                    </TableRow>
                                ))
                            ) : filteredEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-light italic">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id} className="group border-border/10 hover:bg-secondary/20 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="text-xs">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-medium">{employee.firstName} {employee.lastName}</p>
                                                    <p className="text-xs text-muted-foreground font-light">{employee.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                {employee.department}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize rounded-lg px-2 py-0 h-6 text-[10px] font-bold tracking-wider border-primary/20 bg-primary/5 text-primary">
                                                {employee.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Nov 12, 2024
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                <span className="text-xs font-medium">Active</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Employee Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif">Add New Employee</DialogTitle>
                        <DialogDescription>
                            Create a new employee account. They will be added to your company.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    placeholder="John"
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    placeholder="Doe"
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="john.doe@company.com"
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="••••••••"
                                className="rounded-xl"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role *</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleInputChange("role", value)}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="staff">Staff</SelectItem>
                                        <SelectItem value="manager" disabled>Manager</SelectItem>
                                        <SelectItem value="hr" disabled>HR</SelectItem>
                                        {currentUser.role === 'ceo' && (
                                            <SelectItem value="ceo" disabled>CEO</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department *</Label>
                                <Select
                                    value={formData.department}
                                    onValueChange={(value) => handleInputChange("department", value)}
                                >
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {departmentsData.map((dept: any) => (
                                            <SelectItem key={dept.id} value={dept.name}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="position">Position (Optional)</Label>
                            <Input
                                id="position"
                                value={formData.position}
                                onChange={(e) => handleInputChange("position", e.target.value)}
                                placeholder="Software Engineer"
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddEmployee}
                            disabled={
                                !formData.firstName ||
                                !formData.lastName ||
                                !formData.email ||
                                !formData.password ||
                                !formData.role ||
                                !formData.department ||
                                createEmployeeMutation.isPending
                            }
                            className="rounded-xl"
                        >
                            {createEmployeeMutation.isPending ? "Adding..." : "Add Employee"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
