"use client"

import React, { useState } from 'react';
import { useDemo } from '@/lib/demo-context';
import { Database, Zap, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function DemoModeToggle() {
    const { isDemoMode, toggleDemoMode } = useDemo();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        toggleDemoMode();
        toast.success(
            `Switched to ${!isDemoMode ? 'Demo' : 'Production'} Mode`,
            { description: 'Reloading application state...' }
        );
    };

    if (!isExpanded) {
        return (
            <div className="fixed bottom-4 left-4 z-50">
                <Button
                    variant={isDemoMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                    className={cn(
                        "rounded-full shadow-lg transition-all duration-300",
                        isDemoMode ? "bg-amber-500 hover:bg-amber-600 border-amber-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                    )}
                >
                    {isDemoMode ? (
                        <>
                            <Database className="w-4 h-4 mr-2" />
                            Demo Mode
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4 mr-2" />
                            Prod Mode
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 animate-in fade-in slide-in-from-bottom-5 slide-in-from-left-5">
            <div className="bg-popover border border-border shadow-2xl rounded-xl p-4 w-80 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-foreground">Data Source</h3>
                        <p className="text-xs text-muted-foreground">Select your application state</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-3">
                    <div
                        className={cn(
                            "flex items-center p-3 rounded-lg border cursor-pointer transition-colors",
                            isDemoMode ? "border-amber-500/50 bg-amber-500/10" : "border-border hover:bg-muted/50"
                        )}
                        onClick={() => !isDemoMode && handleToggle()}
                    >
                        <div className={cn("p-2 rounded-full mr-3", isDemoMode ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground")}>
                            <Database className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-sm">Demo Data</p>
                                {isDemoMode && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Active</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Use local mock data for testing and previews.</p>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex items-center p-3 rounded-lg border cursor-pointer transition-colors",
                            !isDemoMode ? "border-green-500/50 bg-green-500/10" : "border-border hover:bg-muted/50"
                        )}
                        onClick={() => isDemoMode && handleToggle()}
                    >
                        <div className={cn("p-2 rounded-full mr-3", !isDemoMode ? "bg-green-500 text-white" : "bg-muted text-muted-foreground")}>
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-sm">Real Data</p>
                                {!isDemoMode && <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Active</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Connect to real production database and APIs.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="w-3 h-3" />
                    <span>Switching modes will reload the page.</span>
                </div>
            </div>
        </div>
    );
}
