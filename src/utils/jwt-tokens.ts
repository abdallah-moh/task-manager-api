import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { ApiError } from "./api-error.js";

const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET as string;

if (!AUTHORIZATION_TOKEN_SECRET) {
    throw new Error("JWT secret not configured");
}

export function createTokensForUser(id: number) {
    return {
        accessToken: createToken(id, 'access', {
            expiresIn: "10m",
        }),
        refreshToken: createToken(id, 'refresh', {
            expiresIn: "90d"
        })
    };
}

function createToken(id: number, type: 'access' | 'refresh', options: SignOptions) {
    return jwt.sign(
        {
            sub: id,
            type
        },
        AUTHORIZATION_TOKEN_SECRET,
        options
    );
}

export function verifyToken(token: string, type: 'access' | 'refresh') {
    const payload = jwt.verify(token, AUTHORIZATION_TOKEN_SECRET) as JwtPayload;
    if (payload.type !== type)
        throw new ApiError(401, "Unauthorized");
    return payload;
}