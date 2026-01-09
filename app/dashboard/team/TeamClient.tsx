"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    Shield
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { useUsersQuery } from "@/lib/queries/presence-queries"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TeamPage() {
    const { user: currentUser } = useAuth()
    const { data: allUsers = [], isLoading } = useUsersQuery()
    const [searchQuery, setSearchQuery] = React.useState("")

    if (!currentUser) return null

    const teamMembers = allUsers.filter(u => {
        const matchesSearch = `${u.firstName} ${u.lastName} ${u.email} ${u.department}`.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-4xl font-serif tracking-tight">Team Overview</h2>
                    <p className="text-muted-foreground font-light text-lg">
                        Manage your organization's members and their permissions.
                    </p>
                </div>
                {(currentUser.role === 'ceo' || currentUser.role === 'hr') && (
                    <Button className="rounded-2xl h-12 px-6 bg-primary text-primary-foreground transition-all hover:scale-[1.02]">
                        <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                    </Button>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or department..."
                        className="pl-10 h-12 rounded-xl border-border/40 bg-secondary/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="h-12 rounded-xl border-border/40 gap-2 flex-1 md:flex-none">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Badge variant="secondary" className="h-12 px-4 rounded-xl items-center hidden md:flex font-medium">
                        {teamMembers.length} Members
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="border-border/40 animate-pulse">
                            <CardContent className="h-48" />
                        </Card>
                    ))
                ) : teamMembers.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground font-light italic">
                        No team members found matching your search.
                    </div>
                ) : (
                    teamMembers.map(member => (
                        <Card key={member.id} className="group border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                            <CardHeader className="relative pb-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Remove from Team</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="relative">
                                        <Avatar className="h-20 w-20 border-2 border-background ring-4 ring-secondary/30">
                                            <AvatarFallback className="text-xl">{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-background shadow-sm" />
                                    </div>
                                    <div>
                                        <CardTitle className="font-serif text-lg">{member.firstName} {member.lastName}</CardTitle>
                                        <div className="flex items-center justify-center gap-1.5 mt-1">
                                            <Badge variant="outline" className="rounded-lg bg-primary/5 text-primary border-primary/10 text-[10px] uppercase font-bold tracking-wider">
                                                {member.role}
                                            </Badge>
                                            <span className="text-muted-foreground/30 text-xs">•</span>
                                            <span className="text-xs text-muted-foreground font-light">{member.department}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-light">
                                        <Mail className="h-3.5 w-3.5" />
                                        {member.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-light">
                                        <Shield className="h-3.5 w-3.5" />
                                        {member.position || 'Employee'}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-2">
                                    <Button variant="secondary" className="flex-1 rounded-xl h-9 text-xs font-semibold">Message</Button>
                                    <Button variant="outline" className="flex-1 rounded-xl h-9 text-xs font-semibold border-border/40">Profile</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
