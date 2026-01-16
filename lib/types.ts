// Core Types for Presence Attendance System

export type UserRole = 'ceo' | 'hr' | 'manager' | 'staff';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  position: string;
  avatar?: string;
  managerId?: string;
  joinedAt: string;
  phone?: string;
  companyId: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave' | 'holiday';
  workMode: 'office' | 'remote' | 'hybrid';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  verificationMethod?: 'face-id' | 'nfc' | 'manual' | 'beacon';
  notes?: string;
  totalHours?: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid' | 'work-from-home';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  description?: string;
  headCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface WorkSchedule {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  workMode: 'office' | 'remote' | 'hybrid';
  isFlexible: boolean;
}

export interface OvertimeRequest {
  id: string;
  userId: string;
  date: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export interface CompanyStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  remote: number;
  attendanceRate: number;
  departments: number;
  performanceIndex: number;
  pendingRequests: number;
  trendData?: { name: string; attendance: number }[];
  departmentStats?: { name: string; attendanceRate: number }[];
  lateArrivals?: any[];
}

export interface TeamMember extends User {
  todayStatus?: AttendanceRecord;
  monthlyAttendance?: number;
}
