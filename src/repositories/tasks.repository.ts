import { pool } from "../config/db.js";
import type { CreateTask, Task, TasksFilters, UpdateTask } from "../types/tasks.types.js";

export class TaskRepository {
    static async createTask(task: CreateTask) {
        const query = "INSERT INTO tasks (title, description, status, created_by, assigned_to) VALUES ($1, $2, $3, $4, $5) RETURNING *";
        const values = [task.title, task.description, task.status, task.createdBy, task.assignedTo];
        const result = await pool.query<Task>(query, values);

        return result.rows[0];
    }

    static async getTask(id: number) {
        const result = await pool.query<Task>(`SELECT 
            id,
            title,
            description,
            status,
            created_by AS "createdBy",
            assigned_to AS "assignedTo",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
             FROM tasks WHERE id=$1 `, [id]);

        return result.rows[0];
    }

    static async getTasksForUser(userId: number, filters: TasksFilters) {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        fields.push(`(assigned_to=$${index++} OR created_by=$${index - 1})`);
        values.push(userId);

        if (filters.search) {
            fields.push(`(title ILIKE $${index++} OR description ILIKE $${index - 1})`);
            values.push(`%${filters.search}%`);
        }
        if (filters.status) {
            fields.push(`status = $${index++}`);
            values.push(filters.status);
        }
        if (filters.created_before) {
            fields.push(`created_at <= $${index++}`);
            values.push(filters.created_before);
        }
        if (filters.created_after) {
            fields.push(`created_at >= $${index++}`);
            values.push(filters.created_after);
        }

        if (filters.updated_before) {
            fields.push(`updated_at <= $${index++}`);
            values.push(filters.updated_before);
        }

        if (filters.updated_after) {
            fields.push(`updated_at >= $${index++}`);
            values.push(filters.updated_after);
        }

        fields.push(`id > $${index++}`);
        values.push(filters.cursor);

        values.push(filters.limit);

        const query = `SELECT 
            id,
            title,
            description,
            status,
            created_by AS "createdBy",
            assigned_to AS "assignedTo",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
             FROM tasks WHERE ${fields.join(" AND ")} LIMIT $${index++}`;
        const result = await pool.query<Task>(query, values);
        return result.rows;
    }

    static async updateTask(id: number, update: UpdateTask) {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (update.title) {
            fields.push(`title=$${index++}`);
            values.push(update.title);
        }
        if (update.description) {
            fields.push(`description=$${index++}`);
            values.push(update.description);
        }
        if (update.status) {
            fields.push(`status=$${index++}`);
            values.push(update.status);
        }
        if (update.assignedTo) {
            fields.push(`assigned_to=$${index++}`);
            values.push(update.assignedTo);
        }

        if (fields.length === 0) return null;

        fields.push(`updated_at=$${index++}`);
        values.push(new Date(Date.now()));

        values.push(id);
        const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id=$${index} RETURNING *`;

        const result = await pool.query<Task>(query, values);
        return result.rows[0];
    }

    static async deleteTask(id: number) {
        await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    }
};