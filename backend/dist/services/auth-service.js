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
exports.LocalStrategy = void 0;
// Import necessary modules and dependencies
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Define a custom LocalStrategy class that extends Passport's Strategy
class LocalStrategy extends passport_local_1.Strategy {
    // Constructor for the LocalStrategy class
    constructor(dbService) {
        // Call the constructor of Passport's Strategy class
        super({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
            console.log("Login attempt");
            this.dbService = dbService;
            try {
                // Check if email or password is missing
                if (!email || !password) {
                    return done(null, false, {
                        message: "Please provide credentials",
                    });
                }
                // Query the database to find a user with the given email (while ensuring they are not deleted)
                const [user] = yield this.dbService.query("SELECT * FROM employees WHERE email = ? AND deletedAt IS NULL", [email]);
                // If no user is found, return an error
                if (!user) {
                    return done(null, false, {
                        message: "This account does not exist.",
                    });
                }
                // Compare the provided password with the hashed password stored in the database
                const res = yield bcrypt_1.default.compare(password, user.password);
                // If the password doesn't match, return an error
                if (!res) {
                    return done(null, false, {
                        message: "Invalid password",
                    });
                }
                console.log(res);
                // If authentication is successful, return the user object
                return done(null, user);
            }
            catch (error) {
                // Handle any errors that occur during authentication
                return done(error);
            }
        }));
    }
}
exports.LocalStrategy = LocalStrategy;
