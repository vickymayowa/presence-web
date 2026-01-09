"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2, ArrowRight } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await login(email, password)
            if (result.success) {
                toast.success("Welcome back!", {
                    description: "You have successfully signed in.",
                })
                router.push("/dashboard")
            } else {
                toast.error("Login failed", {
                    description: result.error || "Please check your credentials and try again.",
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h1 className="text-3xl font-serif tracking-tight">Sign in</h1>
                <p className="text-sm text-muted-foreground font-light">
                    Enter your credentials to access your workspace
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
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

                <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="rounded-md border-border/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <label
                        htmlFor="remember"
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                    >
                        Keep me signed in
                    </label>
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
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-muted-foreground font-light">
                    Don't have an account?{" "}
                    <Link
                        href="/auth/register"
                        className="font-semibold text-primary hover:underline underline-offset-4"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}
