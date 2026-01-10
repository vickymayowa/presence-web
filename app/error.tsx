"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md fixed top-0 z-50 w-full border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <Link href="/">
            <span className="font-serif text-3xl tracking-tight hover:opacity-70 transition-opacity">
              Presence
            </span>
          </Link>
        </div>
      </nav>

      {/* Error Content */}
      <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center space-y-12 pt-20">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-destructive/10 text-destructive animate-in fade-in slide-in-from-bottom-4 duration-700">
          <AlertTriangle className="w-12 h-12" />
        </div>

        {/* Error Heading */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-serif leading-tight tracking-tighter text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Something went wrong
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty font-light animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            We encountered an unexpected error. Our team has been notified and
            is looking into it. Please try again or return to the homepage.
          </p>
        </div>

        {/* Error Details */}
        {error?.message && (
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border/40 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <p className="text-sm text-muted-foreground font-mono break-words text-left">
              <span className="text-destructive/70">Error:</span>{" "}
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
          <Button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 rounded-full text-base font-semibold group transition-all inline-flex items-center"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="border-border/40 hover:bg-secondary/50 px-10 py-6 rounded-full text-base font-semibold bg-transparent inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 pt-8">
          Need help?{" "}
          <Link
            href="#"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact Support
          </Link>
        </p>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </main>
  );
}
