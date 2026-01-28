const rbacMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {        console.log("i here for answer1");

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        next();
    };
};

const isAdmin = rbacMiddleware(['admin']);
const isServiceProvider = rbacMiddleware(['service_provider']);

module.exports = rbacMiddleware;
module.exports.isAdmin = isAdmin;
module.exports.isServiceProvider = isServiceProvider;
