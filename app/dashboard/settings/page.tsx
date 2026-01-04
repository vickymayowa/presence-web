"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Bell,
    Globe,
    Moon,
    Sun,
    Shield,
    Smartphone,
    Mail,
    Clock,
    Building2,
    Users,
    Save,
    Loader2,
    Check,
    AlertTriangle
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
    const { user } = useAuth()
    const [isSaving, setIsSaving] = React.useState(false)
    const [savedSection, setSavedSection] = React.useState<string | null>(null)

    if (!user) return null

    const isAdmin = user.role === 'hr' || user.role === 'ceo'

    const handleSave = async (section: string) => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        setSavedSection(section)
        setTimeout(() => setSavedSection(null), 2000)
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-serif tracking-tight">Settings</h1>
                <p className="text-muted-foreground font-light mt-1">
                    Manage your account and application preferences
                </p>
            </div>

            {/* Notifications */}
            <Card className="border-border/30">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Bell className="size-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-serif">Notifications</CardTitle>
                            <CardDescription>Configure how you receive alerts</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <ToggleSetting
                            label="Email Notifications"
                            description="Receive email alerts for important updates"
                            defaultChecked={true}
                        />
                        <Separator />
                        <ToggleSetting
                            label="Push Notifications"
                            description="Get push notifications on your devices"
                            defaultChecked={true}
                        />
                        <Separator />
                        <ToggleSetting
                            label="Leave Request Alerts"
                            description="Notify when leave requests need attention"
                            defaultChecked={true}
                        />
                        <Separator />
                        <ToggleSetting
                            label="Check-in Reminders"
                            description="Daily reminders to check in"
                            defaultChecked={false}
                        />
                    </div>
                    <Button
                        className="rounded-xl"
                        onClick={() => handleSave('notifications')}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="size-4 mr-2 animate-spin" />
                        ) : savedSection === 'notifications' ? (
                            <Check className="size-4 mr-2" />
                        ) : (
                            <Save className="size-4 mr-2" />
                        )}
                        {savedSection === 'notifications' ? 'Saved!' : 'Save Changes'}
                    </Button>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-border/30">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Sun className="size-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-serif">Appearance</CardTitle>
                            <CardDescription>Customize the look and feel</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-primary bg-primary/5">
                                <Sun className="size-5" />
                                <span className="text-sm font-medium">Light</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 hover:border-primary/50 transition-colors">
                                <Moon className="size-5" />
                                <span className="text-sm font-medium">Dark</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 hover:border-primary/50 transition-colors">
                                <Smartphone className="size-5" />
                                <span className="text-sm font-medium">System</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                            <SelectTrigger className="h-11 rounded-xl max-w-xs">
                                <Globe className="size-4 mr-2 text-muted-foreground" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select defaultValue="utc-5">
                            <SelectTrigger className="h-11 rounded-xl max-w-xs">
                                <Clock className="size-4 mr-2 text-muted-foreground" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="utc-8">Pacific Time (PT)</SelectItem>
                                <SelectItem value="utc-7">Mountain Time (MT)</SelectItem>
                                <SelectItem value="utc-6">Central Time (CT)</SelectItem>
                                <SelectItem value="utc-5">Eastern Time (ET)</SelectItem>
                                <SelectItem value="utc+0">UTC</SelectItem>
                                <SelectItem value="utc+1">Central European Time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-border/30">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <Shield className="size-5 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-serif">Security</CardTitle>
                            <CardDescription>Manage your security settings</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Enabled
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Biometric Login</p>
                                <p className="text-sm text-muted-foreground">Use Face ID or fingerprint</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl">
                                Configure
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Active Sessions</p>
                                <p className="text-sm text-muted-foreground">Manage your login sessions</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl">
                                View All
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button variant="outline" className="rounded-xl">
                            Change Password
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Admin Settings (HR/CEO only) */}
            {isAdmin && (
                <>
                    <div className="pt-4">
                        <h2 className="text-xl font-serif mb-1">Organization Settings</h2>
                        <p className="text-sm text-muted-foreground">
                            These settings affect the entire organization
                        </p>
                    </div>

                    <Card className="border-border/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Building2 className="size-5 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-serif">Company Settings</CardTitle>
                                    <CardDescription>Configure organization-wide preferences</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Work Start Time</Label>
                                    <Select defaultValue="9">
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[7, 8, 9, 10].map(hour => (
                                                <SelectItem key={hour} value={hour.toString()}>
                                                    {hour}:00 AM
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Work End Time</Label>
                                    <Select defaultValue="17">
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[16, 17, 18, 19, 20].map(hour => (
                                                <SelectItem key={hour} value={hour.toString()}>
                                                    {hour - 12}:00 PM
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Late Threshold (minutes)</Label>
                                    <Select defaultValue="15">
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[5, 10, 15, 30].map(min => (
                                                <SelectItem key={min} value={min.toString()}>
                                                    {min} minutes
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Default Work Mode</Label>
                                    <Select defaultValue="hybrid">
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="office">Office Only</SelectItem>
                                            <SelectItem value="remote">Remote Only</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <ToggleSetting
                                label="Require Location Verification"
                                description="Verify employee location during check-in"
                                defaultChecked={true}
                            />
                            <ToggleSetting
                                label="Require Biometric Verification"
                                description="Use Face ID for check-in verification"
                                defaultChecked={true}
                            />

                            <Button className="rounded-xl" onClick={() => handleSave('company')}>
                                <Save className="size-4 mr-2" />
                                Save Company Settings
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-border/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                                    <Users className="size-5 text-cyan-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-serif">Leave Policies</CardTitle>
                                    <CardDescription>Configure leave allowances and rules</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <Label className="text-blue-700">Annual Leave</Label>
                                    <Input
                                        type="number"
                                        defaultValue="20"
                                        className="mt-2 h-10 rounded-xl bg-white border-blue-200"
                                    />
                                    <p className="text-xs text-blue-600/70 mt-1">days/year</p>
                                </div>
                                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                                    <Label className="text-red-700">Sick Leave</Label>
                                    <Input
                                        type="number"
                                        defaultValue="10"
                                        className="mt-2 h-10 rounded-xl bg-white border-red-200"
                                    />
                                    <p className="text-xs text-red-600/70 mt-1">days/year</p>
                                </div>
                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                                    <Label className="text-purple-700">Personal Leave</Label>
                                    <Input
                                        type="number"
                                        defaultValue="5"
                                        className="mt-2 h-10 rounded-xl bg-white border-purple-200"
                                    />
                                    <p className="text-xs text-purple-600/70 mt-1">days/year</p>
                                </div>
                                <div className="p-4 rounded-xl bg-pink-50 border border-pink-100">
                                    <Label className="text-pink-700">Maternity Leave</Label>
                                    <Input
                                        type="number"
                                        defaultValue="90"
                                        className="mt-2 h-10 rounded-xl bg-white border-pink-200"
                                    />
                                    <p className="text-xs text-pink-600/70 mt-1">days</p>
                                </div>
                            </div>

                            <Button className="rounded-xl" onClick={() => handleSave('leave')}>
                                <Save className="size-4 mr-2" />
                                Save Leave Policies
                            </Button>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50/30">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="size-5 text-red-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-serif text-red-700">Danger Zone</CardTitle>
                            <CardDescription className="text-red-600/70">Irreversible actions</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-red-700">Delete Account</p>
                            <p className="text-sm text-red-600/70">Permanently remove your account and data</p>
                        </div>
                        <Button variant="destructive" className="rounded-xl">
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Toggle Setting Component
function ToggleSetting({
    label,
    description,
    defaultChecked
}: {
    label: string
    description: string
    defaultChecked: boolean
}) {
    const [checked, setChecked] = React.useState(defaultChecked)

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => setChecked(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-secondary'
                    }`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    )
}
