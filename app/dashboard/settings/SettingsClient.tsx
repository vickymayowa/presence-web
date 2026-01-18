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
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
    const { user } = useAuth()
    const [isSaving, setIsSaving] = React.useState(false)

    if (!user) return null

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => setIsSaving(false), 1500)
    }

    return (
        <div className="space-y-10 pb-12 max-w-5xl mx-auto">
            <div className="space-y-2 border-b border-border/10 pb-8">
                <h2 className="text-4xl md:text-5xl font-serif tracking-tight">System Preferences</h2>
                <p className="text-lg text-muted-foreground font-light">
                    Customize your operational environment and organizational parameters.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-8">
                <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                    <TabsList className="bg-secondary/5 p-1.5 h-auto rounded-2xl border border-border/40 inline-flex whitespace-nowrap">
                        <TabsTrigger value="profile" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all font-medium">
                            <User className="mr-2 h-4 w-4" /> Personal
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all font-medium">
                            <Bell className="mr-2 h-4 w-4" /> Signals
                        </TabsTrigger>
                        <TabsTrigger value="security" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all font-medium">
                            <Shield className="mr-2 h-4 w-4" /> Security
                        </TabsTrigger>
                        {user.role === 'ceo' && (
                            <TabsTrigger value="organization" className="rounded-xl px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all font-medium">
                                <Globe className="mr-2 h-4 w-4" /> Workplace
                            </TabsTrigger>
                        )}
                    </TabsList>
                </div>

                <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="text-xl font-serif">Identify Profile</h3>
                            <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                This information is visible to your team and recorded in organizational logs.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <Card className="border-border/40 shadow-xl shadow-primary/5">
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-center gap-8">
                                        <div className="relative group">
                                            <Avatar className="h-24 w-24 ring-4 ring-primary/10 shadow-lg group-hover:ring-primary/20 transition-all duration-500">
                                                <AvatarFallback className="text-2xl font-serif bg-primary/5 text-primary">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <Smartphone className="size-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Button size="sm" className="rounded-xl px-4">Change Identity Image</Button>
                                                <Button size="sm" variant="ghost" className="rounded-xl text-muted-foreground hover:text-red-500">Remove</Button>
                                            </div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">Optimal: 800x800px High-res Source</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <SettingInput label="First Name" value={user.firstName} />
                                        <SettingInput label="Last Name" value={user.lastName} />
                                        <SettingInput label="Email Identity" value={user.email} disabled />
                                        <SettingInput label="Official Position" value={user.position!} disabled />
                                    </div>

                                    <div className="pt-6 border-t border-border/10 flex justify-end">
                                        <Button onClick={handleSave} disabled={isSaving} className="rounded-2xl px-10 h-12 bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                            {isSaving ? "Synchronizing..." : <><Save className="mr-2 h-4 w-4" /> Save Preferences</>}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="text-xl font-serif">Signal Management</h3>
                            <p className="text-sm text-muted-foreground font-light">
                                Control how and when you receive critical system updates and team signals.
                            </p>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <NotificationCard
                                title="Digest Emails"
                                desc="Periodic summaries of organizational attendance and performance."
                                icon={Mail}
                                checked
                            />
                            <NotificationCard
                                title="Real-time Pulses"
                                desc="Instant push alerts for check-ins, leaves, and approvals."
                                icon={Smartphone}
                                checked
                            />
                            <NotificationCard
                                title="Integrity Alerts"
                                desc="Critical notifications for security audits and anomaly detection."
                                icon={Shield}
                                checked
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-border/40">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="font-serif text-2xl">Security Perimeter</CardTitle>
                                            <CardDescription>Manage credentials and biometric enrollment.</CardDescription>
                                        </div>
                                        <Badge className="bg-primary/10 text-primary border-primary/20">Active Protection</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-6 rounded-2xl border border-border/20 bg-secondary/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-background rounded-xl border">
                                                <Smartphone className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Two-Factor Authentication</p>
                                                <p className="text-xs text-muted-foreground font-light text-green-600">Verified via RSA Shield</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl size-sm">Configure</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-6 rounded-2xl border border-border/20 bg-secondary/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-background rounded-xl border">
                                                <Globe className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Hardware Token</p>
                                                <p className="text-xs text-muted-foreground font-light italic">Not currently configured</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="rounded-xl size-sm">Set Up</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="border-border/40 bg-secondary/5">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold">Active Sessions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <SessionItem device="MacBook Pro (Sonoma)" location="Lagos, NG" active />
                                    <SessionItem device="iPhone 15 Pro" location="Lagos, NG" />
                                    <Button variant="link" className="w-full text-xs text-red-500">Terminate all other sessions</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {user.role === 'ceo' && (
                    <TabsContent value="organization" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-4">
                                <h3 className="text-xl font-serif">Workspace Controls</h3>
                                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                    Administrative tools to manage organizational identity and operational standards.
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-6">
                                <Card className="border-border/40">
                                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                                        <CardTitle className="font-serif text-xl">Operational Window</CardTitle>
                                        <CardDescription>Configure standard attendance expectations.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="grid grid-cols-2 gap-8">
                                            <SettingInput label="Workday Start Time" value="09:00 AM" />
                                            <SettingInput label="Workday End Time" value="05:00 PM" />
                                            <SettingInput label="Grace Period (Mins)" value="15" />
                                            <SettingInput label="Organization ID" value="PRES-GLOBAL-823" disabled />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-2xl border border-dashed border-border/60">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="size-5 text-muted-foreground" />
                                                <div className="text-sm">
                                                    <p className="font-medium">Subscription: Enterprise Plus</p>
                                                    <p className="text-xs text-muted-foreground font-light italic">Renewal scheduled for Jan 1, 2026</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="rounded-xl">Billing</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}

function SettingInput({ label, value, disabled }: { label: string, value: string, disabled?: boolean }) {
    return (
        <div className="space-y-2.5">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 ml-1">{label}</Label>
            <Input
                defaultValue={value}
                disabled={disabled}
                className={`h-12 rounded-2xl bg-secondary/5 border-border/40 focus:ring-primary/20 transition-all font-medium ${disabled ? 'opacity-50' : ''}`}
            />
        </div>
    )
}

function NotificationCard({ title, desc, icon: Icon, checked }: any) {
    return (
        <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/5 border border-border/20 transition-all hover:bg-secondary/10 group">
            <div className="flex items-center gap-5">
                <div className="p-3 bg-background rounded-xl border border-border/20 group-hover:border-primary/30 transition-all">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold leading-none mb-1.5">{title}</p>
                    <p className="text-xs text-muted-foreground font-light max-w-sm">{desc}</p>
                </div>
            </div>
            <Switch defaultChecked={checked} className="data-[state=checked]:bg-primary" />
        </div>
    )
}

function SessionItem({ device, location, active }: { device: string, location: string, active?: boolean }) {
    return (
        <div className="flex items-center gap-4 relative">
            <div className={`size-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
            <div className="space-y-1">
                <p className="text-sm font-medium">{device}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-light">
                    <span>{location}</span>
                    {active && <span className="text-green-600 font-bold tracking-widest uppercase">Current</span>}
                </div>
            </div>
        </div>
    )
}
