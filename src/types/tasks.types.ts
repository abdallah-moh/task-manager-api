import type { UserRole } from "./users.types.js";

export enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export interface CreateTask {
    title: string,
    description: string,
    status: TaskStatus,
    createdBy: number,
    assignedTo: number;
}

export interface UpdateTask { title?: string, description?: string, status?: TaskStatus; assignedTo?: number; }

export interface GetTask { id: number, userId: number, role: UserRole; }

export interface UpdateOrDeleteTaskInfo extends GetTask { }

export interface Task extends CreateTask {
    id: number,
    createdAt: Date,
    updatedAt: Date | null;
}

export interface TasksFilters {
    search?: string,
    status?: TaskStatus,
    created_before?: Date,
    created_after?: Date,
    updated_after?: Date,
    updated_before?: Date,
    cursor?: number,
    limit?: number;
}