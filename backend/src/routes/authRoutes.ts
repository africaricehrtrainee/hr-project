// src/routes/authRoutes.ts
import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

const router = express.Router();

router.post(
    "/login",
    passport.authenticate("local"),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.user) {
            req.logIn(req.user, function (error) {
                if (error) return next(error);
                console.log("Successfully login");
                res.json({ message: "Login successful", user: req.user });
            });
        } else {
            res.status(401).json("An error occured when logging in");
        }
    }
);

router.get("/session", (req: Request, res: Response) => {
    console.log("sessioning");
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json("Unauthorized");
    }
});

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: any) => {
        if (err) return next(err);
        res.status(201).json("Succesfully logged out.");
    });
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
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({ message: "Unauthorized" });
}
