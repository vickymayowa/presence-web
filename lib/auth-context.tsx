"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole } from './types';
import { users } from './mock-data';
import { useDemo } from './demo-context';
import { useAppDispatch } from './store/hooks';
import { setUser as setReduxUser, setLoading as setReduxLoading } from './store/slices/authSlice';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const { isDemoMode } = useDemo();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const storageKey = isDemoMode ? 'presence_user_demo' : 'presence_user_prod';

    useEffect(() => {
        // Check for saved session
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
        } else {
            setUser(null);
            dispatch(setReduxUser(null));
        }
        setIsLoading(false);
        dispatch(setReduxLoading(false));
    }, [isDemoMode, storageKey, dispatch]);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        dispatch(setReduxLoading(true));

        try {
            if (isDemoMode) {
                await new Promise(resolve => setTimeout(resolve, 800));
                const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (foundUser) {
                    setUser(foundUser);
                    dispatch(setReduxUser(foundUser));
                    localStorage.setItem(storageKey, JSON.stringify(foundUser));
                    return { success: true };
                }
                return { success: false, error: 'Invalid email. Try ceo@presence.io' };
            } else {
                // Placeholder until API is ready
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { success: false, error: 'Production database not connected yet.' };
            }
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            setIsLoading(false);
            dispatch(setReduxLoading(false));
        }
    };

    const logout = () => {
        setUser(null);
        dispatch(setReduxUser(null));
        localStorage.removeItem(storageKey);
    };

    const switchRole = (role: UserRole) => {
        if (!isDemoMode) return;
        const userWithRole = users.find(u => u.role === role);
        if (userWithRole) {
            setUser(userWithRole);
            dispatch(setReduxUser(userWithRole));
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
