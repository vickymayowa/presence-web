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
    activities: (scope: string) => ['activities', scope] as const,
    schedule: (start?: string, end?: string) => ['schedule', start, end] as const,
    branches: ['branches'] as const,
    branch: (id: string) => ['branch', id] as const,
    announcements: ['announcements'] as const,
};

// --- QUERIES ---

const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
    };
};

export function useScheduleQuery(start?: Date, end?: Date) {
    const startStr = start?.toISOString();
    const endStr = end?.toISOString();

    return useQuery({
        queryKey: queryKeys.schedule(startStr, endStr),
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startStr) params.append('start', startStr);
            if (endStr) params.append('end', endStr);

            const res = await fetch(`${API_BASE}/schedule?${params.toString()}`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch schedule');
            const result = await res.json();
            return result.data as any[]; // Type this properly if possible
        },
    });
}


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

export function useActivitiesQuery(scope: 'company' | 'user' = 'company', limit: number = 10) {
    return useQuery({
        queryKey: queryKeys.activities(scope),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/activities?scope=${scope}&limit=${limit}`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch activities');
            const result = await res.json();
            return result.data as any[];
        },
        refetchInterval: 30000, // Refresh every 30 seconds
    });
}

export function useBranchesQuery() {
    return useQuery({
        queryKey: queryKeys.branches,
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/branches`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch branches');
            const result = await res.json();
            return result.data as any[];
        },
    });
}

export function useBranchQuery(id: string) {
    return useQuery({
        queryKey: queryKeys.branch(id),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/branches?id=${id}`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch branch details');
            const result = await res.json();
            return result.data;
        },
        enabled: !!id,
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
            branchId?: string;
        }) => {
            const res = await fetch(`${API_BASE}/users/create`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(employee),
            });
            console.log(res, "staff creation")
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
export function useUpdateLeaveMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
            const res = await fetch(`${API_BASE}/leaves/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error('Failed to update leave');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leaves });
        },
    });
}

export function useNotificationsQuery(userId: string) {
    return useQuery({
        queryKey: queryKeys.notifications(userId),
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/notifications`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const result = await res.json();
            return result.data as Notification[];
        },
        enabled: !!userId,
        refetchInterval: 30000, // Check for new notifications every 30 seconds
    });
}

export function useUpdateNotificationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars: { id: string; title?: string; message?: string; type?: string; read?: boolean; all?: boolean }) => {
            const res = await fetch(`${API_BASE}/notifications`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(vars),
            });
            if (!res.ok) throw new Error('Failed to update notification');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useDeleteNotificationMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars: { id?: string; all?: boolean }) => {
            const url = new URL(`${window.location.origin}${API_BASE}/notifications`);
            if (vars.id) url.searchParams.append('id', vars.id);
            if (vars.all) url.searchParams.append('all', 'true');

            const res = await fetch(url.toString(), {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error('Failed to delete notification');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

export function useBroadcastNotificationMutation() {
    return useMutation({
        mutationFn: async (broadcast: { title: string; message: string; type: string; role?: string; actionUrl?: string }) => {
            const res = await fetch(`${API_BASE}/notifications/broadcast`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(broadcast),
            });
            if (!res.ok) throw new Error('Failed to broadcast notification');
            return res.json();
        },
    });
}

export function useCreateEventMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (event: any) => {
            const res = await fetch(`${API_BASE}/schedule`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(event),
            });
            if (!res.ok) throw new Error('Failed to create event');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedule'] });
        },
    });
}

export function useCreateBranchMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (branch: { name: string; location?: string; address?: string }) => {
            const res = await fetch(`${API_BASE}/branches`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(branch),
            });
            if (!res.ok) throw new Error('Failed to create branch');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.branches });
        },
    });
}

export function useUpdateBranchMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars: { branchId: string; name?: string; location?: string; address?: string }) => {
            const res = await fetch(`${API_BASE}/branches`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(vars),
            });
            if (!res.ok) throw new Error('Failed to update branch');
            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.branches });
            queryClient.invalidateQueries({ queryKey: queryKeys.branch(variables.branchId) });
        },
    });
}

export function useDeleteBranchMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_BASE}/branches?id=${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error('Failed to delete branch');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.branches });
        },
    });
}

export function useAssignBranchMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vars: { userId: string; branchId: string | null }) => {
            const res = await fetch(`${API_BASE}/branches`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(vars),
            });
            if (!res.ok) throw new Error('Failed to assign branch');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users });
            queryClient.invalidateQueries({ queryKey: queryKeys.branches });
        },
    });
}

export function useAnnouncementsQuery() {
    return useQuery({
        queryKey: queryKeys.announcements,
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/announcements`, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch announcements');
            const result = await res.json();
            return result.data as any[];
        },
    });
}

export function useCreateAnnouncementMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (announcement: { title: string; content: string; type?: string; expiresAt?: string }) => {
            const res = await fetch(`${API_BASE}/announcements`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(announcement),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to post announcement');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.announcements });
        },
    });
}
