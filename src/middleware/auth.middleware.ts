import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { UserRole } from "../types/users.types.js";
import { UsersRepository } from "../repositories/users.repository.js";
import { verifyToken } from "../utils/jwt-tokens.js";
import { TokensRepository } from "../repositories/tokens.repository.js";

function tokenAuthMiddleware(type: 'access' | 'refresh') {
    return async (req: Request, res: Response, next: NextFunction) => {
        let token;
        try {
            if (type === 'refresh') {
                token = req.body.refresh_token;
                const result = await TokensRepository.getToken(token);

                if (!result) {
                    throw new ApiError(401, "Unauthorized");
                }
            }
            else if (type === 'access') {
                let { authorization } = req.headers;

                if (authorization?.startsWith("Bearer ")) {
                    token = authorization.split(" ")[1];
                }
            }

            if (!token) {
                throw new ApiError(401, "Authentication required");
            }

            let payload = verifyToken(token, type);
            let id = parseInt(payload.sub as string);

            const user = await UsersRepository.getUser("id", id);

            if (!user) {
                throw new ApiError(401, "Unauthorized access");
            }
            req.user = { id, role: user.role };

            next();
        } catch (err) {
            if ((err as Error).name === 'TokenExpiredError' && type === 'refresh') {
                await TokensRepository.deleteToken(token);
            }
            next(err);
        }
    };
};

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let isAdmin = req.user.role === UserRole.ADMIN;

    if (!isAdmin) {
        throw new ApiError(403, "Access denied");
    }

    next();
};

export { tokenAuthMiddleware, adminAuthMiddleware };