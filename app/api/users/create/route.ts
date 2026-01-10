import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/utils/api-response";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRole } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-me";

// Helper to extract user from token
function getUserFromToken(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded;
    } catch {
        return null;
    }
}

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
        const currentUser = getUserFromToken(req);

        if (!currentUser) {
            return ApiResponse.error("Unauthorized", 401);
        }

        // Only CEO and HR can add employees
        if (currentUser.role !== 'ceo' && currentUser.role !== 'hr') {
            return ApiResponse.error("You don't have permission to add employees", 403);
        }

        const body = await req.json();
        const { firstName, lastName, email, password, role, department, position } = body;

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
                companyId: currentUser.companyId
            },
            include: {
                company: true
            }
        });

        // Sanitize user (remove password)
        const { password: _, ...sanitizedUser } = newUser;

        return ApiResponse.success(
            sanitizedUser,
            "Employee added successfully",
            201
        );

    } catch (error: any) {
        console.error("[Create User Error]:", error);
        return ApiResponse.internalError("Failed to create employee", error);
    }
}
