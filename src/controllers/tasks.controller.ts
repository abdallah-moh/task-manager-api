import type { Request, Response } from "express";
import { createTask, deleteTask, getTask, getTasksForAUser, updateTask } from "../services/tasks.service.js";
import type { TaskStatus } from "../types/tasks.types.js";


export async function createTaskController(req: Request, res: Response) {
    let { title, description, status } = req.body;

    let createdBy = req.user.id;
    let assignedTo = parseInt(req.params.id as string);

    let newTask = await createTask({ title, description, assignedTo, createdBy, status });
    res.status(201).send(newTask);
}

export async function getTaskController(req: Request, res: Response) {
    const task = await getTask({
        id: parseInt(req.params.id as string),
        userId: req.user.id,
        role: req.user.role
    });

    res.json(task);
}

export async function getTasksController(req: Request, res: Response) {
    let userId = req.user.id;

    const {
        search,
        status,
        created_before,
        created_after,
        updated_after,
        updated_before,
        cursor,
        limit
    } = req.query;

    if (req.params.userId) {
        userId = parseInt(req.params.userId as string);
    }

    res.json(await getTasksForAUser(userId, {
        search: search as string,
        status: status as TaskStatus,
        cursor: parseInt(cursor as string) || 0,
        limit: Math.min(Number(limit) || 10, 50),
        ...(created_before !== undefined
            ? { created_before: new Date(created_before as string) }
            : {}),
        ...(created_after !== undefined
            ? { created_after: new Date(created_after as string) }
            : {}),
        ...(updated_before !== undefined
            ? { updated_before: new Date(updated_before as string) }
            : {}),
        ...(updated_after !== undefined
            ? { updated_after: new Date(updated_after as string) }
            : {}),
    }));
}



export async function updateTaskController(req: Request, res: Response) {
    const { title, description, status, assignedTo } = req.body;
    const { role, id: userId } = req.user;
    const { id } = req.params;

    let updatedTask = await updateTask({ id: parseInt(id as string), userId, role }, { title, description, status, assignedTo });

    res.status(200).json(updatedTask);
}

export async function deleteTaskController(req: Request, res: Response) {
    const { id } = req.params;
    const { id: userId, role } = req.user;


    await deleteTask({
        id: parseInt(id as string), userId, role
    });

    res.sendStatus(200);
}