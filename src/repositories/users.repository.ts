import { pool } from "../config/db.js";
import type { CreateUser, UpdateUser } from "../types/users.types.js";

export class UsersRepository {
    static async createUser(user: CreateUser) {
        const result = await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *", Object.values(user));
        return result.rows[0];
    }

    static async getUser(id: string) {
        const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
        return result.rows[0];
    }

    static async updateUser(id: string, update: UpdateUser) {
        const fields: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (update.email) {
            fields.push(`email=$${index++}`);
            values.push(update.email);
        }
        if (update.name) {
            fields.push(`name=$${index++}`);
            values.push(update.name);
        }
        if (update.password) {
            fields.push(`password=$${index++}`);
            values.push(update.password);
        }
        if (update.role) {
            fields.push(`role=$${index++}`);
            values.push(update.role);
        }

        if (fields.length === 0) return null;

        values.push(id);
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id=$${index} RETURNING *`;

        const result = await pool.query(query, values);
        return result.rows[0];
    }
};