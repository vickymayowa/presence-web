import { prisma } from "@/lib/prisma";

export class CompanyService {
    /**
     * Get aggregate statistics for a company.
     * This is used by CEOs and HR to get an overview of the workforce.
     */
    async getCompanyStats(companyId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalEmployees, presentToday, onLeave, pendingRequests] = await Promise.all([
            // Total employees in the company
            prisma.user.count({ where: { companyId } }),

            // Users who checked in today
            prisma.attendanceRecord.count({
                where: {
                    user: { companyId },
                    date: today,
                    status: { in: ['present', 'late'] }
                }
            }),

            // Users on leave today
            prisma.attendanceRecord.count({
                where: {
                    user: { companyId },
                    date: today,
                    status: 'leave'
                }
            }),

            // Pending leave requests for the company
            prisma.leaveRequest.count({
                where: {
                    user: { companyId },
                    status: 'pending'
                }
            })
        ]);

        // Calculate remote workers (checked in with remote mode)
        const remote = await prisma.attendanceRecord.count({
            where: {
                user: { companyId },
                date: today,
                workMode: 'remote'
            }
        });

        return {
            totalEmployees,
            presentToday,
            onLeave,
            remote,
            pendingRequests,
            averageAttendance: 94.5, // Placeholder for trend logic
        };
    }
}

export const companyService = new CompanyService();
