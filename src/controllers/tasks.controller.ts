import type { Request, Response } from "express";
import { createTask, deleteTask, getTask, getTasksForUser, updateTask } from "../services/tasks.service.js";
import { TaskStatus } from "../types/tasks.types.js";

export function getTasksController(req: Request, res: Response) {
    let { id } = req.user;

    if (req.params.id) {
        id = req.params.id as string;
    }

    if (req.query.id) {
        return res.json(getTask(req.query.id as string));
    }

    res.json(getTasksForUser(id));
}

export function createTaskController(req: Request, res: Response) {
    let { title, description, status } = req.body;

    let createdBy = req.user.id;
    let assignedTo = req.params.id as string;

    if (!assignedTo) {
        assignedTo = createdBy;
    }
    if (!status) {
        status = TaskStatus.TODO;
    }

    createTask({ title, description, assignedTo, createdBy, status });
    res.sendStatus(201);
}

export function updateTaskController(req: Request, res: Response) {
    const { title, description, status } = req.body;
    const { role, id: userID } = req.user;
    const { id } = req.params;

    updateTask({ id: id as string, userID, role }, { title, description, status });

    res.sendStatus(200);
}

export function deleteTaskController(req: Request, res: Response) {
    const { id } = req.params;
    const { id: userID, role } = req.user;


    deleteTask({
        id: id as string, userID, role
    });
    res.sendStatus(200);
}