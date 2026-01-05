// const isAdmin = (req, res, next) => {
//     if (!req.user || req.user.role !== "admin") {
//         return res.status(403).json({ message: "Admin access required" });
//     }
//     next();
// };

// const isServiceProvider = (req, res, next) => {
//     if (!req.user || req.user.role !== "service_provider") {
//         return res.status(403).json({ message: "Service Provider access required" });
//     }
//     next();
// };

// module.exports = { isAdmin, isServiceProvider };

// server/middleware/rbacMiddleware.js

const rbacMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        next();
    };
};

module.exports = rbacMiddleware;
