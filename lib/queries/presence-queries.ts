import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, AttendanceRecord, LeaveRequest, CompanyStats, Notification } from '../types';

// API Base URL - could be from env
const API_BASE = '/api';

// Query Keys
export const queryKeys = {
    users: ['users'] as const,
    user: (id: string) => ['user', id] as const,
    stats: ['stats'] as const,
    attendance: ['attendance'] as const,
    leaves: ['leaves'] as const,
    notifications: (userId: string) => ['notifications', userId] as const,
    company: (slug: string) => ['company', slug] as const,
};

// --- QUERIES ---

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('presence_auth_token') : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export function useUsersQuery() {
    return useQuery({
        queryKey: queryKeys.users,
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch users');
            const result = await res.json();
            return result.data as User[];
        },
    });
}

export function useCompanyStatsQuery() {
    return useQuery({
        queryKey: queryKeys.stats,
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/stats`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch stats');
            const result = await res.json();
            return result.data as CompanyStats;
        },
    });
}

export function useAttendanceQuery() {
    return useQuery({
        queryKey: queryKeys.attendance,
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/attendance`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch attendance');
            const result = await res.json();
            return result.data as AttendanceRecord[];
        },
    });
}

export function useLeavesQuery() {
    return useQuery({
        queryKey: queryKeys.leaves,
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/leaves`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch leaves');
            const result = await res.json();
            return result.data as LeaveRequest[];
        },
    });
}

export function useCompanyQuery(slug: string) {
    return useQuery({
        queryKey: queryKeys.company(slug),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/companies/${slug}`);
            if (!res.ok) throw new Error('Failed to fetch company');
            return res.json() as Promise<any>; // Assuming a Company type exists or generic
        },
        enabled: !!slug,
    });
}

// --- MUTATIONS ---

export function useCheckInMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (record: Partial<AttendanceRecord>) => {
            const res = await fetch(`${API_BASE}/attendance/check-in`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(record),
            });
            if (!res.ok) throw new Error('Failed to check in');
            return res.json();
        },
        onSuccess: () => {
            // Invalidate and refetch attendance after check-in
            queryClient.invalidateQueries({ queryKey: queryKeys.attendance });
        },
    });
}

export function useRequestLeaveMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (request: Partial<LeaveRequest>) => {
            const res = await fetch(`${API_BASE}/leaves/request`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(request),
            });
            if (!res.ok) throw new Error('Failed to request leave');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves });
        },
    });
}

export function useInviteUserMutation() {
    return useMutation({
        mutationFn: async (invite: { email: string; role: string; companySlug: string }) => {
            const res = await fetch(`${API_BASE}/auth/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invite),
            });
            if (!res.ok) throw new Error('Failed to send invitation');
            return res.json();
        },
    });
}
