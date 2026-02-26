const rbacMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Admin Isolation
        if (req.user.role === "admin") {
            if (allowedRoles.includes("admin")) {
                return next();
            }
            return res.status(403).json({
                message: "Admin cannot access this route",
            });
        }

        // Normal User Feature Roles
        if (!allowedRoles.length) {
            // If no roles specified, allow any authenticated user
            return next();
        }

        const hasAccess = allowedRoles.some(role =>
            req.user.roles?.includes(role)
        );

        if (!hasAccess) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        next();
    };
};

// Specific helpers
const isAdmin = rbacMiddleware(["admin"]);
const isSeller = rbacMiddleware(["seller"]);
const isServiceProvider = rbacMiddleware(["service_provider"]);

module.exports = rbacMiddleware;
module.exports.isAdmin = isAdmin;
module.exports.isSeller = isSeller;
module.exports.isServiceProvider = isServiceProvider;
