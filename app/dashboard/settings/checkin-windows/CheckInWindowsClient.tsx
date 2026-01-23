"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Clock,
    Plus,
    Trash2,
    Edit,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Sun,
    Moon,
    CloudSun,
    Zap,
    MoreVertical
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SHIFT_PRESETS = [
    { name: "Morning Shift", startTime: "07:30", endTime: "10:00", description: "Standard morning check-in period", icon: Sun },
    { name: "Afternoon Shift", startTime: "13:00", endTime: "15:00", description: "Mid-day check-in period", icon: CloudSun },
    { name: "Night Shift", startTime: "20:00", endTime: "23:00", description: "Evening/Night shift check-in period", icon: Moon },
]

interface CheckInWindow {
    id: string
    name: string
    description?: string
    startTime: string
    endTime: string
    daysOfWeek: number[]
    isActive: boolean
    createdAt: string
    updatedAt: string
}

const DAYS_OF_WEEK = [
    { value: 0, label: "Sun" },
    { value: 1, label: "Mon" },
    { value: 2, label: "Tue" },
    { value: 3, label: "Wed" },
    { value: 4, label: "Thu" },
    { value: 5, label: "Fri" },
    { value: 6, label: "Sat" },
]

export default function CheckInWindowsPage() {
    const { user } = useAuth()
    const [windows, setWindows] = React.useState<CheckInWindow[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingWindow, setEditingWindow] = React.useState<CheckInWindow | null>(null)

    const [formData, setFormData] = React.useState({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday by default
        isActive: true,
    })

    React.useEffect(() => {
        fetchWindows()
    }, [])

    const fetchWindows = async () => {
        try {
            setIsLoading(true)
            const res = await fetch("/api/checkin-windows")
            const data = await res.json()

            if (data.success) {
                setWindows(data.data.windows)
            }
        } catch (error) {
            toast.error("Failed to load shift sections")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = "/api/checkin-windows"
            const method = editingWindow ? "PATCH" : "POST"
            const payload = editingWindow
                ? { windowId: editingWindow.id, ...formData }
                : formData

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (data.success) {
                toast.success(editingWindow ? "Section updated successfully" : "Section created successfully")
                setIsDialogOpen(false)
                resetForm()
                fetchWindows()
            } else {
                toast.error(data.message || "Operation failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const handleDelete = async (windowId: string) => {
        if (!confirm("Are you sure you want to delete this shift section?")) {
            return
        }

        try {
            const res = await fetch(`/api/checkin-windows?windowId=${windowId}`, {
                method: "DELETE",
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Section deleted successfully")
                fetchWindows()
            } else {
                toast.error(data.message || "Failed to delete section")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const handleEdit = (window: CheckInWindow) => {
        setEditingWindow(window)
        setFormData({
            name: window.name,
            description: window.description || "",
            startTime: window.startTime,
            endTime: window.endTime,
            daysOfWeek: window.daysOfWeek,
            isActive: window.isActive,
        })
        setIsDialogOpen(true)
    }

    const resetForm = () => {
        setEditingWindow(null)
        setFormData({
            name: "",
            description: "",
            startTime: "",
            endTime: "",
            daysOfWeek: [1, 2, 3, 4, 5],
            isActive: true,
        })
    }

    const toggleDay = (day: number) => {
        setFormData(prev => ({
            ...prev,
            daysOfWeek: prev.daysOfWeek.includes(day)
                ? prev.daysOfWeek.filter(d => d !== day)
                : [...prev.daysOfWeek, day].sort((a, b) => a - b)
        }))
    }

    const handleAddPreset = async (preset: typeof SHIFT_PRESETS[0]) => {
        try {
            const res = await fetch("/api/checkin-windows", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...preset,
                    daysOfWeek: [1, 2, 3, 4, 5],
                    isActive: true,
                }),
            })

            const data = await res.json()

            if (data.success) {
                toast.success(`${preset.name} section added successfully`)
                fetchWindows()
            } else {
                toast.error(data.message || "Failed to add section")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const getShiftIcon = (name: string) => {
        const lowerName = name.toLowerCase()
        if (lowerName.includes("morning")) return Sun
        if (lowerName.includes("afternoon") || lowerName.includes("midday") || lowerName.includes("lunch")) return CloudSun
        if (lowerName.includes("night") || lowerName.includes("evening")) return Moon
        return Clock
    }

    if (!user || (user.role !== "ceo" && user.role !== "hr")) {
        return (
            <div className="flex items-center justify-center min-h-[400px] font-sans">
                <Card className="max-w-md border-2 border-primary/5">
                    <CardContent className="pt-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-destructive/10 p-4 rounded-full">
                                <AlertCircle className="w-8 h-8 text-destructive" />
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl">Access Denied</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                                    Only CEO and HR roles are permitted to manage shift sections.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Shift Sections</h1>
                    <p className="text-lg text-muted-foreground font-light max-w-2xl">
                        Define specific time sections for employee attendance. Companies can toggle shifts like Morning, Afternoon, or Night depending on their operations.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-2xl h-14 px-6 border-dashed border-2 hover:border-primary/50 transition-all group">
                                <Zap className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span>Quick Add Section</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64" align="end">
                            <DropdownMenuLabel className="flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5" />
                                <span>Standard Presets</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {SHIFT_PRESETS.map((preset) => (
                                <DropdownMenuItem key={preset.name} onClick={() => handleAddPreset(preset)} className="cursor-pointer py-3">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="bg-primary/5 p-2 rounded-lg">
                                            <preset.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{preset.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{preset.startTime} - {preset.endTime}</span>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) resetForm()
                    }}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl h-14 px-6 shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Custom Section
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>{editingWindow ? "Edit" : "Create"} Shift Section</DialogTitle>
                                    <DialogDescription>
                                        Define a custom time period when employees are expected to check in.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-6 font-sans">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Section Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Early Bird, Late Shift"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Input
                                            id="description"
                                            placeholder="e.g., Main morning arrival window"
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startTime">Start Time *</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="startTime"
                                                    type="time"
                                                    className="pl-9"
                                                    value={formData.startTime}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endTime">End Time *</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="endTime"
                                                    type="time"
                                                    className="pl-9"
                                                    value={formData.endTime}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium">Active Days *</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {DAYS_OF_WEEK.map((day) => (
                                                <Button
                                                    key={day.value}
                                                    type="button"
                                                    variant={formData.daysOfWeek.includes(day.value) ? "default" : "outline"}
                                                    size="sm"
                                                    className={`min-w-12 h-9 rounded-xl transition-all ${formData.daysOfWeek.includes(day.value) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                                    onClick={() => toggleDay(day.value)}
                                                >
                                                    {day.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator className="my-2" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="isActive" className="text-base">Section Active</Label>
                                            <p className="text-[12px] text-muted-foreground">Enable or disable this check-in window</p>
                                        </div>
                                        <Switch
                                            id="isActive"
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="rounded-xl px-8">
                                        {editingWindow ? "Save Changes" : "Create Section"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                    <p className="text-sm text-muted-foreground animate-pulse">Loading shift configuration...</p>
                </div>
            ) : windows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border/20 rounded-3xl bg-muted/5">
                    <div className="bg-primary/5 p-6 rounded-full mb-6">
                        <Clock className="w-12 h-12 text-primary/40" />
                    </div>
                    <h3 className="text-2xl font-serif mb-2">No Shift Sections</h3>
                    <p className="text-muted-foreground text-center max-w-sm mb-8 font-light">
                        Configure your company's operating hours early on to help staff track their attendance correctly.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={() => setIsDialogOpen(true)} className="rounded-2xl px-8 h-12 shadow-lg shadow-primary/10">
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Section
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {windows.map((window) => {
                        const ShiftIcon = getShiftIcon(window.name)
                        return (
                            <Card key={window.id} className={`group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 border-2 ${window.isActive ? 'border-primary/10 hover:border-primary/30' : 'border-border/10 saturation-50 opacity-80'}`}>
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-2xl ${window.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                <ShiftIcon className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <CardTitle className="text-xl font-serif">
                                                    {window.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-2">
                                                    {window.isActive ? (
                                                        <Badge className="bg-green-500/10 text-green-600 border-none px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-bold">Active</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] uppercase tracking-wider font-bold">Disabled</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => handleEdit(window)}
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => handleDelete(window.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    {window.description && (
                                        <CardDescription className="line-clamp-1 mt-2 font-light italic">
                                            "{window.description}"
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <Separator className="bg-border/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Shift Timing</span>
                                            <div className="flex items-center gap-2 text-base font-medium">
                                                <Clock className="w-4 h-4 text-primary/60" />
                                                <span>{window.startTime}</span>
                                                <span className="text-muted-foreground text-xs">—</span>
                                                <span>{window.endTime}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest block mb-1">Duration</span>
                                            <span className="text-sm font-medium bg-primary/5 px-2 py-1 rounded-lg text-primary">
                                                Available
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Active Days</span>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {DAYS_OF_WEEK.map((day) => {
                                                const isEnabled = window.daysOfWeek.includes(day.value)
                                                return (
                                                    <div
                                                        key={day.value}
                                                        className={`text-[10px] font-bold h-7 w-9 flex items-center justify-center rounded-lg border transition-colors ${isEnabled ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/50 border-transparent text-muted-foreground/40'}`}
                                                    >
                                                        {day.label.charAt(0)}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                                {window.isActive && (
                                    <div className="absolute top-0 right-0 p-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    </div>
                                )}
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
