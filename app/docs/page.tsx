"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    Book,
    FileText,
    Search,
    ChevronRight,
    Home,
    Zap,
    Shield,
    BarChart3,
    Calendar,
    Users,
    Bell,
    Clock,
    Menu,
    X
} from "lucide-react"

// Documentation structure
const docStructure = [
    {
        title: "Getting Started",
        icon: Home,
        items: [
            { title: "Introduction", href: "/docs?page=README", file: "README.md" },
            { title: "Quick Start", href: "/docs?page=getting-started", file: "GETTING_STARTED.md" },
        ]
    },
    {
        title: "Features",
        icon: Zap,
        items: [
            { title: "Overview", href: "/docs?page=features", file: "features/overview.md" },
            { title: "Attendance Tracking", href: "/docs?page=attendance", file: "features/attendance-tracking.md" },
            { title: "Check-In Windows", href: "/docs?page=checkin-windows", file: "CHECKIN_WINDOWS.md" },
        ]
    },
    {
        title: "API Reference",
        icon: BarChart3,
        items: [
            { title: "API Documentation", href: "/docs?page=api", file: "API.md" },
        ]
    }
]

export default function DocsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [currentDoc, setCurrentDoc] = useState<string>("README.md")
    const [docContent, setDocContent] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // Get page from URL params
        const params = new URLSearchParams(window.location.search)
        const page = params.get('page')

        if (page === 'features') {
            setCurrentDoc('features/overview.md')
        } else if (page === 'attendance') {
            setCurrentDoc('features/attendance-tracking.md')
        } else if (page === 'checkin-windows') {
            setCurrentDoc('CHECKIN_WINDOWS.md')
        } else if (page === 'getting-started') {
            setCurrentDoc('GETTING_STARTED.md')
        } else if (page === 'api') {
            setCurrentDoc('API.md')
        } else {
            setCurrentDoc('README.md')
        }
    }, [])

    useEffect(() => {
        // Load documentation content
        fetch(`/docs/${currentDoc}`)
            .then(res => res.text())
            .then(text => setDocContent(text))
            .catch(err => {
                console.error('Error loading doc:', err)
                setDocContent('# Error\n\nCould not load documentation.')
            })
    }, [currentDoc])

    // Simple markdown to HTML converter (enhanced implementation)
    const renderMarkdown = (markdown: string) => {
        if (!markdown) return ''

        // 1. Split into blocks to handle code blocks separately
        const parts = markdown.split(/(```[\s\S]*?```)/g)

        return parts.map(part => {
            // Handle code blocks
            if (part.startsWith('```')) {
                const match = part.match(/```(\w+)?\n([\s\S]*?)```/)
                if (match) {
                    const [, , code] = match
                    return `<pre class="bg-secondary/50 p-4 rounded-lg my-4 overflow-x-auto"><code>${code.trim()}</code></pre>`
                }
                return part
            }

            // Handle normal markdown
            let html = part

            // Headers
            html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-serif mt-8 mb-4">$1</h3>')
            html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-serif mt-10 mb-6">$1</h2>')
            html = html.replace(/^# (.*$)/gim, '<h1 class="text-5xl font-serif mt-12 mb-8">$1</h1>')

            // Bold
            html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')

            // Italic
            html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')

            // Links
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')

            // Inline code
            html = html.replace(/`([^`]+)`/g, '<code class="bg-secondary/50 px-2 py-1 rounded text-sm">$1</code>')

            // Lists - Bullets
            html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-6 my-2 list-disc">$1</li>')

            // Lists - Numbered
            html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-6 my-2 list-decimal">$1</li>')

            // Paragraphs - Split only on double newlines that aren't inside tags we just made
            // This is still simple/fragile, but better than before
            return html.split('\n\n').map(para => {
                if (!para.trim()) return ''
                if (para.startsWith('<')) return para
                return `<p class="my-4 leading-relaxed text-muted-foreground">${para}</p>`
            }).join('\n')
        }).join('\n')
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 hover:bg-secondary rounded-lg"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <Link href="/" className="flex items-center gap-3">
                            <Book className="w-6 h-6 text-primary" />
                            <span className="font-serif text-xl">Presence Docs</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full border border-border/40">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search docs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm w-48"
                            />
                        </div>
                        <ThemeToggle />
                        <Link href="/dashboard">
                            <Button size="sm" className="rounded-full">
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex max-w-7xl mx-auto">
                {/* Sidebar */}
                <aside className={`
          fixed lg:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] 
          border-r border-border/40 bg-background p-6 overflow-y-auto
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <nav className="space-y-8">
                        {docStructure.map((section) => (
                            <div key={section.title}>
                                <div className="flex items-center gap-2 mb-3">
                                    <section.icon className="w-4 h-4 text-primary" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        {section.title}
                                    </h3>
                                </div>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => {
                                                    setCurrentDoc(item.file)
                                                    setSidebarOpen(false)
                                                }}
                                                className={`
                          flex items-center justify-between px-3 py-2 rounded-lg text-sm
                          transition-colors
                          ${currentDoc === item.file
                                                        ? 'bg-primary/10 text-primary font-medium'
                                                        : 'hover:bg-secondary/50 text-muted-foreground'
                                                    }
                        `}
                                            >
                                                {item.title}
                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 lg:p-12 min-h-[calc(100vh-4rem)]">
                    <article className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
                        <div
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(docContent) }}
                            className="documentation-content"
                        />
                    </article>

                    {/* Footer Navigation */}
                    <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-border/40">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Previous</p>
                                <Link href="#" className="text-sm font-medium hover:text-primary">
                                    ← Getting Started
                                </Link>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground mb-2">Next</p>
                                <Link href="#" className="text-sm font-medium hover:text-primary">
                                    Features Overview →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="max-w-4xl mx-auto mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/20">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif mb-2">Need more help?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Can't find what you're looking for? Our support team is here to help.
                                </p>
                                <div className="flex gap-3">
                                    <Link href="/support">
                                        <Button variant="outline" size="sm">
                                            Contact Support
                                        </Button>
                                    </Link>
                                    <Link href="/community">
                                        <Button variant="ghost" size="sm">
                                            Community Forum
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
