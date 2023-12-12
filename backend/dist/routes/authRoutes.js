"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
// Import necessary modules and dependencies
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
// Create an Express router
const router = express_1.default.Router();
// Route for user login
router.post("/login", passport_1.default.authenticate("local"), // Use Passport middleware for local authentication
(req, res, next) => {
    if (req.user) {
        // If authentication succeeds, log in the user
        req.logIn(req.user, function (error) {
            if (error)
                return next(error);
            console.log("Successfully login");
            res.json({ message: "Login successful", user: req.user });
        });
    }
    else {
        // If authentication fails, send an error response
        res.status(401).json("An error occurred when logging in");
    }
});
// Route to check user session
router.get("/session", (req, res) => {
    console.log("Checking session");
    if (req.isAuthenticated()) {
        // If user is authenticated, return user information
        res.json(req.user);
    }
    else {
        // If user is not authenticated, send an unauthorized response
        res.status(401).json("Unauthorized");
    }
});
// Route for user logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        res.status(201).json("Successfully logged out.");
    });
});
// Route to access user profile (protected route)
router.get("/profile", isAuthenticated, (req, res) => {
    // This route is protected and only accessible to authenticated users
    res.json({ message: "Profile page", user: req.user });
});
// Middleware function to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // If the user is authenticated, call the next middleware
        return next();
    }
    // If the user is not authenticated, send an unauthorized response
    res.status(401).json({ message: "Unauthorized" });
}
exports.isAuthenticated = isAuthenticated;
// Export the router for use in other parts of the application
exports.default = router;
