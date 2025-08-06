import jwt from "jsonwebtoken";

export function verifyTokenFromHeader(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT secret not set");
    }

    return jwt.verify(token, secret);
}
