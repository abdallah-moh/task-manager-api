import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import Joi from "joi";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    // Custom application errors
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err instanceof jwt.TokenExpiredError) {
        statusCode = 401;
        message = "Token expired";
    }

    // Joi validation errors
    if (err instanceof Joi.ValidationError) {
        statusCode = 400;
        message = err.details.map(d => d.message).join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};