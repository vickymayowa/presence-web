"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Search,
    FileText,
    Users,
    Settings,
    User,
    Home,
    Calendar,
    Clock,
    Megaphone,
    ArrowRight,
    TrendingUp,
    ShieldCheck
} from "lucide-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from "@/components/ui/command"

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-muted-foreground border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-colors group"
            >
                <Search className="size-4 group-hover:text-foreground transition-colors" />
                <span className="hidden lg:inline-block">Search presence...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="max-h-[400px]">
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Dashboard Overview</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/reports"))}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            <span>Performance Reports</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/attendance"))}>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Attendance History</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Team & Management">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/employees"))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Employee Directory</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/leaves"))}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Leave Requests</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/announcements"))}>
                            <Megaphone className="mr-2 h-4 w-4" />
                            <span>Announcements</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Account">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/profile"))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>My Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Account Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
