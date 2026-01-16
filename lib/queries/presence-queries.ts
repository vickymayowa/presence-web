import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, AttendanceRecord, LeaveRequest, CompanyStats, Notification } from '../types';

// API Base URL - could be from env
const API_BASE = '/api';

// Query Keys
export const queryKeys = {
    users: ['users'] as const,
    user: (id: string) => ['user', id] as const,
    stats: ['stats'] as const,
    departments: ['departments'] as const,
    attendance: ['attendance'] as const,
    leaves: ['leaves'] as const,
    notifications: (userId: string) => ['notifications', userId] as const,
    company: (slug: string) => ['company', slug] as const,
};

// --- QUERIES ---

const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
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
        refetchInterval: 10000, // Real-time updates every 10 seconds
    });
}

export function useDepartmentsQuery() {
    return useQuery({
        queryKey: queryKeys.departments,
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/departments`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch departments');
            const result = await res.json();
            return result.data as any[]; // You can define a stronger type if needed
        },
        refetchInterval: 10000, // Real-time
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

export function useCreateEmployeeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (employee: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            role: string;
            department: string;
            position?: string;
        }) => {
            const res = await fetch(`${API_BASE}/users/create`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(employee),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create employee');
            }
            return res.json();
        },
        onSuccess: () => {
            // Invalidate and refetch users after creating a new employee
            queryClient.invalidateQueries({ queryKey: queryKeys.users });
        },
    });
}

export function useCreateDepartmentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (department: { name: string; managerId: string; description?: string }) => {
            const res = await fetch(`${API_BASE}/departments`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(department),
            });
            if (!res.ok) throw new Error('Failed to create department');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments });
        },
    });
}

export function useUpdateDepartmentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`${API_BASE}/departments/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update department');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments });
        },
    });
}
