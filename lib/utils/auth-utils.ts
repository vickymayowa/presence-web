import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-me";

export interface AuthSession {
    id: string;
    email: string;
    role: string;
    companyId: string;
    sessionId: string;
}

/**
 * Extracts and verifies the JWT token from the Authorization header or Cookies.
 */
export function getSession(req: NextRequest): AuthSession | null {
    // 1. Try to get token from Authorization header
    const authHeader = req.headers.get("authorization");
    let token = "";
    

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    // 2. If no header, try to get from cookies
    if (!token) {
        const cookieToken = req.cookies.get("presence_auth_token");
        if (cookieToken) {
            token = cookieToken.value;
        }
    }

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthSession;
        return decoded;
    } catch (error) {
        return null;
    }
}
