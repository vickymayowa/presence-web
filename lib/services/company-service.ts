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

        // Dynamic performance index calculation (example logic)
        // Base score is attendance rate, with minor penalties for pending requests
        const basePerformance = attendanceRate;
        const penalty = Math.min(pendingRequests * 0.5, 10); // Max 10% penalty for pending work
        const performanceIndex = Math.max(Math.min(basePerformance + (100 - attendanceRate) * 0.8 - penalty, 100), 0);

        // Fetch department-wise attendance rates
        const allDepts = await prisma.department.findMany({
            where: { companyId }
        });

        const departmentStats = await Promise.all(allDepts.map(async (dept) => {
            const [deptUserCount, presentInDept] = await Promise.all([
                prisma.user.count({ where: { department: dept.name, companyId } }),
                prisma.attendanceRecord.count({
                    where: {
                        user: { department: dept.name, companyId },
                        date: today,
                        status: { in: ['present', 'late'] }
                    }
                })
            ]);

            const rate = deptUserCount > 0
                ? Math.round((presentInDept / deptUserCount) * 100)
                : 0;

            return {
                name: dept.name,
                attendanceRate: rate
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
            performanceIndex: parseFloat(performanceIndex.toFixed(1)),
            trendData,
            departmentStats
        };
    }
}

export const companyService = new CompanyService();
