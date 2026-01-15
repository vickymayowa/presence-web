import { prisma } from "@/lib/prisma";

export class CompanyService {
    /**
     * Get aggregate statistics for a company.
     * This is used by CEOs and HR to get an overview of the workforce.
     */
    async getCompanyStats(companyId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalEmployees, presentToday, onLeave, pendingRequests, departments] = await Promise.all([
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
            }),

            // Total departments
            prisma.department.count({
                where: { companyId }
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

        // Calculate attendance rate
        const attendanceRate = totalEmployees > 0
            ? Math.round((presentToday / totalEmployees) * 100)
            : 0;

        return {
            totalEmployees,
            activeEmployees: presentToday,
            onLeave,
            remote,
            pendingRequests,
            departments,
            attendanceRate,
            performanceIndex: 94.2, // Placeholder for trend logic
        };
    }
}

export const companyService = new CompanyService();
