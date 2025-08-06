import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyTokenFromHeader } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function GET(request: Request) {
    try {
        const decoded: any = verifyTokenFromHeader(request);

        if (!decoded || !decoded.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, headers: corsHeaders });
        }

        const client = await clientPromise;
        const db = client.db();

        // Fetch the requester to check for superAdmin
        const currentUser = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });

        if (!currentUser?.admin.permission.includes('super_admin')) {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403, headers: corsHeaders });
        }

        const users = await db.collection("users")
            .find({})
            .project({
                name: 1,
                email: 1,
                avatar: 1,
                createdAt: 1,
                isAdmin: 1,
                adminRole: 1,
                superAdmin: 1,
                status: 1,
                lastLogin: 1,
                admin: 1,
                isSystem: 1
            })
            .toArray();

        // Ensure default values for status and lastLogin
        const formatted = users.map(user => ({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? null,
            joinDate: user.createdAt,
            // isAdmin: !!user.isAdmin,
            // adminRole: user.admin?.permission ?? null,
            // superAdmin: !!user.superAdmin,
            status: user.status ?? "active",
            lastLogin: user.lastLogin ?? null,
            permission: user.admin?.permission ?? null,
            isSystem: user.isSystem ?? false
            //  ...(user.isSystem ? { isSystem: true } : {})
        }));

        return NextResponse.json({ success: true, users: formatted }, { status: 200, headers: corsHeaders });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500, headers: corsHeaders }
        );
    }
}
