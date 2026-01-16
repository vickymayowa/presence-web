import { prisma } from "@/lib/prisma";

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

        // For each department, calculate employee counts and attendance rate
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const enrichedDepartments = await Promise.all(departments.map(async (dept) => {
            const [totalEmployees, presentToday, onsite, hybrid, remote] = await Promise.all([
                prisma.user.count({ where: { department: dept.name, companyId } }),
                prisma.attendanceRecord.count({
                    where: {
                        user: { department: dept.name, companyId },
                        date: today,
                        status: { in: ['present', 'late'] }
                    }
                }),
                prisma.attendanceRecord.count({
                    where: {
                        user: { department: dept.name, companyId },
                        date: today,
                        workMode: 'office'
                    }
                }),
                prisma.attendanceRecord.count({
                    where: {
                        user: { department: dept.name, companyId },
                        date: today,
                        workMode: 'hybrid'
                    }
                }),
                prisma.attendanceRecord.count({
                    where: {
                        user: { department: dept.name, companyId },
                        date: today,
                        workMode: 'remote'
                    }
                })
            ]);

            const rate = totalEmployees > 0
                ? Math.round((presentToday / totalEmployees) * 100)
                : 0;

            return {
                ...dept,
                employees: totalEmployees,
                presentToday,
                onsite,
                hybrid,
                remote,
                rate: `${rate}%`
            };
        }));

        return enrichedDepartments;
    }

    async createDepartment(data: { name: string; managerId: string; description?: string; companyId: string }) {
        return prisma.department.create({
            data: {
                name: data.name,
                managerId: data.managerId,
                description: data.description,
                companyId: data.companyId,
                headCount: 0 // Will be updated as users are assigned
            }
        });
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
