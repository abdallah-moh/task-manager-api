import { pool } from "../config/db.js";

export class TokensRepository {
    static async addToken(token: string) {
        const query = "INSERT INTO tokens (refresh_token) VALUES ($1) RETURNING *";
        const result = await pool.query(query, [token]);

        return result.rows[0];
    }

    static async getToken(token: string) {
        const query = "SELECT id, refresh_token FROM tokens WHERE refresh_token=$1";
        const result = await pool.query(query, [token]);

        return result.rows[0];
    }

    static async deleteToken(token: string) {
        const query = "DELETE FROM tokens WHERE refresh_token=$1";
        await pool.query(query, [token]);
    }
};