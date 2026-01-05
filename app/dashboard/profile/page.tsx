"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Camera,
    Mail,
    Phone,
    Building2,
    Calendar,
    MapPin,
    Save,
    Loader2,
    Shield,
    Clock,
    Bell,
    Key,
    Scan,
    CheckCircle2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

const roleLabels: Record<UserRole, string> = {
    ceo: 'Chief Executive Officer',
    hr: 'HR Director',
    manager: 'Manager',
    staff: 'Staff Member',
}

const roleColors: Record<UserRole, string> = {
    ceo: 'bg-purple-100 text-purple-700',
    hr: 'bg-blue-100 text-blue-700',
    manager: 'bg-green-100 text-green-700',
    staff: 'bg-gray-100 text-gray-600',
}

export default function ProfilePage() {
    const { user } = useAuth()
    const [isEditing, setIsEditing] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
    })

    React.useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || '',
                department: user.department,
                position: user.position,
            })
        }
    }, [user])

    if (!user) return null

    const initials = `${user.firstName[0]}${user.lastName[0]}`
    const joinedDate = new Date(user.joinedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSaving(false)
        setIsEditing(false)
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Profile</h1>
                <p className="text-muted-foreground font-light mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Overview Card */}
            <Card className="border-border/30 overflow-hidden">
                {/* Cover/Background */}
                <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />

                <CardContent className="relative px-6 pb-6">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-6">
                        <div className="relative group">
                            <Avatar className="size-24 ring-4 ring-background shadow-xl">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="size-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-serif">{user.firstName} {user.lastName}</h2>
                                <Badge className={`text-[10px] uppercase font-bold tracking-wider ${roleColors[user.role]}`}>
                                    {user.role}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">{user.position}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="size-4" />
                                    {user.department}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="size-4" />
                                    Joined {joinedDate}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant={isEditing ? "default" : "outline"}
                            className="rounded-xl"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-border/30">
                <CardHeader>
                    <CardTitle className="text-xl font-serif">Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                disabled={!isEditing}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                disabled={!isEditing}
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    disabled={!isEditing}
                                    className="h-11 rounded-xl pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    disabled={!isEditing}
                                    className="h-11 rounded-xl pl-10"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    value={formData.department}
                                    disabled
                                    className="h-11 rounded-xl pl-10 bg-secondary/30"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                                value={formData.position}
                                disabled
                                className="h-11 rounded-xl bg-secondary/30"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button className="rounded-xl" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Bell className="size-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Notifications</h3>
                                <p className="text-sm text-muted-foreground">
                                    Configure how you receive alerts and updates
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Scan className="size-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Face ID Enrollment</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-green-500" />
                                    Active • Last updated 2 weeks ago
                                </p>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-lg text-xs">Update</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <Key className="size-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Security</h3>
                                <p className="text-sm text-muted-foreground">
                                    Password, 2FA, and login sessions
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Clock className="size-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Work Schedule</h3>
                                <p className="text-sm text-muted-foreground">
                                    Set your working hours and preferences
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Shield className="size-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Privacy</h3>
                                <p className="text-sm text-muted-foreground">
                                    Control your data and visibility settings
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Summary */}
            <Card className="border-border/30">
                <CardHeader>
                    <CardTitle className="text-xl font-serif">Attendance Overview</CardTitle>
                    <CardDescription>Your attendance statistics this month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-xl bg-green-50/50 border border-green-100">
                            <p className="text-3xl font-serif text-green-700">18</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-600/70 mt-1">Present</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                            <p className="text-3xl font-serif text-orange-700">2</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-orange-600/70 mt-1">Late</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                            <p className="text-3xl font-serif text-blue-700">1</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-600/70 mt-1">Leave</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                            <p className="text-3xl font-serif text-purple-700">94%</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-purple-600/70 mt-1">Score</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
