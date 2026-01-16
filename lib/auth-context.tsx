"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAppDispatch } from "./store/hooks"
import { setUser as setReduxUser, setLoading as setReduxLoading } from "./store/slices/authSlice"

import { User } from "./types"

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    register: (data: any) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    internalLogout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const storageKey = "presence_user_session"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useAppDispatch()

    const [user, setUser] = useState<User | null>(null)
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

    const login = async (email: string, password: string) => {
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

    const register = async (data: any) => {
        setIsLoading(true)
        dispatch(setReduxLoading(true))

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            const result = await res.json()

            if (res.ok && result.data?.user) {
                setUser(result.data.user)
                dispatch(setReduxUser(result.data.user))
                localStorage.setItem(storageKey, JSON.stringify(result.data.user))
                return { success: true }
            }

            return { success: false, error: result.message || "Registration failed" }
        } catch (error) {
            return { success: false, error: "An unexpected error occurred" }
        } finally {
            setIsLoading(false)
            dispatch(setReduxLoading(false))
        }
    }

    const internalLogout = () => {
        setUser(null)
        dispatch(setReduxUser(null))
        localStorage.removeItem(storageKey)
        localStorage.removeItem("presence_auth_token") // Legacy key cleanup
        fetch("/api/auth/logout", { method: "POST" })
    }

    const logout = () => {
        internalLogout()
        router.replace("/auth/login")
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, internalLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
