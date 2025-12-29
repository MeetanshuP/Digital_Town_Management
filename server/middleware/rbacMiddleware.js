const isAdmin =(req, res, next) => {
    if(req.user.role !== "admin") {
        return res.status(403).json({message : "Admin access required"});
    }
    next();
};

const isServiceProvider = (req, res, next) => {
    if(req.user.role !=="service_provider"){
        return res.status(403).json({message :"Service Provider access required"});
    }
    next();
};

module.exports = {isServiceProvider, isAdmin};