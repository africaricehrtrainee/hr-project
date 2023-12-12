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
exports.ExpressServer = void 0;
// Import necessary modules and dependencies
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const auth_service_1 = require("./auth-service");
const employeesRoutes_1 = __importDefault(require("../routes/employeesRoutes"));
const commentsRoutes_1 = __importDefault(require("../routes/commentsRoutes"));
const evaluationsRoutes_1 = __importDefault(require("../routes/evaluationsRoutes"));
const objectivesRoutes_1 = __importDefault(require("../routes/objectivesRoutes"));
const positionsRoutes_1 = __importDefault(require("../routes/positionsRoutes"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const db_service_1 = require("./db-service");
// Define a class named ExpressServer
class ExpressServer {
    constructor(port) {
        // Create an Express application
        this.app = (0, express_1.default)();
        this.PORT = port;
        // Initialize the DbService for database interactions
        this.dbService = new db_service_1.DbService();
        // Configure middleware and routes
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        // Use middleware for request logging (Morgan)
        this.app.use((0, morgan_1.default)("dev"));
        // Enable JSON request body parsing
        this.app.use(express_1.default.json());
        // Enable URL-encoded request body parsing
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Configure CORS (Cross-Origin Resource Sharing)
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:3000", // Specify the allowed origin for CORS
            credentials: true,
        }));
        // Configure session management with Express session
        this.app.use((0, express_session_1.default)({
            secret: "your-secret-key", // Secret key for session management
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 3600000, secure: false }, // Session cookie settings
        }));
        // Initialize and configure Passport.js for authentication
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        // Use a custom LocalStrategy for Passport.js authentication
        passport_1.default.use(new auth_service_1.LocalStrategy(this.dbService));
        // Serialize and deserialize user data for session management
        passport_1.default.serializeUser((employee, done) => done(null, employee.employeeId));
        passport_1.default.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbService.query("SELECT * FROM employees WHERE employeeId = ? AND deletedAt IS NULL", [id]);
                if (!result[0]) {
                    done(null, false);
                }
                else {
                    done(null, result[0]);
                }
            }
            catch (err) {
                done(err);
            }
        }));
    }
    configureRoutes() {
        // Define and use various API routes
        this.app.use("/api/employees", employeesRoutes_1.default);
        this.app.use("/api/comments", commentsRoutes_1.default);
        this.app.use("/api/evaluations", evaluationsRoutes_1.default);
        this.app.use("/api/objectives", objectivesRoutes_1.default);
        this.app.use("/api/positions", positionsRoutes_1.default);
        this.app.use("/api/auth", authRoutes_1.default);
    }
    start() {
        // Start the Express application and listen on the specified port
        this.app.listen(this.PORT, () => {
            console.log(`API server is running on http://localhost:${this.PORT}`);
        });
    }
}
exports.ExpressServer = ExpressServer;
