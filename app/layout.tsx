import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { PWARegistration } from "@/components/pwa-registration"
import { ProgressBar } from "@/components/progress-bar"
import "./globals.css"
import { Providers } from "@/components/providers"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: ["400"] })

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "Presence | Modern Attendance System",
    template: "%s | Presence",
  },
  description: "Experience the next generation of office attendance and team management with real-time tracking, AI-powered insights, and seamless integration.",
  keywords: ["attendance system", "HR management", "team tracking", "office management", "Presence app"],
  authors: [{ name: "Presence Team" }],
  creator: "Presence",
  publisher: "Presence",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://presence-web.vercel.app",
    siteName: "Presence",
    title: "Presence | Modern Attendance System",
    description: "Experience the next generation of office attendance and team management.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Presence - Modern Attendance System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Presence | Modern Attendance System",
    description: "Experience the next generation of office attendance and team management.",
    images: ["/og-image.png"],
    creator: "@presence",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased text-foreground bg-background">
        <Providers>
          <ProgressBar />
          {children}
          <Analytics />
          <PWARegistration />
        </Providers>
      </body>
    </html>
  )
}
