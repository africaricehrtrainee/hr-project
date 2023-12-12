"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
// Import necessary modules and dependencies
const promise_1 = __importDefault(require("mysql2/promise"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from a .env file
dotenv_1.default.config();
// Define a class named DbService
class DbService {
    // Constructor for the DbService class
    constructor() {
        // Create a MySQL connection pool using configuration from environment variables
        this.pool = promise_1.default.createPool({
            host: process.env.DB_HOST, // Database host
            port: parseInt(process.env.DB_PORT || "3306"), // Database port (default is 3306)
            user: process.env.DB_USER, // Database user
            password: process.env.DB_PASSWORD, // Database user's password
            database: process.env.DB_DATABASE, // Name of the database to connect to
            waitForConnections: true, // Whether to wait for available connections
            connectionLimit: 10, // Maximum number of connections in the pool
            queueLimit: 0, // Maximum number of queued connection requests
        });
        // Initialize the database by running SQL scripts
        this.init();
    }
    // Method for executing database queries
    query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // Execute the SQL query using the connection pool and optional parameters
            const [rows] = yield this.pool.execute(sql, params);
            return rows; // Return the query result
        });
    }
    // Method to initialize the database by running SQL scripts
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Define the path to the SQL initialization script
            const sqlFilePath = path_1.default.join(__dirname, "..", "..", "sql", "init.sql");
            try {
                // Read the SQL script file
                const fileContent = fs_1.default.readFileSync(sqlFilePath, "utf8");
                // Split the script into individual queries and filter out empty queries
                const queries = fileContent
                    .split(";")
                    .filter((query) => query.trim() !== "");
                // Execute each query sequentially
                for (const query of queries) {
                    yield this.query(query);
                }
            }
            catch (err) {
                console.error("Error initializing the database:", err);
                throw err;
            }
        });
    }
    // Method to gracefully close the database connection pool
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
        });
    }
}
exports.DbService = DbService;
