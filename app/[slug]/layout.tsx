import type * as React from "react"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import type { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug?: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
        return {
            title: "Workspace — Presence",
            description: "Securely sign in to your workspace on Presence.",
        };
    }

    const capitalizedSlug = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
        title: `${capitalizedSlug} Workspace`,
        description: `Securely sign in to your ${capitalizedSlug} workspace on Presence.`,
    };
}


export default function CompanyAuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background selection:bg-primary/10">
            {/* Left Side: Visual / Branding */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-secondary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] -ml-48 -mb-48" />

                <Link href="/" className="flex items-center gap-3 relative z-10 transition-transform hover:scale-105 w-fit">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <ShieldCheck className="size-6" />
                    </div>
                    <span className="font-serif text-2xl tracking-tight">Presence</span>
                </Link>

                <div className="relative z-10 space-y-6 max-w-md">
                    <h2 className="text-5xl font-serif leading-[1.1] tracking-tight">
                        Your personalized <span className="text-primary italic">workspace</span> awaits.
                    </h2>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                        Securely access your company dashboard to manage tasks, attendance, and team collaborations.
                    </p>

                    <div className="flex items-center gap-6 pt-8">
                        <div className="space-y-1">
                            <p className="text-2xl font-serif">Secure</p>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Encrypted</p>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="space-y-1">
                            <p className="text-2xl font-serif">Fast</p>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Access</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-sm text-muted-foreground font-light">
                    <span>© 2026 Presence Inc.</span>
                    <span className="size-1 rounded-full bg-border" />
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                    <span className="size-1 rounded-full bg-border" />
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="flex flex-col relative overflow-hidden">
                <div className="lg:hidden absolute top-8 left-8 z-20">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <ShieldCheck className="size-5" />
                        </div>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center py-12 px-6 lg:px-12 relative z-10">
                    <div className="w-full max-w-sm">
                        {children}
                    </div>
                </div>

                {/* Mobile/Small Screen Footer */}
                <div className="lg:hidden p-8 text-center text-xs text-muted-foreground border-t border-border/40">
                    © 2026 Presence Inc.
                </div>
            </div>
        </div>
    )
}
