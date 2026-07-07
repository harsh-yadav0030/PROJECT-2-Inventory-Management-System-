import { User } from "../models/user.model.js";
import { verifyJwt } from "./auth.middleware.js";

export const allowFirstSuperAdmin = async (req, res, next) => {
    try {

        const superAdminCount = await User.countDocuments({
            role: "SUPER_ADMIN",
        });

        if (superAdminCount === 0) {
            req.firstSuperAdmin = true;
            return next();
        }

        return verifyJwt(req, res, next);

    } catch (error) {
        next(error);
    }
};