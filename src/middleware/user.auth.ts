import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET || "secret";

function userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    let { authorization } = req.headers;
    let accessToken;

    if (authorization?.startsWith("Bearer ")) {
        accessToken = authorization.split(" ")[1];
    }

    if (!accessToken) {
        res.status(400).json({ message: "An access token should be provided in the header" });
        return;
    }

    jwt.verify(accessToken, AUTHORIZATION_TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        next();
    });
};

export { userAuthMiddleware };