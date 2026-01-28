const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded || !decoded.role) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;