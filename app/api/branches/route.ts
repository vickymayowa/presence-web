import { NextRequest, NextResponse } from "next/server";
import { branchService } from "@/lib/services/branch-service";
import { authService } from "@/lib/services/auth-service";

export async function GET(req: NextRequest) {
    try {
        const session = await authService.validateSession(req);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const branchId = searchParams.get('id');

        if (branchId) {
            const branch = await branchService.getBranch(branchId);
            return NextResponse.json({ data: branch });
        }

        const branches = await branchService.getBranches(session.companyId);
        return NextResponse.json({ data: branches });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await authService.validateSession(req);
        if (!session || (session.role !== 'ceo' && session.role !== 'hr')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const branch = await branchService.createBranch(session.companyId, session.userId, body);

        return NextResponse.json({ data: branch });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await authService.validateSession(req);
        if (!session || (session.role !== 'ceo' && session.role !== 'hr')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { branchId, userId, ...data } = body;

        if (userId && branchId !== undefined) {
            // Assign user to branch
            const user = await branchService.assignUserToBranch(userId, branchId, session.companyId, session.userId);
            return NextResponse.json({ data: user });
        } else if (branchId) {
            // Update branch
            const branch = await branchService.updateBranch(branchId, session.companyId, session.userId, data);
            return NextResponse.json({ data: branch });
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await authService.validateSession(req);
        if (!session || (session.role !== 'ceo' && session.role !== 'hr')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const branchId = searchParams.get('id');

        if (!branchId) return NextResponse.json({ error: "Branch ID required" }, { status: 400 });

        await branchService.deleteBranch(branchId, session.companyId, session.userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
