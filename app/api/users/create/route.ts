import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/utils/api-response";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/utils/auth-utils";
import { UserRole } from "@/lib/types";
import { activityService } from "@/lib/services/activity-service";

const JWT_SECRET = process.env.JWT_SECRET!;

// Helper to get default position based on role
function getDefaultPosition(role: UserRole): string {
    switch (role) {
        case 'ceo': return 'Chief Executive Officer';
        case 'hr': return 'HR Administrator';
        case 'manager': return 'Team Lead';
        case 'staff': return 'Associate';
        default: return 'User';
    }
}

export async function POST(req: NextRequest) {
    try {
        const currentUser = getSession(req);

        if (!currentUser) {
            return ApiResponse.error("Unauthorized", 401);
        }

        // Only CEO and HR can add employees
        if (currentUser.role !== 'ceo' && currentUser.role !== 'hr') {
            return ApiResponse.error("You don't have permission to add employees", 403);
        }

        const body = await req.json();
        const { firstName, lastName, email, password, role, department, position, branchId } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !role || !department) {
            return ApiResponse.error("Missing required fields", 400);
        }

        // Check if email already exists
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            return ApiResponse.error("An employee with this email already exists", 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user in the same company
        const newUser = await prisma.user.create({
            data: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role,
                department: department.trim(),
                position: position?.trim() || getDefaultPosition(role),
                companyId: currentUser.companyId,
                branchId: branchId || null
            },
            include: {
                company: true,
                branch: true
            }
        });

        // Sanitize user (remove password)
        const { password: _, ...sanitizedUser } = newUser;

        // Log activity
        await activityService.logActivity({
            userId: currentUser.id,
            companyId: currentUser.companyId,
            action: "CREATE_USER",
            description: `Added new employee: ${firstName} ${lastName}`,
            metadata: {
                newUserId: newUser.id,
                role,
                department
            }
        });

        return ApiResponse.success(
            sanitizedUser,
            "Employee added successfully",
            201
        );

    } catch (error: any) {
        console.log(error)
        console.error("[Create User Error]:", error);
        return ApiResponse.internalError("Failed to create employee", error);
    }
}
