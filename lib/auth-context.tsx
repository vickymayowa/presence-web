"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from './types';
import { useAppDispatch } from './store/hooks';
import { setUser as setReduxUser, setLoading as setReduxLoading } from './store/slices/authSlice';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const storageKey = 'presence_user_session';

    useEffect(() => {
        // Check for saved session (user profile only, token is in HttpOnly cookie)
        const savedUser = localStorage.getItem(storageKey);
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                dispatch(setReduxUser(parsedUser));
            } catch {
                localStorage.removeItem(storageKey);
                setUser(null);
                dispatch(setReduxUser(null));
            }
        }
        setIsLoading(false);
        dispatch(setReduxLoading(false));

        // Periodic session check to enforce single session
        const interval = setInterval(() => {
            if (user) {
                checkSession();
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [dispatch, user]);

    const checkSession = async () => {
        try {
            const res = await fetch('/api/auth/session-check');
            const result = await res.json();
            if (!result.success) {
                // Session invalid (logged in elsewhere)
                logout();
                alert("You have been logged out because a new login was detected on another device.");
                window.location.href = "/auth/login";
            }
        } catch (error) {
            console.error("Session check failed", error);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        dispatch(setReduxLoading(true));

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await res.json();

            if (res.ok && result.data?.user) {
                const { user } = result.data;

                setUser(user);
                dispatch(setReduxUser(user));

                // Store only user object, token is handled by cookie
                localStorage.setItem(storageKey, JSON.stringify(user));

                return { success: true };
            } else {
                return { success: false, error: result.message || 'Invalid credentials' };
            }
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred during login' };
        } finally {
            setIsLoading(false);
            dispatch(setReduxLoading(false));
        }
    };

    const register = async (data: any): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        dispatch(setReduxLoading(true));

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            const result = await res.json();

            if (res.ok && result.data?.user) {
                const { user } = result.data;

                setUser(user);
                dispatch(setReduxUser(user));

                localStorage.setItem(storageKey, JSON.stringify(user));

                return { success: true };
            } else {
                return { success: false, error: result.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred during registration' };
        } finally {
            setIsLoading(false);
            dispatch(setReduxLoading(false));
        }
    };

    const logout = () => {
        setUser(null);
        dispatch(setReduxUser(null));
        localStorage.removeItem(storageKey);
        // Call API to invalidate session and clear cookie
        fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
            window.location.href = "/auth/login";
        });
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
