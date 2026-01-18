import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { checkUserExists } from "../services/users.service.js";
const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET || "secret";

function tokenAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let { authorization } = req.headers;
    let accessToken;

    if (authorization?.startsWith("Bearer ")) {
        accessToken = authorization.split(" ")[1];
    }

    if (!accessToken) {
        res.status(401).json({ message: "An access token should be provided in the header" });
        return;
    }

    jwt.verify(accessToken, AUTHORIZATION_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.body = payload;
        if (!checkUserExists('id', req.body.id)) {
            res.status(404).json({
                message: "A user with these login credentials doesn't exist"
            });
            return;
        }
        next();
    });
};

export { tokenAuthMiddleware };