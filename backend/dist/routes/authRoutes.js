"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
// src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.post("/login", passport_1.default.authenticate("local"), (req, res, next) => {
    if (req.user) {
        req.logIn(req.user, function (error) {
            if (error)
                return next(error);
            console.log("Successfully login");
            res.json({ message: "Login successful", user: req.user });
        });
    }
    else {
        res.status(401).json("An error occured when logging in");
    }
});
router.get("/session", (req, res) => {
    console.log("sessioning");
    if (req.isAuthenticated()) {
        res.json(req.user);
    }
    else {
        res.status(401).json("Unauthorized");
    }
});
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        res.status(201).json("Succesfully logged out.");
    });
});
router.get("/profile", isAuthenticated, (req, res) => {
    res.json({ message: "Profile page", user: req.user });
});
exports.default = router;
// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
}
exports.isAuthenticated = isAuthenticated;
