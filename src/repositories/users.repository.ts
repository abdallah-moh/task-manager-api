import { pool } from "../config/db.js";
import type { User, CreateUser, UpdateUser } from "../types/users.types.js";

export class UsersRepository {
    static async createUser(user: CreateUser) {
        const query = "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [user.name, user.email, user.password, user.role];
        const result = await pool.query<User>(query, values);
        return result.rows[0];
    }

    static async getUser(key: "id" | "email", value: string | number) {
        const result = await pool.query<User>(`SELECT * FROM users WHERE ${key}=$1`, [value]);
        return result.rows[0];
    }

    static async getAllUsers() {
        const result = await pool.query<User>('SELECT id, name, email, role, created_at FROM users');
        return result.rows;
    }

    static async updateUser(id: number, update: UpdateUser) {
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
        const query = `UPDATE users SET ${fields.join(", ")} WHERE id=$${index} RETURNING id, name, email, role`;

        const result = await pool.query<User>(query, values);
        return result.rows[0];
    }
};