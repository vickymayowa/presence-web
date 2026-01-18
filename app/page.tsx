import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowUpRight,
  Globe,
  Shield,
  Zap,
  Clock,
  Users,
  BarChart3,
  Smartphone,
  CheckCircle2,
  Star,
  TrendingUp,
  Lock,
  Sparkles,
  Calendar
} from "lucide-react"
import type { Metadata } from "next"

import { ThemeToggle } from "@/components/theme-toggle"

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
            <ThemeToggle />
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
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-8 rounded-full text-lg font-semibold group transition-all shadow-2xl shadow-primary/20"
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
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl md:text-6xl font-serif tracking-tight">
            Everything you need, <span className="text-muted-foreground/40">nothing you don't</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Powerful features designed to streamline attendance management for teams of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Verified Identity",
              description: "AI facial recognition ensures the right person is at the right place, every single time.",
              color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
            },
            {
              icon: Globe,
              title: "Global Compliance",
              description: "Automatically handles region-specific labor laws, breaks, and overtime policies.",
              color: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
            },
            {
              icon: Zap,
              title: "Instant Analytics",
              description: "Real-time dashboards provide immediate insight into workforce capacity and costs.",
              color: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
            },
            {
              icon: Clock,
              title: "Smart Scheduling",
              description: "Intelligent shift planning with automated conflict detection and optimal coverage.",
              color: "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400",
            },
            {
              icon: Smartphone,
              title: "Mobile First",
              description: "Native apps for iOS and Android with offline support and instant sync.",
              color: "bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
            },
            {
              icon: BarChart3,
              title: "Advanced Reports",
              description: "Export detailed reports with custom filters, trends, and predictive insights.",
              color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-12 rounded-[2.5rem] bg-secondary/20 border border-border/30 hover:bg-secondary/40 hover:border-border/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feature.color} transition-transform group-hover:scale-110 duration-500`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-serif mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Feature Showcase */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">AI-Powered</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight leading-tight">
              Attendance that thinks ahead
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Our AI engine learns your team's patterns, predicts attendance trends, and automatically flags anomalies before they become problems.
            </p>
            <ul className="space-y-4">
              {[
                "Predictive analytics for workforce planning",
                "Automatic anomaly detection and alerts",
                "Smart recommendations for optimal scheduling",
                "Fraud prevention with behavioral analysis"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-lg text-muted-foreground font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/20 to-purple-500/20 border border-border/40 flex items-center justify-center">
              <div className="text-center space-y-4 p-12">
                <BarChart3 className="w-24 h-24 mx-auto text-primary/60" />
                <p className="text-sm text-muted-foreground font-light">Interactive Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Breakdown */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32 bg-primary text-primary-foreground rounded-[4rem] mx-6 mb-32 shadow-2xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Trusted by thousands worldwide</h2>
          <p className="text-lg text-primary-foreground/60 font-light">Numbers that speak for themselves</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 text-center px-12">
          {[
            { value: "99.9%", label: "Uptime SLA", icon: TrendingUp },
            { value: "2M+", label: "Verified Check-ins", icon: Users },
            { value: "<1s", label: "Average Latency", icon: Zap },
          ].map((stat, index) => (
            <div key={index} className="space-y-6">
              <stat.icon className="w-12 h-12 mx-auto opacity-60" />
              <p className="text-7xl font-serif">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl md:text-6xl font-serif tracking-tight">
            Loved by teams everywhere
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            See what our customers have to say about transforming their attendance management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "Presence transformed how we manage our distributed team. The AI verification is a game-changer.",
              author: "Sarah Chen",
              role: "HR Director",
              company: "TechCorp Global"
            },
            {
              quote: "We reduced attendance fraud by 95% in the first month. The ROI was immediate and substantial.",
              author: "Michael Rodriguez",
              role: "Operations Manager",
              company: "Manufacturing Co"
            },
            {
              quote: "The mobile app is incredibly intuitive. Our employees actually enjoy using it, which is rare!",
              author: "Emily Watson",
              role: "CEO",
              company: "StartupXYZ"
            }
          ].map((testimonial, index) => (
            <div key={index} className="p-10 rounded-[2rem] bg-secondary/20 border border-border/30 space-y-6 hover:bg-secondary/40 transition-all duration-500">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg leading-relaxed font-light text-muted-foreground italic">
                "{testimonial.quote}"
              </p>
              <div className="pt-4 border-t border-border/20">
                <p className="font-semibold text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-5xl md:text-6xl font-serif tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Start free, upgrade as you grow. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              description: "Perfect for trying out Presence",
              features: ["Up to 10 employees", "Basic attendance tracking", "7-day data retention", "Community support"]
            },
            {
              name: "Starter",
              price: "$29",
              period: "per month",
              description: "For small teams getting started",
              features: ["Up to 50 employees", "Basic analytics", "30-day data retention", "Mobile apps", "Email support"]
            },
            {
              name: "Professional",
              price: "$99",
              period: "per month",
              description: "For growing teams with advanced needs",
              features: ["Up to 500 employees", "Advanced analytics", "AI verification", "Unlimited data retention", "Priority support", "Custom integrations"],
              popular: true
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "contact us",
              description: "For large organizations at scale",
              features: ["Unlimited employees", "White-label options", "Dedicated support", "SLA guarantee", "Custom development", "On-premise deployment"]
            }
          ].map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 ${plan.popular
                ? 'bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20 lg:scale-105'
                : 'bg-secondary/20 border-border/30 hover:bg-secondary/40'
                }`}
            >
              {plan.popular && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/20 mb-4">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Most Popular</span>
                </div>
              )}
              <h3 className="text-xl font-serif mb-2">{plan.name}</h3>
              <p className={`text-xs mb-6 ${plan.popular ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-serif">{plan.price}</span>
                <span className={`text-xs ml-2 ${plan.popular ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className={`text-xs ${plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full rounded-xl py-5 text-sm font-semibold ${plan.popular
                  ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
              >
                {plan.price === "$0" ? "Get Started Free" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="relative rounded-[4rem] bg-gradient-to-br from-primary/10 to-purple-500/10 border border-border/40 p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight leading-tight">
              Ready to transform your attendance management?
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              Join thousands of teams already using Presence to streamline their workforce operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-8 rounded-full text-lg font-semibold group transition-all shadow-2xl shadow-primary/20"
                >
                  Start Free Trial
                  <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/40 hover:bg-secondary/50 px-12 py-8 rounded-full text-lg font-semibold bg-transparent"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
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
            {[
              {
                title: "Platform",
                links: ["Features", "Integrations", "Security", "Pricing"]
              },
              {
                title: "Resources",
                links: ["Documentation", "API Reference", "Blog", "Support"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Partners"]
              }
            ].map((section) => (
              <div key={section.title} className="space-y-8">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">{section.title}</h4>
                <ul className="space-y-4 text-muted-foreground font-light text-sm">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
            <p>© 2025 Presence Technologies. All rights reserved.</p>
            <div className="flex gap-10">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
