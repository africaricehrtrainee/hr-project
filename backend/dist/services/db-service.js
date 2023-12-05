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
const promise_1 = __importDefault(require("mysql2/promise"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class DbService {
    constructor() {
        this.pool = promise_1.default.createPool({
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
    query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.execute(sql, params);
            return rows;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlFilePath = path_1.default.join(__dirname, "..", "..", "sql", "init.sql");
            try {
                const fileContent = fs_1.default.readFileSync(sqlFilePath, "utf8");
                const queries = fileContent
                    .split(";")
                    .filter((query) => query.trim() !== "");
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
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
        });
    }
}
exports.DbService = DbService;
