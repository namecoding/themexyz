import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to extract and verify token
export function verifyTokenFromHeader(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET);
}
