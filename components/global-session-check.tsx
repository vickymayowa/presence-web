"use client"

import React from "react"
import SessionLogoutModal from "@/components/session-logout-modal"
import { useSessionCheck } from "@/hooks/use-session-check"
import { useAuth } from "@/lib/auth-context"

export function GlobalSessionCheck() {
    const { internalLogout } = useAuth()

    const handleLogout = React.useCallback(() => {
        internalLogout()
    }, [internalLogout])

    const { showLogoutModal, setShowLogoutModal, logoutReason } = useSessionCheck({
        onLogout: handleLogout,
        checkInterval: 30000
    })

    return (
        <SessionLogoutModal
            open={showLogoutModal}
            onOpenChange={setShowLogoutModal}
            reason={logoutReason}
        />
    )
}
