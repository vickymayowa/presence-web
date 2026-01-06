import { useState, useEffect } from 'react';
import { useDemo } from './demo-context';
import * as mockData from './mock-data';
import type { User, AttendanceRecord, LeaveRequest, CompanyStats, Notification } from './types';

// Generic hook to handle data fetching branching
function useData<T>(mockValue: T, apiEndpoint?: string): { data: T | undefined; isLoading: boolean; error: any } {
    const { isDemoMode } = useDemo();
    const [data, setData] = useState<T | undefined>(isDemoMode ? mockValue : undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (isDemoMode) {
            setData(mockValue);
            setIsLoading(false);
        } else {
            // Production mode: fetch from API
            setIsLoading(true);

            // Simulation of API call failure or empty state for now
            const fetchData = async () => {
                try {
                    // if (apiEndpoint) ... fetch(apiEndpoint)
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // For now, return empty/undefined to show "No Data" or error
                    // setData(undefined); 
                } catch (err) {
                    setError(err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [isDemoMode]); // Re-run when mode changes (though we reload page, so this is safe)

    return { data, isLoading, error };
}

export function useUsers() {
    return useData<User[]>(mockData.users, '/api/users');
}

export function useUser(id: string) {
    const { isDemoMode } = useDemo();
    // Simplified for now
    if (isDemoMode) return mockData.getUserById(id);
    return undefined;
}

export function useCompanyStats() {
    return useData<CompanyStats>(mockData.companyStats, '/api/stats');
}

export function useAttendanceRecords() {
    return useData<AttendanceRecord[]>(mockData.attendanceRecords, '/api/attendance');
}

export function useLeaveRequests() {
    return useData<LeaveRequest[]>(mockData.leaveRequests, '/api/leaves');
}

export function useNotifications(userId: string) {
    const { isDemoMode } = useDemo();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (isDemoMode) {
            setNotifications(mockData.getNotificationsForUser(userId));
        } else {
            // Fetch real notifications
            setNotifications([]);
        }
    }, [isDemoMode, userId]);

    return notifications;
}

// Helpers that might need to be async in production, but synchronous for now in components
// We might need to refactor components to handle async data if we want true "Production" readiness.
// For now, we'll keep the synchronous signature where possible or return defaults.

export function useUsersByManager(managerId: string) {
    const { isDemoMode } = useDemo();
    if (isDemoMode) return mockData.getUsersByManager(managerId);
    return [];
}
