import { users, attendanceRecords, today, leaveRequests, notifications } from "@/lib/mock-data";
import type { User, AttendanceRecord, LeaveRequest, Notification } from "@/lib/types";

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
