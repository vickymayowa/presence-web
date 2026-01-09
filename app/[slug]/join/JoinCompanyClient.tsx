"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react"

export default function JoinCompanyClient() {
    const params = useParams()
    const router = useRouter()
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const slug = params.slug as string
    const capitalizedSlug = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Organization"

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "staff" as const,
        department: "Engineering",
        companyName: slug, // We pass the slug so the backend knows which company to join
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await register(formData)
            if (result.success) {
                toast.success(`Welcome to ${capitalizedSlug}!`, {
                    description: "Your account has been created and linked to the organization.",
                })
                router.push("/dashboard")
            } else {
                toast.error("Registration failed", {
                    description: result.error || "Please check your information.",
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
            <div className="space-y-2 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10 mb-2">
                        <ShieldCheck className="w-3 h-3 text-green-600" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Official Invitation</span>
                    </div>
                </div>
                <h1 className="text-3xl font-serif tracking-tight">Join {capitalizedSlug}</h1>
                <p className="text-sm text-muted-foreground font-light">
                    Create your account to join the {capitalizedSlug} workspace on Presence.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                        Work Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder={`name@${slug}.com`}
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

                <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        Department
                    </Label>
                    <Input
                        id="department"
                        placeholder="e.g. Design, Operations"
                        required
                        value={formData.department}
                        onChange={handleChange}
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
                            Join Organization
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    By joining, you agree to Presence's <br />
                    <Link href="/terms" className="font-semibold text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    )
}
