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
export interface UpdateTask { title?: string, description?: string, status?: TaskStatus; }

export interface Task extends CreateTask {
    id: number,
    createdAt: Date,
    updatedAt: Date | null;
}