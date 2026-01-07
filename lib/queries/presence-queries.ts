import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDemo } from '../demo-context';
import * as mockData from '../mock-data';
import type { User, AttendanceRecord, LeaveRequest, CompanyStats, Notification } from '../types';

// Query Keys
export const queryKeys = {
    users: ['users'] as const,
    user: (id: string) => ['user', id] as const,
    stats: ['stats'] as const,
    attendance: ['attendance'] as const,
    leaves: ['leaves'] as const,
    notifications: (userId: string) => ['notifications', userId] as const,
};

// Generic helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- QUERIES ---

export function useUsersQuery() {
    const { isDemoMode } = useDemo();

    return useQuery({
        queryKey: queryKeys.users,
        queryFn: async () => {
            await delay(800);
            if (isDemoMode) return mockData.users;
            // Real API: return fetch('/api/users').then(res => res.json());
            return [];
        },
    });
}

export function useCompanyStatsQuery() {
    const { isDemoMode } = useDemo();

    return useQuery({
        queryKey: queryKeys.stats,
        queryFn: async () => {
            await delay(600);
            if (isDemoMode) return mockData.companyStats;
            throw new Error('Production stats not implemented');
        },
    });
}

export function useAttendanceQuery() {
    const { isDemoMode } = useDemo();

    return useQuery({
        queryKey: queryKeys.attendance,
        queryFn: async () => {
            await delay(700);
            if (isDemoMode) return mockData.attendanceRecords;
            return [];
        },
    });
}

// --- MUTATIONS ---

export function useCheckInMutation() {
    const queryClient = useQueryClient();
    const { isDemoMode } = useDemo();

    return useMutation({
        mutationFn: async (record: Partial<AttendanceRecord>) => {
            await delay(1000);
            if (isDemoMode) {
                // Mock update logic
                console.log('Mock Check-in:', record);
                return { success: true, record };
            }
            // Real API call here
            return { success: true };
        },
        onSuccess: () => {
            // Invalidate and refetch attendance after check-in
            queryClient.invalidateQueries({ queryKey: queryKeys.attendance });
        },
    });
}

export function useRequestLeaveMutation() {
    const queryClient = useQueryClient();
    const { isDemoMode } = useDemo();

    return useMutation({
        mutationFn: async (request: Partial<LeaveRequest>) => {
            await delay(1200);
            if (isDemoMode) {
                console.log('Mock Leave Request:', request);
                return { success: true, request };
            }
            return { success: true };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves });
        },
    });
}
