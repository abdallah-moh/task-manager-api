import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { checkUserExists, getUser } from "../services/users.service.js";
import { ApiError } from "../utils/api-error.js";
import { UserRole, type User } from "../types/users.types.js";
const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET || "secret";

function tokenAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        let { authorization } = req.headers;
        let accessToken;

        if (authorization?.startsWith("Bearer ")) {
            accessToken = authorization.split(" ")[1];
        }

        if (!accessToken) {
            throw new ApiError(401, "Authentication required");
        }

        let payload = jwt.verify(accessToken, AUTHORIZATION_TOKEN_SECRET) as JwtPayload;

        const exists = checkUserExists("id", payload.id);
        if (!exists) {
            throw new ApiError(401, "Invalid credentials");
        }
        req.user = { id: payload.id, role: payload.role };
        console.log(req.user);

        next();
    } catch (err) {
        next(err);
    }
};

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let isAdmin = req.user.role === UserRole.ADMIN;

    if (!isAdmin) {
        throw new ApiError(403, "Access denied");
    }

    next();
};

export { tokenAuthMiddleware, adminAuthMiddleware };