import express from "express";
import fs from "fs";
import path from "path";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";
const dataFilePath = path.join(__dirname, "..", "..", "db", "steps.json");
const dbService = new DbService();

const router = express.Router();

// Define the Step interface
interface Step {
    name: string;
    deadline: string;
    message: string;
    active: boolean;
}

// Initialize the steps data from the JSON file
let steps: Step[] = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

// Endpoint to get all steps
router.get("/", async (req, res) => {
    try {
        const steps = await dbService.query("SELECT * FROM steps");

        res.status(200).json(steps);
    } catch (error) {
        res.status(500).send("Error retrieving the steps");
    }
});

// Endpoint to set the current step
// PUT - Update an objective
router.put("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { name, message, deadline } = req.body;
    try {
        const result = await dbService.query(
            "UPDATE steps SET name = ?, message = ?, deadline = ? WHERE stepId = ?",
            [name, message, deadline, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Step not found");
        }
        res.status(200).send("Step updated");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating the step");
    }
});

// Endpoint to set the current step
router.put("/:id/current", async (req, res) => {
    const stepId = req.params.id;

    // First, set all steps to inactive
    const results = await dbService.query("UPDATE steps SET active = false");

    // Then, set the specified step to active
    const actives = await dbService.query(
        "UPDATE steps SET active = true WHERE stepId = ?",
        [stepId]
    );
    res.send(`Step ${stepId} set to active.`);
});
export default router;
