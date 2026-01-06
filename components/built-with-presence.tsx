import Link from "next/link"
import { Sparkles } from "lucide-react"

export function BuiltWithPresence() {
    return (
        <Link
            href="/"
            className="fixed bottom-4 right-4 z-50 group flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur-md transition-all hover:border-border hover:bg-background hover:text-foreground hover:shadow-xl"
        >
            <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-foreground">Built with Presence</span>
            </span>
        </Link>
    )
}
