import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
    companies,
    users,
    departments,
    attendanceRecords,
    leaveRequests,
    notifications
} from "@/lib/mock-data";

export class SeedService {
    /**
     * Seeds the database with mock data for various roles (CEO, HR, Manager, Staff).
     * This allows for immediate testing of role-based features.
     */
    async seed() {
        console.log("Starting database seed...");

        // 1. Seed Companies
        for (const company of companies) {
            await prisma.company.upsert({
                where: { slug: company.slug },
                update: { name: company.name, logo: company.logo },
                create: {
                    id: company.id,
                    name: company.name,
                    slug: company.slug,
                    logo: company.logo,
                },
            });
        }

        // 2. Seed Users
        // We do this in two passes: first create users, then update managers to avoid FK issues
        const password = await bcrypt.hash("password123", 12);

        for (const user of users) {
            await prisma.user.upsert({
                where: { email: user.email },
                update: {
                    role: user.role as any,
                    department: user.department,
                    position: user.position,
                },
                create: {
                    id: user.id,
                    email: user.email,
                    password: password,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role as any,
                    department: user.department,
                    position: user.position,
                    companyId: user.companyId,
                    joinedAt: new Date(user.joinedAt),
                },
            });
        }

        // Pass 2: Set Manager relations
        for (const user of users) {
            if (user.managerId) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { managerId: user.managerId },
                });
            }
        }

        // 3. Seed Departments
        for (const dept of departments) {
            await prisma.department.upsert({
                where: { id: dept.id },
                update: { headCount: dept.headCount },
                create: {
                    id: dept.id,
                    name: dept.name,
                    companyId: users.find(u => u.id === dept.managerId)?.companyId || companies[0].id,
                    managerId: dept.managerId,
                    description: dept.description,
                    headCount: dept.headCount,
                },
            });
        }

        // 4. Seed Attendance (Simplified for seeding)
        for (const record of attendanceRecords) {
            await prisma.attendanceRecord.upsert({
                where: {
                    userId_date: {
                        userId: record.userId,
                        date: new Date(record.date),
                    }
                },
                update: {},
                create: {
                    id: record.id,
                    userId: record.userId,
                    date: new Date(record.date),
                    status: record.status as any,
                    workMode: record.workMode as any,
                    verificationMethod: record.verificationMethod?.replace('-', '_') as any || 'manual',
                    notes: record.notes,
                    totalHours: record.totalHours || 0,
                },
            });
        }

        return { message: "Database seeded successfully with all roles" };
    }
}

export const seedService = new SeedService();
