"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface DemoContextType {
    isDemoMode: boolean;
    toggleDemoMode: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
    // Default to true for now, can be changed to false or based on env var
    const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

    useEffect(() => {
        // Check for saved preference
        const savedMode = localStorage.getItem('presence_demo_mode');
        if (savedMode !== null) {
            setIsDemoMode(savedMode === 'true');
        } else {
            // Optional: Check env var if available
            // setIsDemoMode(process.env.NEXT_PUBLIC_DEFAULT_DEMO === 'true');
        }
    }, []);

    const toggleDemoMode = () => {
        setIsDemoMode(prev => {
            const newMode = !prev;
            localStorage.setItem('presence_demo_mode', String(newMode));

            // Reload window to ensure clean state transition
            // This is safer than hot-swapping data sources which might lead to caching issues
            window.location.reload();
            return newMode;
        });
    };

    return (
        <DemoContext.Provider value={{ isDemoMode, toggleDemoMode }}>
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
}
