"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from './types';
import { users } from './mock-data';
import { useDemo } from './demo-context';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isDemoMode } = useDemo();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const storageKey = isDemoMode ? 'presence_user_demo' : 'presence_user_prod';

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem(storageKey);
        if (savedUser) {
            try {
                // In a real app, you might validate the token here
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem(storageKey);
                setUser(null); // Ensure user is null if parsing fails
            }
        } else {
            setUser(null); // Ensure user is null if no session for this mode & strict reload
        }
        setIsLoading(false);
    }, [isDemoMode, storageKey]);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);

        try {
            if (isDemoMode) {
                // --- DEMO MODE LOGIC ---
                // Simulate API latency
                await new Promise(resolve => setTimeout(resolve, 800));

                // Find user by email (mock authentication)
                // In demo mode, we can accept any password for simplicity, or hardcode it
                const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (foundUser) {
                    setUser(foundUser);
                    localStorage.setItem(storageKey, JSON.stringify(foundUser));
                    return { success: true };
                }
                return { success: false, error: 'Invalid email. Try ceo@presence.io' };
            } else {
                // --- PRODUCTION MODE LOGIC ---
                // Call real API
                // const res = await fetch('/api/auth/login', {
                //     method: 'POST',
                //     body: JSON.stringify({ email, password }),
                //     headers: { 'Content-Type': 'application/json' }
                // });
                // const data = await res.json();

                // Placeholder until API is ready
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { success: false, error: 'Production database not connected yet.' };
            }
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(storageKey);
        // Optional: Call logout API if in production
    };

    // For demo purposes: switch between roles
    const switchRole = (role: UserRole) => {
        if (!isDemoMode) return; // Only allow role switching in demo mode

        const userWithRole = users.find(u => u.role === role);
        if (userWithRole) {
            setUser(userWithRole);
            localStorage.setItem(storageKey, JSON.stringify(userWithRole));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
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
