// Mock Data for Presence Attendance System
import type { User, AttendanceRecord, LeaveRequest, Department, Notification, CompanyStats, Company } from './types';

// Companies
export const companies: Company[] = [
    {
        id: 'comp-001',
        name: 'Presence Inc.',
        slug: 'presence',
        logo: '/logo.svg' // Placeholder
    },
    {
        id: 'comp-002',
        name: 'Acme Corp',
        slug: 'acme',
        logo: ''
    }
];

// Users data
export const users: User[] = [
    {
        id: 'ceo-001',
        email: 'ceo@presence.io',
        firstName: 'Victoria',
        lastName: 'Sterling',
        role: 'ceo',
        department: 'Executive',
        position: 'Chief Executive Officer',
        avatar: '',
        joinedAt: '2020-01-15',
        phone: '+1 555-0100',
        companyId: 'comp-001',
    },
    {
        id: 'hr-001',
        email: 'hr@presence.io',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        role: 'hr',
        department: 'Human Resources',
        position: 'HR Director',
        avatar: '',
        managerId: 'ceo-001',
        joinedAt: '2021-03-20',
        phone: '+1 555-0101',
        companyId: 'comp-001',
    },
    {
        id: 'mgr-001',
        email: 'manager@presence.io',
        firstName: 'James',
        lastName: 'Wilson',
        role: 'manager',
        department: 'Engineering',
        position: 'Engineering Manager',
        avatar: '',
        managerId: 'ceo-001',
        joinedAt: '2021-06-10',
        phone: '+1 555-0102',
        companyId: 'comp-001',
    },
    {
        id: 'mgr-002',
        email: 'sarah.manager@presence.io',
        firstName: 'Sarah',
        lastName: 'Chen',
        role: 'manager',
        department: 'Marketing',
        position: 'Marketing Manager',
        avatar: '',
        managerId: 'ceo-001',
        joinedAt: '2021-09-15',
        phone: '+1 555-0103',
        companyId: 'comp-001',
    },
    {
        id: 'staff-001',
        email: 'john@presence.io',
        firstName: 'John',
        lastName: 'Doe',
        role: 'staff',
        department: 'Engineering',
        position: 'Senior Developer',
        avatar: '',
        managerId: 'mgr-001',
        joinedAt: '2022-01-10',
        phone: '+1 555-0104',
        companyId: 'comp-001',
    },
    {
        id: 'staff-002',
        email: 'emma@presence.io',
        firstName: 'Emma',
        lastName: 'Thompson',
        role: 'staff',
        department: 'Engineering',
        position: 'Full Stack Developer',
        avatar: '',
        managerId: 'mgr-001',
        joinedAt: '2022-03-15',
        phone: '+1 555-0105',
        companyId: 'comp-001',
    },
    {
        id: 'staff-003',
        email: 'alex@presence.io',
        firstName: 'Alex',
        lastName: 'Johnson',
        role: 'staff',
        department: 'Marketing',
        position: 'Marketing Specialist',
        avatar: '',
        managerId: 'mgr-002',
        joinedAt: '2022-05-20',
        phone: '+1 555-0106',
        companyId: 'comp-001',
    },
    {
        id: 'staff-004',
        email: 'lisa@presence.io',
        firstName: 'Lisa',
        lastName: 'Park',
        role: 'staff',
        department: 'Engineering',
        position: 'UI/UX Designer',
        avatar: '',
        managerId: 'mgr-001',
        joinedAt: '2022-07-01',
        phone: '+1 555-0107',
        companyId: 'comp-001',
    },
    {
        id: 'staff-005',
        email: 'michael@presence.io',
        firstName: 'Michael',
        lastName: 'Brown',
        role: 'staff',
        department: 'Marketing',
        position: 'Content Strategist',
        avatar: '',
        managerId: 'mgr-002',
        joinedAt: '2022-09-10',
        phone: '+1 555-0108',
        companyId: 'comp-001',
    },
    {
        id: 'acme-admin',
        email: 'admin@acme.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ceo',
        department: 'Executive',
        position: 'CEO',
        avatar: '',
        joinedAt: '2023-01-01',
        phone: '+1 555-9999',
        companyId: 'comp-002',
    }
];

// Helper to get today's date
export const today = new Date().toISOString().split('T')[0];

// Attendance Records
export const attendanceRecords: AttendanceRecord[] = [
    {
        id: 'att-001',
        userId: 'staff-001',
        date: today,
        checkIn: '09:05',
        checkOut: undefined,
        status: 'present',
        workMode: 'hybrid',
        verificationMethod: 'face-id',
        totalHours: 0,
    },
    {
        id: 'att-002',
        userId: 'staff-002',
        date: today,
        checkIn: '08:55',
        checkOut: undefined,
        status: 'present',
        workMode: 'office',
        verificationMethod: 'nfc',
        totalHours: 0,
    },
    {
        id: 'att-003',
        userId: 'staff-003',
        date: today,
        checkIn: '09:30',
        checkOut: undefined,
        status: 'late',
        workMode: 'remote',
        verificationMethod: 'face-id',
        notes: 'Traffic delay',
        totalHours: 0,
    },
    {
        id: 'att-004',
        userId: 'staff-004',
        date: today,
        status: 'leave',
        workMode: 'office',
        totalHours: 0,
    },
    {
        id: 'att-005',
        userId: 'mgr-001',
        date: today,
        checkIn: '08:45',
        checkOut: undefined,
        status: 'present',
        workMode: 'office',
        verificationMethod: 'face-id',
        totalHours: 0,
    },
    {
        id: 'att-006',
        userId: 'mgr-002',
        date: today,
        checkIn: '09:00',
        checkOut: undefined,
        status: 'present',
        workMode: 'hybrid',
        verificationMethod: 'nfc',
        totalHours: 0,
    },
    {
        id: 'att-007',
        userId: 'hr-001',
        date: today,
        checkIn: '08:30',
        checkOut: undefined,
        status: 'present',
        workMode: 'office',
        verificationMethod: 'face-id',
        totalHours: 0,
    },
    {
        id: 'att-008',
        userId: 'ceo-001',
        date: today,
        checkIn: '08:00',
        checkOut: undefined,
        status: 'present',
        workMode: 'office',
        verificationMethod: 'face-id',
        totalHours: 0,
    },
    {
        id: 'att-008',
        userId: 'ceo-001',
        date: today,
        checkIn: '08:00',
        checkOut: undefined,
        status: 'present',
        workMode: 'office',
        verificationMethod: 'face-id',
        totalHours: 0,
    },
    {
        id: 'att-008',
        userId: 'ceo-001',
        date: today,
        checkIn: '08:00',
        checkOut: undefined,
        status: 'present',
        workMode: 'office',
        verificationMethod: 'face-id',
        totalHours: 0,
    },
    {
        id: 'att-008',
        userId: 'ceo-001',
        date: today,
        checkIn: '08:00',
        checkOut: undefined,
        status: 'present',
        workMode: 'office',
        verificationMethod: 'face-id',
        totalHours: 0,
    },
];

// Leave Requests
export const leaveRequests: LeaveRequest[] = [
    {
        id: 'leave-001',
        userId: 'staff-004',
        type: 'annual',
        startDate: today,
        endDate: today,
        reason: 'Personal day for family event',
        status: 'approved',
        approvedBy: 'mgr-001',
        approvedAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'leave-002',
        userId: 'staff-001',
        type: 'work-from-home',
        startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        reason: 'Home maintenance scheduled',
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'leave-003',
        userId: 'staff-002',
        type: 'sick',
        startDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        reason: 'Medical procedure',
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'leave-004',
        userId: 'staff-005',
        type: 'annual',
        startDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
        reason: 'Family vacation',
        status: 'pending',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
    },
];

// Departments
export const departments: Department[] = [
    {
        id: 'dept-001',
        name: 'Executive',
        managerId: 'ceo-001',
        description: 'Company leadership and strategy',
        headCount: 1,
    },
    {
        id: 'dept-002',
        name: 'Human Resources',
        managerId: 'hr-001',
        description: 'Employee management and culture',
        headCount: 2,
    },
    {
        id: 'dept-003',
        name: 'Engineering',
        managerId: 'mgr-001',
        description: 'Product development and technology',
        headCount: 4,
    },
    {
        id: 'dept-004',
        name: 'Marketing',
        managerId: 'mgr-002',
        description: 'Brand strategy and growth',
        headCount: 3,
    },
];

// Notifications
export const notifications: Notification[] = [
    {
        id: 'notif-001',
        userId: 'mgr-001',
        title: 'New Leave Request',
        message: 'John Doe has requested work from home for tomorrow',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/dashboard/requests',
    },
    {
        id: 'notif-002',
        userId: 'mgr-001',
        title: 'Attendance Alert',
        message: 'Alex Johnson checked in 30 minutes late today',
        type: 'warning',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'notif-003',
        userId: 'hr-001',
        title: 'Multiple Leave Requests',
        message: '3 leave requests pending approval',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/dashboard/hr/leaves',
    },
];

// Company Stats
export const companyStats: CompanyStats = {
    totalEmployees: users.length,
    presentToday: attendanceRecords.filter(r => r.date === today && r.status === 'present').length,
    onLeave: attendanceRecords.filter(r => r.date === today && r.status === 'leave').length,
    remote: attendanceRecords.filter(r => r.date === today && r.workMode === 'remote').length,
    averageAttendance: 94.5,
    pendingRequests: leaveRequests.filter(r => r.status === 'pending').length,
};

// Helper functions
export function getUserById(id: string): User | undefined {
    return users.find(u => u.id === id);
}

export function getUsersByRole(role: string): User[] {
    return users.filter(u => u.role === role);
}

export function getUsersByDepartment(department: string): User[] {
    return users.filter(u => u.department === department);
}

export function getUsersByManager(managerId: string): User[] {
    return users.filter(u => u.managerId === managerId);
}

export function getTodayAttendance(userId: string): AttendanceRecord | undefined {
    return attendanceRecords.find(r => r.userId === userId && r.date === today);
}

export function getPendingLeaveRequests(): LeaveRequest[] {
    return leaveRequests.filter(r => r.status === 'pending');
}

export function getNotificationsForUser(userId: string): Notification[] {
    return notifications.filter(n => n.userId === userId);
}
