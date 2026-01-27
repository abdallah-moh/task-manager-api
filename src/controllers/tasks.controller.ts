import type { Request, Response } from "express";
import { createTask, deleteTask, getTask, getTasksForAUser, updateTask } from "../services/tasks.service.js";


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

export async function getTasksForUserController(req: Request, res: Response) {
    let { id } = req.user;

    if (req.params.userId) {
        id = parseInt(req.params.userId as string);
    }

    res.json(await getTasksForAUser(id));
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