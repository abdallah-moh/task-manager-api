import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";

type ValidationSchema = {
    body?: ObjectSchema,
    params?: ObjectSchema,
    query?: ObjectSchema;
};

export function validateMiddleware(schema: ValidationSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const options = {
            abortEarly: false, // return all errors
            allowUnknown: false,
            stripUnknown: true, // remove unknown fields
        };

        if (schema.body) {
            let { error, value } = schema.body.validate(req.body, options);
            if (error) {
                throw error;
            }

            req.body = value;
        }

        if (schema.params) {
            let { error, value } = schema.params.validate(req.params, options);
            if (error) {
                throw error;
            }

            req.params = value;
        }

        if (schema.query) {
            let { error, value } = schema.query.validate(req.query, options);
            if (error) {
                throw error;
            }

            // req.query = value;
        }

        next();
    };
}