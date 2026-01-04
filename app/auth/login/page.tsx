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
        <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-secondary/20 to-background">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                <Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-serif">Welcome back</CardTitle>
                        <CardDescription className="text-base font-light">
                            Sign in to your Presence account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
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
                                    className="h-12 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors"
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
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors pr-12"
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
                                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-semibold"
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

                        {/* Demo login options */}
                        <div className="mt-8 pt-6 border-t border-border/40">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 text-center mb-4">
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
                                        className="rounded-xl border-border/40 hover:bg-secondary/50 text-xs font-medium"
                                    >
                                        Login as {demo.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="text-foreground font-medium hover:underline">
                                Create one
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
