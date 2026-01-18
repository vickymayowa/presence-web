"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
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

    const companyName = user.companyId === 'comp-001' ? 'Presence Inc.' : 'Acme Corp';

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSaving(false)
        setIsEditing(false)
    }

    return (
        <div className="space-y-10 pb-12 max-w-6xl mx-auto">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tight">Personal Workspace</h1>
                    <p className="text-lg text-muted-foreground font-light max-w-xl">
                        Manage your professional presence, security credentials, and organizational preferences.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant={isEditing ? "default" : "outline"}
                        className="rounded-2xl h-12 px-8 font-medium transition-all"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel Editing' : 'Edit Information'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Premium Profile Card */}
                    <Card className="border-border/30 overflow-hidden bg-gradient-to-br from-background to-secondary/5 shadow-2xl shadow-primary/5">
                        <div className="h-40 relative overflow-hidden bg-primary/10">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                        </div>

                        <CardContent className="relative px-8 pb-8">
                            <div className="flex flex-col md:flex-row gap-8 -mt-12">
                                <div className="relative shrink-0 mx-auto md:mx-0">
                                    <Avatar className="size-32 ring-8 ring-background shadow-2xl transition-transform hover:scale-105 duration-500">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-serif">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg border-2 border-background hover:bg-primary/90 transition-colors">
                                        <Camera className="size-4" />
                                    </button>
                                </div>

                                <div className="flex-1 space-y-4 text-center md:text-left pt-4">
                                    <div>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                                            <h2 className="text-3xl font-serif">{user.firstName} {user.lastName}</h2>
                                            <Badge className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${roleColors[user.role]}`}>
                                                {roleLabels[user.role]}
                                            </Badge>
                                        </div>
                                        <p className="text-xl text-muted-foreground font-light">{user.position}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground pt-2">
                                        <span className="flex items-center gap-2">
                                            <Building2 className="size-4 text-primary/60" />
                                            {companyName} • {user.department}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <MapPin className="size-4 text-primary/60" />
                                            Lagos Head Office
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="size-4 text-primary/60" />
                                            Joined {joinedDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Information Form */}
                    <Card className="border-border/30 overflow-hidden">
                        <CardHeader className="bg-secondary/10 border-b border-border/5">
                            <CardTitle className="text-xl font-serif">Core Credentials</CardTitle>
                            <CardDescription>Your verified organizational and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">First Name</Label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        disabled={!isEditing}
                                        className="h-12 rounded-2xl bg-secondary/5 border-border/40 focus:ring-primary/20 transition-all text-base"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Last Name</Label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        disabled={!isEditing}
                                        className="h-12 rounded-2xl bg-secondary/5 border-border/40 focus:ring-primary/20 transition-all text-base"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={!isEditing}
                                            className="h-12 rounded-2xl pl-12 bg-secondary/5 border-border/40 focus:ring-primary/20 transition-all text-base"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">Phone Connectivity</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!isEditing}
                                            className="h-12 rounded-2xl pl-12 bg-secondary/5 border-border/40 focus:ring-primary/20 transition-all text-base"
                                            placeholder="+234 (0) 000 0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border/10">
                                    <Button variant="ghost" className="rounded-xl px-6" onClick={() => setIsEditing(false)}>
                                        Discard
                                    </Button>
                                    <Button className="rounded-xl px-10 h-11 bg-primary text-primary-foreground shadow-lg shadow-primary/20" onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="size-4 mr-2 animate-spin" />
                                                Synchronizing...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="size-4 mr-2" />
                                                Update Profile
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Performance Summary Details */}
                    <Card className="border-border/30 overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-xl font-serif">Attendance Metrics</CardTitle>
                            <CardDescription>Visual summary of your organizational performance this cycle.</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <MetricWidget label="Attendance Score" value="98.2%" sub="Global average: 92%" positive />
                                <MetricWidget label="On-time Frequency" value="100%" sub="Perfect streak: 12 days" positive />
                                <MetricWidget label="Remote Utilization" value="34%" sub="8 days total" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Dynamic Settings & Insights */}
                <div className="space-y-8">
                    {/* Trust & Safety Status */}
                    <Card className="border-border/40 bg-primary/5">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Security Status</p>
                                <Badge className="bg-green-100 text-green-700 pointer-events-none">Optimized</Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <Shield className="size-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Biometric Shield Active</p>
                                    <p className="text-xs text-muted-foreground font-light">Face ID verified 2h ago</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl bg-transparent border-primary/20 text-primary h-11 hover:bg-primary/5">
                                Run Audit
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Preference Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Organizational Prefs</h3>
                        <QuickLink
                            icon={Bell}
                            title="Notifications"
                            desc="Managed alerts & signals"
                            color="blue"
                        />
                        <QuickLink
                            icon={Clock}
                            title="Schedule"
                            desc="Working hours & flexible modes"
                            color="purple"
                        />
                        <QuickLink
                            icon={Scan}
                            title="Identity Prep"
                            desc="Biometric data management"
                            color="orange"
                        />
                        <QuickLink
                            icon={Key}
                            title="Authentication"
                            desc="Password & 2FA controls"
                            color="green"
                        />
                    </div>

                    {/* Recent Feed */}
                    <Card className="border-border/30">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-semibold">Legacy Stream</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="px-6 space-y-6 pb-6">
                                <FeedItem
                                    title="Checked In"
                                    time="Today, 8:42 AM"
                                    status="Verified"
                                />
                                <FeedItem
                                    title="Profile Updated"
                                    time="Yesterday, 2:15 PM"
                                    status="System"
                                />
                                <FeedItem
                                    title="Leave Approved"
                                    time="Oct 12, 2024"
                                    status="HR Admin"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function MetricWidget({ label, value, sub, positive }: { label: string, value: string, subText?: string, positive?: boolean }) {
    return (
        <div className="p-6 rounded-2xl bg-secondary/5 border border-border/20 space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{label}</p>
            <p className="text-3xl font-serif tracking-tight">{value}</p>
            <p className={`text-xs ${positive ? 'text-green-600' : 'text-muted-foreground'} font-light italic`}>{sub}</p>
        </div>
    )
}

function QuickLink({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        green: 'bg-green-50 text-green-600 border-green-100',
    }

    return (
        <label className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group">
            <div className={`p-3 rounded-xl border transition-colors ${colors[color]}`}>
                <Icon className="size-5" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{title}</p>
                <p className="text-xs text-muted-foreground font-light">{desc}</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-primary/50 group-hover:translate-x-0.5 transition-all" />
        </label>
    )
}

function FeedItem({ title, time, status }: { title: string, time: string, status: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="relative flex flex-col items-center shrink-0">
                <div className="size-2.5 rounded-full bg-primary/40 ring-4 ring-primary/5 group-last:mb-0" />
                <div className="w-px h-full bg-border/40 group-last:hidden" />
            </div>
            <div className="pb-6 group-last:pb-0">
                <p className="text-sm font-medium leading-none mb-1">{title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
                    <span>{time}</span>
                    <span>•</span>
                    <span className="italic">{status}</span>
                </div>
            </div>
        </div>
    )
}
