export const reportFilter = (req, res, next) => {
    if (req.user.role === "SUPER_ADMIN") {
        req.reportFilter = {};
        return next();
    }
     if (req.user.role === "MANAGER") {
        req.reportFilter = {
            location: req.user.assignedLocation
        };
    }

    next();
}