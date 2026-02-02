import { TaskRepository } from "../repositories/tasks.repository.js";
import { TaskStatus, type CreateTask, type GetTask, type TasksFilters, type UpdateOrDeleteTaskInfo, type UpdateTask } from "../types/tasks.types.js";
import { UserRole } from "../types/users.types.js";
import { ApiError } from "../utils/api-error.js";

export async function createTask(task: CreateTask) {
    // If the task is not assigned to anyone assign it to the creator
    if (!task.assignedTo) {
        task.assignedTo = task.createdBy;
    }

    // If task not specified assign default
    if (!task.status) {
        task.status = TaskStatus.TODO;
    }

    return await TaskRepository.createTask(task);
}

export async function getTask(taskInfo: GetTask) {
    const { id, userId, role } = taskInfo;
    const task = await TaskRepository.getTask(id);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const isOwnerOrAssignee =
        userId === task.createdBy || userId === task.assignedTo;

    // Check for permission
    if (!isOwnerOrAssignee && role !== UserRole.ADMIN) {
        throw new ApiError(403, "Forbidden access");
    }

    return task;
}

export async function getTasksForAUser(id: number, filters: TasksFilters) {
    return await TaskRepository.getTasksForUser(id, filters);
}

export async function updateTask(updateInfo: UpdateOrDeleteTaskInfo, update: UpdateTask) {
    // If a user can get a task and it does not throw an error then he can update the task
    await getTask(updateInfo);
    // Update the task
    let updatedTask = await TaskRepository.updateTask(updateInfo.id, update);
    return updatedTask;
}

export async function deleteTask(deleteInfo: UpdateOrDeleteTaskInfo) {
    // If a user can get a task and it does not throw an error then he can delete the task
    await getTask(deleteInfo);
    // Update the task
    await TaskRepository.deleteTask(deleteInfo.id);
}
