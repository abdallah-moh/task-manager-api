import { TaskStatus, type Task } from "../types/tasks.types.js";
import { UserRole } from "../types/users.types.js";
import { ApiError } from "../utils/api-error.js";

let tasks: Task[] = [];

export function createTask(data: { title: string, description: string, createdBy: string, assignedTo: string, status: TaskStatus; }) {
    const { title, description, createdBy, assignedTo, status } = data;

    let task: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        createdBy,
        assignedTo,
        createdAt: new Date(Date.now()),
        updatedAt: null,
        status,
    };

    tasks.push(task);
}

export function getTasksForUser(id: string) {
    return tasks.filter((task) => {
        return task.assignedTo === id || task.createdBy === id;
    });
}

export function getTask(id: string) {
    return tasks.find((t) => {
        return t.id === id;
    });
}

export function updateTask(data: { id: string, userID: string, role: UserRole; }, update: { title?: string, description?: string, status?: TaskStatus; }) {
    let index = tasks.findIndex((t) => {
        return t.id === data.id;
    });

    const task = tasks[index];

    if (!task) {
        throw new ApiError(404, "Task doesnt exist");
    }

    if (task.createdBy !== data.userID && data.role !== UserRole.ADMIN) {
        throw new ApiError(401, "Unauthorized access");
    }

    if (update.title) {
        task.title = update.title;
    }

    if (update.description) {
        task.description = update.description;
    }

    if (update.status) {
        task.status = update.status;
    }

    tasks[index] = task;
}

export function deleteTask(options: {
    id: string,
    userID: string,
    role: UserRole;
}) {
    let index = tasks.findIndex((t) => {
        t.id === options.id;
    });

    if (index < 0)
        throw new ApiError(404, "Task doesn't exist");
    let task = tasks[index];

    if (task?.createdBy !== options.userID && options.role !== UserRole.ADMIN) {
        throw new ApiError(401, "Unauthorized access");
    }
    tasks.splice(index, 1);
}