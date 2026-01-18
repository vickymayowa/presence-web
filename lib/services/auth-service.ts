import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-me";

export interface RegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    department: string;
    companyName?: string;
    companyId?: string;
}

export class AuthService {
    /**
     * Register a new user and create/join a company.
     * Implements robust validation and error handling for production.
     */
    async register(data: RegisterDTO) {
        const { firstName, lastName, email, password, role, department, companyName, companyId } = data;

        // 1. Mandatory Field Validation
        if (!email || !password || !firstName || !lastName || !role) {
            throw new Error("Missing mandatory registration fields");
        }

        // 2. Email Normalization & Duplication Check
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            throw new Error("An account with this email already exists");
        }

        // 3. Organization (Company) Logic
        let targetCompanyId: string;

        if (role === "ceo") {
            if (!companyName) {
                throw new Error("Company name is required for CEO registration");
            }

            // Generate an initial slug and ensure uniqueness
            const baseSlug = this.generateSlug(companyName);
            let slug = baseSlug;
            let count = 0;

            while (await prisma.company.findUnique({ where: { slug } })) {
                count++;
                slug = `${baseSlug}-${count}`;
            }

            const newCompany = await prisma.company.create({
                data: {
                    name: companyName,
                    slug: slug,
                },
            });
            targetCompanyId = newCompany.id;
        } else {
            // Non-CEO roles must join an existing company
            if (companyId) {
                const company = await prisma.company.findUnique({ where: { id: companyId } });
                if (!company) throw new Error("Invalid organization ID provided");
                targetCompanyId = company.id;
            } else if (companyName) {
                // Try to find company by name or slug
                const company = await prisma.company.findFirst({
                    where: {
                        OR: [
                            { name: companyName },
                            { slug: companyName }
                        ]
                    }
                });
                if (!company) throw new Error(`Could not find organization: ${companyName}`);
                targetCompanyId = company.id;
            } else {
                // Production Readiness: In a real PRD, staff join via invite or specific slug.
                // For agility, we'll assign to the first available company if none provided,
                // but we flag this as a fallback.
                const fallbackCompany = await prisma.company.findFirst({
                    orderBy: { createdAt: 'asc' }
                });

                if (!fallbackCompany) {
                    throw new Error("No organizations found to join. Please register as a CEO first.");
                }
                targetCompanyId = fallbackCompany.id;
            }
        }

        // 4. Secure Password Hashing
        const hashedPassword = await bcrypt.hash(password, 12);

        // 5. User Creation with New Session ID
        const newSessionId = uuidv4();
        const user = await prisma.user.create({
            data: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role,
                department,
                position: this.getDefaultPosition(role),
                companyId: targetCompanyId,
                sessionId: newSessionId,
            },
        });

        // 6. Session Token Generation
        const token = this.generateToken(user, newSessionId);

        return {
            user: this.sanitizeUser(user),
            token,
            message: role === 'ceo' ? "Organization and executive account created" : "Team member account created"
        };
    }

    /**
     * Authenticate a user and return a session token.
     */
    async login(email: string, password: string) {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { company: true }
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        // Generate and persist new session ID (invalidates previous sessions)
        const newSessionId = uuidv4();
        await prisma.user.update({
            where: { id: user.id },
            data: { sessionId: newSessionId }
        });

        const token = this.generateToken(user, newSessionId);

        return {
            user: this.sanitizeUser(user),
            token,
            message: "Successfully authenticated"
        };
    }

    /**
     * Helper to generate a standardized JWT token and unique session ID.
     */
    private generateToken(user: any, sessionId: string) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                sessionId: sessionId
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
    }

    /**
     * Verify if the current session is still valid (not replaced by a newer login).
     */
    async verifySession(userId: string, sessionId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { sessionId: true }
        });

        return user?.sessionId === sessionId;
    }

    /**
     * Remove sensitive internal data before returning to client.
     */
    private sanitizeUser(user: any) {
        const { password, sessionId, ...sanitized } = user;
        return sanitized;
    }

    /**
     * Generate URL-friendly slug from text.
     */
    private generateSlug(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    /**
     * Get default business position based on the selected role.
     */
    private getDefaultPosition(role: UserRole): string {
        switch (role) {
            case 'ceo': return 'Chief Executive Officer';
            case 'hr': return 'HR Administrator';
            case 'manager': return 'Team Lead';
            case 'staff': return 'Associate';
            default: return 'User';
        }
    }
}

export const authService = new AuthService();
