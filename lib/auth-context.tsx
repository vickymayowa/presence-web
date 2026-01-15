"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch } from "./store/hooks"
import { setUser as setReduxUser, setLoading as setReduxLoading } from "./store/slices/authSlice"

const AuthContext = createContext(null)
const storageKey = "presence_user_session"

export function AuthProvider({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load user once
    useEffect(() => {
        const saved = localStorage.getItem(storageKey)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setUser(parsed)
                dispatch(setReduxUser(parsed))
            } catch {
                localStorage.removeItem(storageKey)
            }
        }
        setIsLoading(false)
        dispatch(setReduxLoading(false))
    }, [dispatch])

    // 🔐 Centralized routing logic
    useEffect(() => {
        if (isLoading) return

        const isAuth = pathname.startsWith("/auth")
        const isDashboard = pathname.startsWith("/dashboard")

        if (!user && isDashboard) {
            router.replace("/auth/login")
        }

        if (user && isAuth) {
            router.replace("/dashboard")
        }
    }, [user, pathname, isLoading])

    // 🔄 Single-session enforcement (safe)
    useEffect(() => {
        if (!user) return

        const interval = setInterval(async () => {
            try {
                const res = await fetch("/api/auth/session-check")
                const result = await res.json()

                if (!result.success) {
                    internalLogout()
                    alert("You were logged out because another device signed in.")
                }
            } catch { }
        }, 30000)

        return () => clearInterval(interval)
    }, [user])

    const login = async (email, password) => {
        setIsLoading(true)
        dispatch(setReduxLoading(true))

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            const result = await res.json()

            if (res.ok && result.data?.user) {
                setUser(result.data.user)
                dispatch(setReduxUser(result.data.user))
                localStorage.setItem(storageKey, JSON.stringify(result.data.user))
                return { success: true }
            }

            return { success: false, error: result.message }
        } finally {
            setIsLoading(false)
            dispatch(setReduxLoading(false))
        }
    }

    const internalLogout = () => {
        setUser(null)
        dispatch(setReduxUser(null))
        localStorage.removeItem(storageKey)
        fetch("/api/auth/logout", { method: "POST" })
    }

    const logout = () => {
        internalLogout()
        router.replace("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
