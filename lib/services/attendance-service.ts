import { prisma } from "@/lib/prisma";

export class AttendanceService {
    /**
     * Get all attendance records for a company.
     */
    async getAttendanceRecords(companyId: string) {
        return prisma.attendanceRecord.findMany({
            where: {
                user: { companyId }
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        department: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });
    }

    /**
     * Record a check-in or check-out.
     */
    async logAttendance(userId: string, data: any) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { type, workMode, verificationMethod, notes, location } = data;

        if (type === 'in') {
            return prisma.attendanceRecord.upsert({
                where: {
                    userId_date: { userId, date: today }
                },
                update: {
                    checkIn: new Date(),
                    status: 'present',
                    workMode,
                    verificationMethod,
                    location
                },
                create: {
                    userId,
                    date: today,
                    checkIn: new Date(),
                    status: 'present',
                    workMode,
                    verificationMethod,
                    location
                }
            });
        } else {
            return prisma.attendanceRecord.update({
                where: {
                    userId_date: { userId, date: today }
                },
                data: {
                    checkOut: new Date(),
                    notes
                }
            });
        }
    }
}

export const attendanceService = new AttendanceService();
