"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"

interface UseSessionCheckProps {
    onLogout?: () => void
    checkInterval?: number
}

export function useSessionCheck({ onLogout, checkInterval = 30000 }: UseSessionCheckProps = {}) {
    const { user } = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [logoutReason, setLogoutReason] = useState<string>("")

    useEffect(() => {
        if (!user) return

        const interval = setInterval(async () => {
            try {
                const res = await fetch("/api/auth/session-check")
                const result = await res.json()

                if (!result.success) {
                    setLogoutReason("You were logged out because another device signed in.")
                    setShowLogoutModal(true)
                    onLogout?.()
                }
            } catch {
                // Silent error handling for network issues
            }
        }, checkInterval)

        return () => clearInterval(interval)
    }, [user, checkInterval, onLogout])

    return {
        showLogoutModal,
        setShowLogoutModal,
        logoutReason,
    }
}
