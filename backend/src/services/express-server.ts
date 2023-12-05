import { DbService } from "./db-service";
// src/services/express-server.ts
import express, { Application } from "express";
import session from "express-session";
import passport from "passport";
import { LocalStrategy } from "./auth-service";
import employeesRoutes from "../routes/employeesRoutes";
import commentsRoutes from "../routes/commentsRoutes";
import evaluationsRoutes from "../routes/evaluationsRoutes";
import objectivesRoutes from "../routes/objectivesRoutes";
import authRoutes from "../routes/authRoutes";
import morgan from "morgan";
import cors from "cors";

export class ExpressServer {
    private app: Application;
    private PORT: number;
    private dbService: DbService;

    constructor(port: number) {
        this.app = express();
        this.PORT = port;
        this.dbService = new DbService();

        this.configureMiddleware();
        this.configureRoutes();
    }

    private configureMiddleware(): void {
        this.app.use(morgan("dev"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(
            cors({
                origin: "http://localhost:3000",
                credentials: true,
            })
        );
        this.app.use(
            session({
                secret: "your-secret-key",
                resave: false,
                saveUninitialized: false,
                cookie: { maxAge: 3600000, secure: false },
            })
        );

        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passport.use(new LocalStrategy(this.dbService));

        passport.serializeUser((employee: any, done) =>
            done(null, employee.employeeId)
        );
        passport.deserializeUser(async (id, done) => {
            try {
                const result = await this.dbService.query(
                    "SELECT * FROM employees WHERE employeeId = ? AND deletedAt IS NULL",
                    [id]
                );
                if (!result[0]) {
                    done(null, false);
                } else {
                    done(null, result[0]);
                }
            } catch (err) {
                done(err);
            }
        });
    }

    private configureRoutes(): void {
        // this.app.use((req, res, next) => {
        //     setTimeout(() => {
        //         next();
        //     }, 2000);
        // });
        this.app.use("/api/employees", employeesRoutes);
        this.app.use("/api/comments", commentsRoutes);
        this.app.use("/api/evaluations", evaluationsRoutes);
        this.app.use("/api/objectives", objectivesRoutes);
        this.app.use("/api/auth", authRoutes);
    }

    public start(): void {
        this.app.listen(this.PORT, () => {
            console.log(
                `API server is running on http://localhost:${this.PORT}`
            );
        });
    }
}
