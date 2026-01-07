"use client"

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/lib/store/store';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/lib/auth-context';
import { DemoProvider } from '@/lib/demo-context';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <DemoProvider>
                        <AuthProvider>
                            {children}
                            <ReactQueryDevtools initialIsOpen={false} />
                        </AuthProvider>
                    </DemoProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </ReduxProvider>
    );
}
