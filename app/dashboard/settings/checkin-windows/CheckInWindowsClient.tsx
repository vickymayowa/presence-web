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
    Loader2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

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
            toast.error("Failed to load check-in windows")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingWindow
                ? "/api/checkin-windows"
                : "/api/checkin-windows"

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
                toast.success(editingWindow ? "Window updated successfully" : "Window created successfully")
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
        if (!confirm("Are you sure you want to delete this check-in window?")) {
            return
        }

        try {
            const res = await fetch(`/api/checkin-windows?windowId=${windowId}`, {
                method: "DELETE",
            })

            const data = await res.json()

            if (data.success) {
                toast.success("Window deleted successfully")
                fetchWindows()
            } else {
                toast.error(data.message || "Failed to delete window")
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

    if (!user || (user.role !== "ceo" && user.role !== "hr")) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                            <div>
                                <h3 className="font-semibold text-lg">Access Denied</h3>
                                <p className="text-sm text-muted-foreground">
                                    Only CEO and HR can manage check-in windows
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Check-In Windows</h1>
                    <p className="text-lg text-muted-foreground font-light max-w-2xl">
                        Configure time windows when employees can check in. The system will automatically lock check-ins outside these periods.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl px-8 py-6">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Window
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingWindow ? "Edit" : "Create"} Check-In Window</DialogTitle>
                                <DialogDescription>
                                    Define when employees can check in to the system
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Window Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Morning Shift"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        placeholder="Optional description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Start Time *</Label>
                                        <Input
                                            id="startTime"
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endTime">End Time *</Label>
                                        <Input
                                            id="endTime"
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Active Days *</Label>
                                    <div className="flex gap-2">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <Button
                                                key={day.value}
                                                type="button"
                                                variant={formData.daysOfWeek.includes(day.value) ? "default" : "outline"}
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => toggleDay(day.value)}
                                            >
                                                {day.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="isActive">Active</Label>
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingWindow ? "Update" : "Create"} Window
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Windows List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : windows.length === 0 ? (
                <Card>
                    <CardContent className="py-20">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Clock className="w-16 h-16 text-muted-foreground/40" />
                            <div>
                                <h3 className="font-semibold text-lg">No Check-In Windows</h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Create your first check-in window to control when employees can check in
                                </p>
                            </div>
                            <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Window
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {windows.map((window) => (
                        <Card key={window.id} className={`border-2 ${window.isActive ? 'border-primary/20' : 'border-border/20'}`}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {window.name}
                                            {window.isActive ? (
                                                <Badge className="bg-green-100 text-green-700">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </CardTitle>
                                        {window.description && (
                                            <CardDescription>{window.description}</CardDescription>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(window)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(window.id)}
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{window.startTime}</span>
                                    <span className="text-muted-foreground">to</span>
                                    <span className="font-medium">{window.endTime}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex gap-1">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <Badge
                                                key={day.value}
                                                variant={window.daysOfWeek.includes(day.value) ? "default" : "outline"}
                                                className="text-[10px] px-2"
                                            >
                                                {day.label}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
