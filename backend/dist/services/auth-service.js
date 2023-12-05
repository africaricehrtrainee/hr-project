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
// src/services/auth-service.ts
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
class LocalStrategy extends passport_local_1.Strategy {
    constructor(dbService) {
        super({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
            console.log("Login attempt");
            this.dbService = dbService;
            try {
                if (!email || !password) {
                    return done(null, false, {
                        message: "Please provide credentials",
                    });
                }
                const [user] = yield this.dbService.query("SELECT * FROM employees WHERE email = ? AND deletedAt IS NULL", [email]);
                if (!user) {
                    return done(null, false, {
                        message: "This account does not exist.",
                    });
                }
                const res = yield bcrypt_1.default.compare(password, user.password);
                if (!res) {
                    return done(null, false, {
                        message: "Invalid passwordd",
                    });
                }
                console.log(res);
                return done(null, user);
            }
            catch (error) {
                return done(error);
            }
        }));
    }
}
exports.LocalStrategy = LocalStrategy;
