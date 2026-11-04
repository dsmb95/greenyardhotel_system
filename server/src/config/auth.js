import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

// --------------------------------------------------------------
// Express middleware for the protected routes.
// --------------------------------------------------------------
export function authRequired(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
        req.user = verifyToken(token);
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}