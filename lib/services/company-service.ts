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

        // Fetch trend data for the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            return d;
        });

        const trendData = await Promise.all(last7Days.map(async (date) => {
            const count = await prisma.attendanceRecord.count({
                where: {
                    user: { companyId },
                    date: date,
                    status: { in: ['present', 'late'] }
                }
            });
            return {
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                attendance: count
            };
        }));

        return {
            totalEmployees,
            activeEmployees: presentToday,
            onLeave,
            remote,
            pendingRequests,
            departments,
            attendanceRate,
            performanceIndex: 94.2,
            trendData
        };
    }
}

export const companyService = new CompanyService();
