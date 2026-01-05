"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2, Building2 } from "lucide-react"

export default function JoinCompanyPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        role: "staff",
    })
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const [success, setSuccess] = React.useState(false)
    const [companyInfo, setCompanyInfo] = React.useState<{ name: string } | null>(null)

    React.useEffect(() => {
        // In a real app, fetch company name by slug
        // For now, mockup
        setCompanyInfo({ name: slug.replace(/-/g, ' ').toUpperCase() })
    }, [slug])

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

        setIsLoading(true)

        // Simulate registration with company slug
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setSuccess(true)
        setTimeout(() => {
            router.push("/auth/login")
        }, 2000)
    }

    const departments = ["Engineering", "Marketing", "Sales", "Human Resources", "Finance", "Operations", "Design"]

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
                        <h2 className="text-2xl font-serif mb-2">Welcome to {companyInfo?.name}!</h2>
                        <p className="text-muted-foreground font-light">
                            Your staff account has been created. Redirecting to login...
                        </p>
                    </CardContent>
                </Card>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6 py-12 bg-gradient-to-br from-background via-secondary/20 to-background">
            <div className="w-full max-w-md relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>

                <Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
                    <div className="h-2 bg-primary" />
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary text-primary">
                                <Building2 className="w-7 h-7" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-serif">Join {companyInfo?.name}</CardTitle>
                        <CardDescription className="text-base font-light">
                            Create your staff account for {companyInfo?.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
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
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
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
                                <Label htmlFor="email" className="text-sm font-medium">Work email</Label>
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

                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                                <Select onValueChange={(value) => handleChange("department", value)}>
                                    <SelectTrigger className="h-11 rounded-xl border-border/40 bg-secondary/30">
                                        <SelectValue placeholder="Select your department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept.toLowerCase()}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
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

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-base font-semibold mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Joining...</>
                                ) : (
                                    "Join Company"
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-foreground font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
