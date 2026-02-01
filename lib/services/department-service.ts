import { prisma } from "@/lib/prisma";
import { activityService } from "./activity-service";

export class DepartmentService {
    async getDepartments(companyId: string) {
        const departments = await prisma.department.findMany({
            where: { companyId },
            include: {
                manager: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });

        // 1. Get employee counts per department for this company
        // We need to group by department name
        const employeeCounts = await prisma.user.groupBy({
            by: ['department'],
            where: { companyId },
            _count: {
                _all: true
            }
        });

        // Create a map for quick lookup: departmentName -> count
        const employeeCountMap = new Map<string, number>();
        employeeCounts.forEach(item => {
            if (item.department) {
                employeeCountMap.set(item.department, item._count._all);
            }
        });

        // 2. Get today's attendance for this company to calculate stats
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const attendanceRecords = await prisma.attendanceRecord.findMany({
            where: {
                user: { companyId },
                date: {
                    gte: todayStart,
                    lte: todayEnd
                }
            },
            include: {
                user: {
                    select: { department: true }
                }
            }
        });

        // 3. Aggregate attendance stats by department in memory
        const deptStats = new Map<string, { present: number, onsite: number, hybrid: number, remote: number }>();

        attendanceRecords.forEach(record => {
            const deptName = record.user.department;
            if (!deptName) return;

            if (!deptStats.has(deptName)) {
                deptStats.set(deptName, { present: 0, onsite: 0, hybrid: 0, remote: 0 });
            }

            const stats = deptStats.get(deptName)!;

            // Count logic based on status and work mode
            if (['present', 'late', 'half_day'].includes(record.status)) {
                stats.present++;
            }

            if (record.workMode === 'office') stats.onsite++;
            else if (record.workMode === 'hybrid') stats.hybrid++;
            else if (record.workMode === 'remote') stats.remote++;
        });

        // 4. Merge data
        const enrichedDepartments = departments.map((dept) => {
            const totalEmployees = employeeCountMap.get(dept.name) || 0;
            const stats = deptStats.get(dept.name) || { present: 0, onsite: 0, hybrid: 0, remote: 0 };

            const rateVal = totalEmployees > 0
                ? Math.round((stats.present / totalEmployees) * 100)
                : 0;

            return {
                ...dept,
                employees: totalEmployees, // Actual employee count from User table
                presentToday: stats.present,
                onsite: stats.onsite,
                hybrid: stats.hybrid,
                remote: stats.remote,
                rate: `${rateVal}%`
            };
        });

        return enrichedDepartments;
    }

    async createDepartment(data: { name: string; managerId: string; description?: string; companyId: string; createdById?: string }) {
        const department = await prisma.department.create({
            data: {
                name: data.name,
                managerId: data.managerId,
                description: data.description,
                companyId: data.companyId,
                headCount: 0
            }
        });

        // Log activity
        if (data.createdById) {
            await activityService.logActivity({
                userId: data.createdById,
                companyId: data.companyId,
                action: "CREATE_DEPARTMENT",
                description: `Created new department: ${data.name}`,
                metadata: { departmentId: department.id, managerId: data.managerId }
            });
        }

        return department;
    }

    async updateDepartment(id: string, data: { name?: string; managerId?: string; description?: string }) {
        return prisma.department.update({
            where: { id },
            data
        });
    }

    async deleteDepartment(id: string) {
        return prisma.department.delete({
            where: { id }
        });
    }
}

export const departmentService = new DepartmentService();
