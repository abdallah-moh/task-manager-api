import Joi from "joi";
import { TaskStatus } from "../types/tasks.types.js";

const createTaskSchema = {
    body: Joi.object({
        title: Joi.string().required().min(3).max(30),
        description: Joi.string().required().max(200),
        status: Joi.string()
            .valid(...Object.values(TaskStatus)),
    })
};

const taskIdParamSchema = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
};

export const createTaskAsAdminSchema = {
    ...taskIdParamSchema,
    ...createTaskSchema
};

export const updateTaskSchema = {
    ...taskIdParamSchema,
    body: Joi.object({
        title: Joi.string().min(3).max(30),
        description: Joi.string().max(200),
        status: Joi.string()
            .valid(...Object.values(TaskStatus)),
        assignedTo: Joi.number()
    })
};

export { createTaskSchema, taskIdParamSchema };