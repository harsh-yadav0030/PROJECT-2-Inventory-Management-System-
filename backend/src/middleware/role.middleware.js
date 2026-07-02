// RBAC
import { ApiError } from "../utils/ApiError.js";

// It checks whether the route is allowded to this role user
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {

     if (req.firstSuperAdmin) {
            return next();
      }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You are not authorized to perform this action (Access Restricted) ",
      );
    }
    next(); 
  };
};
