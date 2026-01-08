import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpRight, Globe, Shield, Zap } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modern Attendance for Modern Teams",
  description: "Presence is the AI-native attendance system built for high-performance teams. Real-time tracking, global compliance, and effortless management.",
}

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-10">
            <span className="font-serif text-3xl tracking-tight">Presence</span>
            <div className="hidden md:flex items-center gap-8">
              {["Platform", "Solutions", "Pricing", "Company"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm font-semibold hover:bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Start Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-40">
        <div className="text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/50 border border-border/40 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              New: Enterprise-grade AI Verification
            </span>
          </div>

          <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="text-7xl md:text-9xl font-serif leading-[0.85] tracking-tighter text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Attendance built for the <span className="text-muted-foreground/40 italic">future.</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty font-light animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Effortlessly manage global workforces with AI-native tracking. Verified, compliant, and remarkably simple.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-8 rounded-full text-lg font-semibold group transition-all"
              >
                Request Access
                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="border-border/40 hover:bg-secondary/50 px-12 py-8 rounded-full text-lg font-semibold bg-transparent"
              >
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border/20 py-16 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-12">
            Trusted by Industry Leaders
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="h-8 w-32 bg-muted-foreground/20 rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Verified Identity",
              description: "AI facial recognition ensures the right person is at the right place, every single time.",
              color: "bg-blue-50/50 text-blue-600",
            },
            {
              icon: Globe,
              title: "Global Compliance",
              description: "Automatically handles region-specific labor laws, breaks, and overtime policies.",
              color: "bg-orange-50/50 text-orange-600",
            },
            {
              icon: Zap,
              title: "Instant Analytics",
              description: "Real-time dashboards provide immediate insight into workforce capacity and costs.",
              color: "bg-purple-50/50 text-purple-600",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-12 rounded-[2.5rem] bg-secondary/20 border border-border/30 hover:bg-secondary/40 hover:border-border/60 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feature.color}`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Breakdown */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32 bg-primary text-primary-foreground rounded-[4rem] mx-6 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center px-12">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "2M+", label: "Verified Check-ins" },
            { value: "<1s", label: "Latency" },
          ].map((stat, index) => (
            <div key={index} className="space-y-4">
              <p className="text-7xl font-serif">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="space-y-8">
              <span className="font-serif text-3xl">Presence</span>
              <p className="text-muted-foreground leading-relaxed font-light text-lg">
                Setting the global standard for modern workforce attendance.
              </p>
            </div>
            {["Platform", "Resources", "Legal"].map((title) => (
              <div key={title} className="space-y-8">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">{title}</h4>
                <ul className="space-y-4 text-muted-foreground font-light text-sm">
                  {["Link One", "Link Two", "Link Three"].map((l) => (
                    <li key={l}>
                      <Link href="#" className="hover:text-foreground transition-colors">
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <p>© 2025 Presence Technologies</p>
            <div className="flex gap-10">
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
