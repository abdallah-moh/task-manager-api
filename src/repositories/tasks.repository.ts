import { pool } from "../config/db.js";
import type { CreateTask, TaskStatus, UpdateTask } from "../types/tasks.types.js";

export class TaskRepository {
    static async createTask(task: CreateTask) {
        const result = await pool.query("INSERT INTO tasks (title, description, status, created_by, assigned_to) VALUES ($1, $2, $3, $4, $5) RETURNING *", Object.values(task));
        return result.rows[0];
    }

    static async getTask(id: number) {
        const result = await pool.query("SELECT * FROM tasks WHERE id=$1", [id]);
        return result.rows[0];
    }

    static async getTasksForUser(userId: number) {
        const result = await pool.query("SELECT * FROM tasks WHERE assigned_to=$1 OR created_by=$1", [userId]);
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

        if (fields.length === 0) return null;

        values.push(id);
        const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id=$${index} RETURNING *`;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async deleteTask(id: number) {
        await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    }
};