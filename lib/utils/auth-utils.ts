import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-me";

export interface AuthSession {
    id: string;
    email: string;
    role: string;
    companyId: string;
}

/**
 * Extracts and verifies the JWT token from the Authorization header.
 */
export function getSession(req: NextRequest): AuthSession | null {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthSession;
        return decoded;
    } catch (error) {
        return null;
    }
}
