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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h1 className="text-3xl font-serif">Create account</h1>
                <p className="text-muted-foreground font-light">
                    Join your team and track your progress on Presence
                </p>
            </div>

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
                            className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all"
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
                            className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all"
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
                        className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all"
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
                            className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all"
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
                            className="h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all pr-12"
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
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/10 mt-2"
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

            <p className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-foreground font-semibold hover:underline underline-offset-4">
                    Sign in
                </Link>
            </p>

            <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/40 pt-4 leading-loose">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="hover:text-foreground underline underline-offset-2">Terms</Link> &{" "}
                <Link href="/privacy" className="hover:text-foreground underline underline-offset-2">Privacy</Link>
            </p>
        </div>
    )
}
    )
}
