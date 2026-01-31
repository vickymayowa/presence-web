import { prisma } from "@/lib/prisma";

export class CompanyService {
    /**
     * Get aggregate statistics for a company.
     * This is used by CEOs and HR to get an overview of the workforce.
     */
    async getCompanyStats(companyId: string) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // 1. Fetch main stats in parallel
        const [totalEmployees, presentToday, onLeave, pendingRequests, departmentCount, remote, lateArrivals] = await Promise.all([
            prisma.user.count({ where: { companyId } }),
            prisma.attendanceRecord.count({
                where: {
                    user: { companyId },
                    date: { gte: todayStart, lte: todayEnd },
                    status: { in: ['present', 'late', 'half_day'] }
                }
            }),
            prisma.attendanceRecord.count({
                where: {
                    user: { companyId },
                    date: { gte: todayStart, lte: todayEnd },
                    status: 'leave'
                }
            }),
            prisma.leaveRequest.count({
                where: { user: { companyId }, status: 'pending' }
            }),
            prisma.department.count({ where: { companyId } }),
            prisma.attendanceRecord.count({
                where: {
                    user: { companyId },
                    date: { gte: todayStart, lte: todayEnd },
                    workMode: 'remote'
                }
            }),
            prisma.attendanceRecord.findMany({
                where: {
                    user: { companyId },
                    date: { gte: todayStart, lte: todayEnd },
                    status: 'late'
                },
                include: {
                    user: {
                        select: { firstName: true, lastName: true, avatar: true, department: true }
                    }
                }
            })
        ]);

        // 2. Trend Data (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const trendRecords = await prisma.attendanceRecord.findMany({
            where: {
                user: { companyId },
                date: { gte: sevenDaysAgo },
                status: { in: ['present', 'late', 'half_day'] }
            },
            select: { date: true }
        });

        const trendMap = new Map<string, number>();
        // Initialize last 7 days with 0
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            trendMap.set(d.toLocaleDateString('en-US', { weekday: 'short' }), 0);
        }

        trendRecords.forEach(r => {
            const dayName = r.date.toLocaleDateString('en-US', { weekday: 'short' });
            if (trendMap.has(dayName)) {
                trendMap.set(dayName, trendMap.get(dayName)! + 1);
            }
        });

        const trendData = Array.from(trendMap.entries()).map(([name, attendance]) => ({ name, attendance }));


        // 3. Department Stats
        // Get employee count per department
        const deptUserCounts = await prisma.user.groupBy({
            by: ['department'],
            where: { companyId },
            _count: { _all: true }
        });

        // Get attendance count per department (today)
        const deptAttendanceCounts = await prisma.attendanceRecord.findMany({
            where: {
                user: { companyId },
                date: { gte: todayStart, lte: todayEnd },
                status: { in: ['present', 'late', 'half_day'] }
            },
            include: { user: { select: { department: true } } }
        });

        const deptAttendanceMap = new Map<string, number>();
        departmentStats: deptAttendanceCounts.forEach(r => {
            const d = r.user.department;
            if (d) deptAttendanceMap.set(d, (deptAttendanceMap.get(d) || 0) + 1);
        });

        // Get all department names to ensure we include empty ones
        const allDepts = await prisma.department.findMany({
            where: { companyId },
            select: { name: true }
        });

        const departmentStats = allDepts.map(dept => {
            const total = deptUserCounts.find(c => c.department === dept.name)?._count._all || 0;
            const present = deptAttendanceMap.get(dept.name) || 0;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;
            return {
                name: dept.name,
                attendanceRate: rate
            };
        });

        // 4. Calculate final derived stats
        const attendanceRate = totalEmployees > 0
            ? Math.round((presentToday / totalEmployees) * 100)
            : 0;

        // Performance Index
        const basePerformance = attendanceRate;
        const penalty = Math.min(pendingRequests * 0.5, 10);
        const performanceIndex = Math.max(Math.min(basePerformance + (100 - attendanceRate) * 0.8 - penalty, 100), 0);

        return {
            totalEmployees,
            activeEmployees: presentToday,
            onLeave,
            remote,
            pendingRequests,
            departments: departmentCount,
            attendanceRate,
            performanceIndex: parseFloat(performanceIndex.toFixed(1)),
            trendData,
            departmentStats,
            lateArrivals
        };
    }
}

export const companyService = new CompanyService();
