"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from './types';
import { users } from './mock-data';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('presence_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('presence_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find user by email (mock authentication)
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('presence_user', JSON.stringify(foundUser));
            return { success: true };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('presence_user');
    };

    // For demo purposes: switch between roles
    const switchRole = (role: UserRole) => {
        const userWithRole = users.find(u => u.role === role);
        if (userWithRole) {
            setUser(userWithRole);
            localStorage.setItem('presence_user', JSON.stringify(userWithRole));
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
