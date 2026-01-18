import type { Request, Response, NextFunction } from "express";
import { getUser } from "../services/users.service.js";
import { UserRole } from "../types/users.js";

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let user = getUser('id', req.body.id);

    if (!user) {
        res.status(403).json({
            message: "User not found"
        });
        return;
    }

    let isAdmin = user.role === UserRole.ADMIN;

    if (!isAdmin) {
        res.status(403).json({
            message: "This feature is only allowed for admins"
        });
        return;
    }
    next();
};

export { adminAuthMiddleware };