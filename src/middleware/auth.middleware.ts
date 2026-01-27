import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { UserRole } from "../types/users.types.js";
import { UsersRepository } from "../repositories/users.repository.js";
const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET as string;

if (!AUTHORIZATION_TOKEN_SECRET) {
    throw new Error("JWT secret not configured");
}

async function tokenAuthMiddleware(req: Request, res: Response, next: NextFunction) {
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

        const user = await UsersRepository.getUser("id", payload.id);

        if (!user) {
            throw new ApiError(401, "Unauthorized access");
        }
        req.user = { id: payload.id, role: user.role };

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