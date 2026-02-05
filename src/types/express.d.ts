import "express";
import type { UserRole } from "./users.types.ts";

declare module "express-serve-static-core" {
    interface Request {
        user: {
            id: number;
            role: UserRole;
        };
        validatedQuery: Query;
    }
}