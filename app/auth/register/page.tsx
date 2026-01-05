"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        role: "",
        companyName: "",
    })
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState(false)

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setIsLoading(true)

        // Simulate registration
        await new Promise((resolve) => setTimeout(resolve, 3500))

        setSuccess(true)
        setTimeout(() => {
            router.push("/auth/login")
        }, 2000)
    }

    const departments = [
        "Engineering",
        "Marketing",
        "Sales",
        "Human Resources",
        "Finance",
        "Operations",
        "Design",
        "Customer Support",
    ]

    const roles = [
        { value: "staff", label: "Staff Member" },
        { value: "manager", label: "Manager" },
        { value: "hr", label: "HR Personnel" },
        { value: "ceo", label: "CEO / Business Owner" },
    ]

    if (success) {
        return (
            <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-secondary/20 to-background">
                <Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-2xl max-w-md w-full">
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-serif mb-2">Registration Successful!</h2>
                        <p className="text-muted-foreground font-light">
                            Your account has been created. Redirecting to login...
                        </p>
                    </CardContent>
                </Card>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6 py-12 bg-gradient-to-br from-background via-secondary/20 to-background">
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
                        <CardTitle className="text-3xl font-serif">Create account</CardTitle>
                        <CardDescription className="text-base font-light">
                            Join your team on Presence
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">
                                        First name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                        className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">
                                        Last name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                        className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Work email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-sm font-medium">
                                        Department
                                    </Label>
                                    <Select onValueChange={(value) => handleChange("department", value)}>
                                        <SelectTrigger className="h-11 rounded-xl border-border/40 bg-secondary/30">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept} value={dept}>
                                                    {dept}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-medium">
                                        Role
                                    </Label>
                                    <Select onValueChange={(value) => handleChange("role", value)}>
                                        <SelectTrigger className="h-11 rounded-xl border-border/40 bg-secondary/30">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {formData.role === "ceo" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Label htmlFor="companyName" className="text-sm font-medium">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        placeholder="Acme Corp"
                                        value={formData.companyName}
                                        onChange={(e) => handleChange("companyName", e.target.value)}
                                        className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors"
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors pr-12"
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repeat password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                    className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-colors"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-semibold mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-foreground font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>

                        <p className="text-center text-xs text-muted-foreground/60 mt-4">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="hover:underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main >
    )
}
