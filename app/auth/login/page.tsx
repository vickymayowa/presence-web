"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        const result = await login(email, password)

        if (result.success) {
            router.push("/dashboard")
        } else {
            setError(result.error || "Login failed")
        }

        setIsLoading(false)
    }

    // Demo login shortcuts
    const demoLogins = [
        { label: "CEO", email: "ceo@presence.io" },
        { label: "HR", email: "hr@presence.io" },
        { label: "Manager", email: "manager@presence.io" },
        { label: "Staff", email: "john@presence.io" },
    ]

    const handleDemoLogin = async (demoEmail: string) => {
        setEmail(demoEmail)
        setPassword("demo123")
        setIsLoading(true)

        const result = await login(demoEmail, "demo123")
        if (result.success) {
            router.push("/dashboard")
        }
        setIsLoading(false)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h1 className="text-3xl font-serif">Welcome back</h1>
                <p className="text-muted-foreground font-light">
                    Enter your credentials to access your dashboard
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
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
                            Signing in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>

            <div className="pt-6 border-t border-border/40">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-4 text-center">
                    Quick Demo Access
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {demoLogins.map((demo) => (
                        <Button
                            key={demo.label}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDemoLogin(demo.email)}
                            disabled={isLoading}
                            className="rounded-xl border-border/40 hover:bg-secondary/50 text-[10px] font-bold uppercase tracking-wider"
                        >
                            {demo.label}
                        </Button>
                    ))}
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground pt-4">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-foreground font-semibold hover:underline underline-offset-4">
                    Sign up
                </Link>
            </p>
        </div>
    )
}
