import type { Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createNewUser, getUser, promoteAUser } from "../services/users.service.js";


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

async function loginController(req: Request, res: Response) {
    const { value, error } = loginSchema.validate(req.body);

    if (error) {
        res.status(401).json({
            message: error.message
        });
        return;
    }

    let user = getUser('email', value.email);
    if (!user) {
        res.status(401).json({
            message: "A user with this email does not exist"
        });
        return;
    }

    try {
        const isMatch = await bcrypt.compare(value.password, user.password);
        if (!isMatch) {
            res.status(401).json({
                message: "The password is incorrect"
            });
            return;
        }

        let accessToken = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name
        }, AUTHORIZATION_TOKEN_SECRET);

        res.json({
            accessToken
        });
    } catch (err) {
        res.status(500).json({
            message: "An error occurred while processing your request"
        });
    }
}

async function registerController(req: Request, res: Response) {
    const { value, error } = registerSchema.validate(req.body);

    if (error) {
        res.status(400).json({
            message: error.message
        });
        return;
    }

    let user = await createNewUser(value.email, value.password, value.name);

    if (!user) {
        res.status(409).json({
            message: "A user with this email already exists"
        });
        return;
    }

    let accessToken = jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name
    }, AUTHORIZATION_TOKEN_SECRET);

    res.json({
        accessToken
    });
}

function promoteController(req: Request<{ id: string; }>, res: Response) {
    try {
        promoteAUser("id", req.params.id);
        res.sendStatus(200);
    }
    catch (err) {
        let error = err as Error;
        res.status(404).json({
            message: error.message
        });
    }


}

export {
    loginController,
    registerController,
    promoteController
};