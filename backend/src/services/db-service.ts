import mysql, { Pool } from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export class DbService {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "3306"),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        this.init();
    }

    async query(sql: string, params?: any[]): Promise<any> {
        const [rows] = await this.pool.execute(sql, params);
        return rows;
    }

    async init(): Promise<void> {
        const sqlFilePath = path.join(__dirname, "..", "..", "sql", "init.sql");
        try {
            const fileContent = fs.readFileSync(sqlFilePath, "utf8");
            const queries = fileContent
                .split(";")
                .filter((query) => query.trim() !== "");
            for (const query of queries) {
                await this.query(query);
            }
        } catch (err) {
            console.error("Error initializing the database:", err);
            throw err;
        }
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}
