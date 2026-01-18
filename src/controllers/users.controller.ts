import type { Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { createNewUser, getUser } from "../services/users.service.js";


const AUTHORIZATION_TOKEN_SECRET = process.env.AUTHORIZATION_TOKEN_SECRET || "secret";

const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
}).unknown(true);

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    name: Joi.string().required().min(3).max(30),
}).unknown(true);

function loginToUser(req: Request, res: Response) {
    const { value, error } = loginSchema.validate(req.body);

    if (error) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    let user = getUser(value.email);
    if (!user) {
        res.status(400).json({
            message: "A user with this email does not exist"
        });
        return;
    }

    let accessToken = jwt.sign({
        id: user?.id,
        email: user?.email,
        name: user?.name
    }, AUTHORIZATION_TOKEN_SECRET);

    res.json({
        accessToken
    });
}

async function registerAUser(req: Request, res: Response) {
    const { value, error } = registerSchema.validate(req.body);

    if (error) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    let user = await createNewUser(value.email, value.password, value.name);

    if (!user) {
        res.status(400).json({
            message: "A user with this email already exists"
        });
        return;
    }
    let accessToken = jwt.sign({
        id: user?.id,
        email: user?.email,
        name: user?.name
    }, AUTHORIZATION_TOKEN_SECRET);

    res.json({
        accessToken
    });
}

export {
    loginToUser, registerAUser
};