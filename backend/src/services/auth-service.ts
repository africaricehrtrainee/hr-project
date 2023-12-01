// src/services/auth-service.ts
import passportLocal, { Strategy } from "passport-local";
import { DbService } from "./db-service";
import bcrypt from "bcrypt";

export class LocalStrategy extends Strategy {
    private dbService!: DbService;

    constructor(dbService: DbService) {
        super(
            { usernameField: "email", passwordField: "password" },
            async (email, password, done) => {
                this.dbService = dbService;
                try {
                    if (!email || !password) {
                        return done(null, false, {
                            message: "Please provide credentials",
                        });
                    }

                    const [user] = await this.dbService.query(
                        "SELECT * FROM employees WHERE email = ? AND deletedAt IS NULL",
                        [email]
                    );

                    if (!user) {
                        return done(null, false, {
                            message: "This account does not exist.",
                        });
                    }

                    const res = await bcrypt.compare(password, user.password);

                    if (!res) {
                        return done(null, false, {
                            message: "Invalid passwordd",
                        });
                    }

                    console.log(res);

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        );
    }
}
