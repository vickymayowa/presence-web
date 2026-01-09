"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "ceo",
        department: "Administration",
        companyName: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (step === 1) {
            setStep(2)
            return
        }

        setIsLoading(true)
        try {
            const result = await register(formData)
            if (result.success) {
                toast.success("Account created!", {
                    description: "Welcome to Presence. Let's get started.",
                })
                router.push("/dashboard")
            } else {
                toast.error("Registration failed", {
                    description: result.error || "Please check your information and try again.",
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
                <h1 className="text-3xl font-serif tracking-tight">Create account</h1>
                <p className="text-sm text-muted-foreground font-light">
                    {step === 1 ? "Start your 14-day free trial" : "Tell us about your organization"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    placeholder="John"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    placeholder="Doe"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                I am registering as
                            </Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <SelectTrigger className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40">
                                    <SelectItem value="ceo">CEO / Founder</SelectItem>
                                    <SelectItem value="hr">HR Administrator</SelectItem>
                                    <SelectItem value="manager">Department Manager</SelectItem>
                                    <SelectItem value="staff">Staff Member</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.role === 'ceo' ? (
                            <div className="space-y-2 animate-in fade-in duration-300">
                                <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    Company Name
                                </Label>
                                <Input
                                    id="companyName"
                                    placeholder="Acme Corp"
                                    required
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2 animate-in fade-in duration-300">
                                <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                    Organization ID (Optional)
                                </Label>
                                <Input
                                    id="companyName"
                                    placeholder="Leave blank to join default"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="department" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                                Department
                            </Label>
                            <Input
                                id="department"
                                placeholder="e.g. Engineering"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                className="h-12 rounded-xl bg-secondary/20 border-border/40 focus-visible:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    {step === 2 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="h-12 rounded-xl border-border/40 hover:bg-secondary/50 transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] group"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {step === 1 ? "Next Step" : "Create Account"}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-sm text-muted-foreground font-light">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-semibold text-primary hover:underline underline-offset-4"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
