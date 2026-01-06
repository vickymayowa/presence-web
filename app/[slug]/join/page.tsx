"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Sparkles, CheckCircle2, ArrowRight, Loader2, Mail } from "lucide-react"
import { companies } from "@/lib/mock-data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function JoinCompanyPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()

    // Extract slug ensuring it's a string
    const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = React.useState(false)
    const [step, setStep] = React.useState<'verify' | 'details' | 'success'>('verify')
    const [email, setEmail] = React.useState("")
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [password, setPassword] = React.useState("")

    const company = companies.find(c => c.slug === slug)

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95">
                <div className="size-12 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                    <Building2 className="size-6 text-muted-foreground" />
                </div>
                <h1 className="text-xl font-semibold">Workspace not found</h1>
                <p className="text-muted-foreground text-sm mt-2 mb-6">
                    We couldn't find a workspace for <span className="font-mono bg-secondary px-1 py-0.5 rounded">{slug}</span>
                </p>
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
            </div>
        )
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate checking invite token
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        setStep('details')
    }

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate account creation
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsLoading(false)
        setStep('success')
        toast.success("Welcome aboard!", {
            description: `You've successfully joined ${company.name}`
        })
    }

    if (step === 'success') {
        return (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative mx-auto size-24">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                    <div className="relative bg-green-50 text-green-600 rounded-full size-24 flex items-center justify-center">
                        <CheckCircle2 className="size-12" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-serif">You're all set!</h2>
                    <p className="text-muted-foreground">
                        Your account has been created and you are now a member of <span className="font-semibold text-foreground">{company.name}</span>.
                    </p>
                </div>

                <Button
                    size="lg"
                    className="w-full h-12 rounded-xl text-base shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => router.push(`/${company.slug}/login`)}
                >
                    Go to Dashboard <ArrowRight className="ml-2 size-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-medium mb-4">
                    <Sparkles className="size-3" />
                    You've been invited to join
                </div>
                <h1 className="text-3xl font-serif">{company.name}</h1>
                <p className="text-muted-foreground font-light">
                    {step === 'verify'
                        ? "Enter your email to verify your invitation."
                        : "Complete your profile to get started."}
                </p>
            </div>

            {/* Steps Visualizer */}
            <div className="flex items-center gap-2 justify-center py-2">
                <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === 'verify' ? "bg-primary" : "bg-primary/20")} />
                <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === 'details' ? "bg-primary" : "bg-primary/20")} />
            </div>

            {step === 'verify' ? (
                <form onSubmit={handleVerify} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email verification</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl text-base" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : "Verify Invitation"}
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleJoin} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input
                                placeholder="Jane"
                                className="h-11 rounded-xl bg-secondary/20 border-border/40"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input
                                placeholder="Doe"
                                className="h-11 rounded-xl bg-secondary/20 border-border/40"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Create Password</Label>
                        <Input
                            type="password"
                            placeholder="Min. 8 characters"
                            className="h-11 rounded-xl bg-secondary/20 border-border/40"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Join Workspace"
                            )}
                        </Button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setStep('verify')}
                        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Back to verification
                    </button>
                </form>
            )}
        </div>
    )
}
