import "express";
import type { UserRole } from "./users.types.ts";

declare module "express-serve-static-core" {
    interface Request {
        user: {
            id: string;
            role: UserRole;
        };
    }
}