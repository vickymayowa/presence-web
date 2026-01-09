"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    User,
    Bell,
    Shield,
    Globe,
    CreditCard,
    Mail,
    Smartphone,
    Save
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
    const { user } = useAuth()
    const [isSaving, setIsSaving] = React.useState(false)

    if (!user) return null

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1000)
    }

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="space-y-1">
                <h2 className="text-4xl font-serif tracking-tight">Settings</h2>
                <p className="text-muted-foreground font-light text-lg">
                    Manage your personal account preferences and organization settings.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-secondary/10 p-1 h-auto rounded-2xl border border-border/40 overflow-x-auto inline-flex whitespace-nowrap scrollbar-hide">
                    <TabsTrigger value="profile" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <User className="mr-2 h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Bell className="mr-2 h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Shield className="mr-2 h-4 w-4" /> Security
                    </TabsTrigger>
                    {user.role === 'ceo' && (
                        <TabsTrigger value="organization" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Globe className="mr-2 h-4 w-4" /> Workspace
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <Card className="border-border/40 overflow-hidden">
                        <CardHeader className="border-b border-border/10 bg-secondary/5">
                            <CardTitle className="font-serif text-2xl">Personal Information</CardTitle>
                            <CardDescription>Update your profile details and avatar.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <Avatar className="h-24 w-24 border-4 border-background ring-1 ring-border">
                                    <AvatarFallback className="text-2xl">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-3 text-center md:text-left">
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <Button size="sm" className="rounded-xl">Upload New Photo</Button>
                                        <Button size="sm" variant="outline" className="rounded-xl border-border/40">Remove</Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-light italic">
                                        Recommended size: 400x400px. JPG or PNG.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">First Name</Label>
                                    <Input defaultValue={user.firstName} className="h-11 rounded-xl border-border/40" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Last Name</Label>
                                    <Input defaultValue={user.lastName} className="h-11 rounded-xl border-border/40" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Email Address</Label>
                                    <Input defaultValue={user.email} className="h-11 rounded-xl border-border/40" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Position</Label>
                                    <Input defaultValue={user.position || "Staff"} className="h-11 rounded-xl border-border/40" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleSave} disabled={isSaving} className="rounded-xl px-8 h-11 bg-primary">
                                    {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <Card className="border-border/40 shadow-none">
                        <CardHeader>
                            <CardTitle className="font-serif text-2xl">Preferences</CardTitle>
                            <CardDescription>Choose how you want to be notified about updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <NotificationToggle
                                title="Email Notifications"
                                description="Receive attendance summaries and team updates via email."
                                icon={Mail}
                                defaultChecked={true}
                            />
                            <NotificationToggle
                                title="Push Notifications"
                                description="Real-time alerts for check-ins and approvals on your device."
                                icon={Smartphone}
                                defaultChecked={true}
                            />
                            <NotificationToggle
                                title="Security Alerts"
                                description="Immediate notification for login attempts from new devices."
                                icon={Shield}
                                defaultChecked={true}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function NotificationToggle({ title, description, icon: Icon, defaultChecked }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-border/30">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-background rounded-xl border border-border/20">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium leading-none mb-1">{title}</p>
                    <p className="text-xs text-muted-foreground font-light">{description}</p>
                </div>
            </div>
            <Switch defaultChecked={defaultChecked} />
        </div>
    )
}
