"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Eye, EyeOff, Loader2, Building2 } from "lucide-react"
import { useCompanyQuery } from "@/lib/queries/presence-queries"

export default function CompanyLoginPage() {
    const router = useRouter()
    const params = useParams()
    const { login } = useAuth()

    // Extract slug ensuring it's a string, handling array case if needed
    const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';

    const { data: company, isLoading: isCompanyLoading } = useCompanyQuery(slug)

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    if (isCompanyLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            </div>
        )
    }

    if (!company && slug) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="p-4 rounded-full bg-secondary/30">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">Company not found</h2>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                        The organization "{slug}" does not exist in our system.
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.push('/auth/login')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Universal Login
                </Button>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Pass an optional check in a real scenario to ensure user belongs to this company ID
        // For now, simple login is fine as the mock data is simple
        const result = await login(email, password)

        if (result.success) {
            router.push("/dashboard")
        } else {
            setError(result.error || "Login failed")
        }

        setIsLoading(false)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">
                        {company?.name} Workspace
                    </span>
                </div>
                <h1 className="text-3xl font-serif">Sign in to {company?.name}</h1>
                <p className="text-muted-foreground font-light">
                    Enter your credentials to access the team dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Work Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={`name@${company?.slug}.com`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl border-border/40 bg-secondary/30 focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Forgot?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-destructive shrink-0" />
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/10"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Authenticating...
                        </>
                    ) : (
                        "Sign in to Workspace"
                    )}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground pt-4">
                Not {company?.name}?{" "}
                <Link href="/auth/login" className="text-foreground font-semibold hover:underline underline-offset-4">
                    Find another workspace
                </Link>
            </p>
        </div>
    )
}
