// src/routes/authRoutes.ts
import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

const router = express.Router();

router.post(
    "/login",
    passport.authenticate("local"),
    (req: Request, res: Response) => {
        res.json({ message: "Login successful", user: req.user });
    }
);

router.get("/session", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(500).json("Unauthorized");
    }
});

router.get("/logout", (req: Request, res: Response) => {
    req.logout((err: any) => res.status(401).json("An error occured: " + err));
    res.json({ message: "Logout successful" });
});

router.get("/profile", isAuthenticated, (req: Request, res: Response) => {
    res.json({ message: "Profile page", user: req.user });
});

export default router;

// Middleware to check if the user is authenticated
export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({ message: "Unauthorized" });
}
