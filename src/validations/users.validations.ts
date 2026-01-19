import Joi from "joi";

const loginUserSchema = {
    body: Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })
};

const registerUserSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        name: Joi.string().required().min(3).max(30),
    })
};

const userIdParamSchema = {
    params: Joi.object({
        id: Joi.string().uuid().required(),
    }),
};

export {
    loginUserSchema,
    registerUserSchema,
    userIdParamSchema
};