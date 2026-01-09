"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

export default function CompanyLoginClient() {
    const params = useParams()
    const router = useRouter()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const slug = params.slug as string
    const capitalizedSlug = slug ? slug.toUpperCase() + slug.slice(1) : "Organization"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await login(email, password)
            if (result.success) {
                toast.success(`Welcome to ${capitalizedSlug}!`, {
                    description: "You have successfully signed in.",
                })
                router.push("/dashboard")
            } else {
                toast.error("Login failed", {
                    description: result.error || "Please check your credentials.",
                })
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Something went wrong. Please try again later.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center lg:text-left">
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{capitalizedSlug} Workspace</span>
                </div>
                <h1 className="text-3xl font-serif tracking-tight">Sign in</h1>
                <p className="text-sm text-muted-foreground font-light">
                    Enter your {capitalizedSlug} credentials to continue
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={`name@${slug}.com`}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                            Password
                        </Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                        >
                            Forgot?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] group"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            Sign In to {capitalizedSlug}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </Button>
            </form>

            <div className="pt-4">
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Not part of {capitalizedSlug}? <br />
                    <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                        Switch Organization
                    </Link> or <Link href="/auth/register" className="font-semibold text-primary hover:underline">Create a new one</Link>
                </p>
            </div>
        </div>
    )
}
