import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-12 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Decorative Element */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-secondary/30 border border-border/40 flex items-center justify-center rotate-12">
                        <span className="font-serif text-4xl text-muted-foreground/60">404</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-tight">
                        Lost in the <span className="text-muted-foreground/40 italic">presence.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed text-pretty">
                        The page you are looking for has either drifted out of sync or never existed in this timeline.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <Link href="/">
                        <Button
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] group"
                        >
                            <Home className="mr-2 w-4 h-4" />
                            Return Home
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="lg"
                        className="border-border/40 hover:bg-secondary/50 px-8 py-6 rounded-full text-sm font-semibold bg-transparent"
                    // Use a simple history back as a fallback for the "Go Back" action
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Go Back
                    </Button>
                </div>
            </div>

            {/* Subtle Background Pattern */}
            <div className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>
        </main>
    )
}
