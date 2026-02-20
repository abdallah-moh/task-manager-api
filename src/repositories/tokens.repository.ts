import { pool } from "../config/db.js";
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from "../services/users.service.js";

export class TokensRepository {
    static async addToken(token: string) {
        const query = "INSERT INTO tokens (refresh_token) VALUES ($1) RETURNING *";
        const result = await pool.query(query, [await bcrypt.hash(token, SALT_ROUNDS)]);

        return result.rows[0];
    }

    static async getToken(token: string) {
        const query = "SELECT id, refresh_token FROM tokens WHERE id=$1";
        const result = await pool.query(query, [await bcrypt.hash(token, SALT_ROUNDS)]);

        return result.rows[0];
    }

    static async deleteToken(token: string) {
        const query = "DELETE FROM tokens WHERE refresh_token=$1";
        await pool.query(query, [await bcrypt.hash(token, SALT_ROUNDS)]);
    }
};