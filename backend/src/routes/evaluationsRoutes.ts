// src/routes/evaluations.js
import express from "express";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";
// Ensure you have a DB configuration file

const db = new DbService();
const router = express.Router();

// POST - Create a new evaluation
router.post("/", isAuthenticated, async (req, res) => {
    const { employeeId, evaluationYear, managerId } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO evaluations (employeeId, evaluationYear, managerId) VALUES (?, ?, ?)",
            [employeeId, evaluationYear, managerId]
        );
        res.status(201).json({
            message: "Evaluation created",
            id: result.insertId,
        });
    } catch (error) {
        res.status(500).send("Error creating the evaluation");
    }
});

// GET - Retrieve all evaluations
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM evaluations");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send("Error retrieving evaluations");
    }
});

// GET - Retrieve a specific evaluation by ID
router.get("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM evaluations WHERE evaluationId = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).send("Evaluation not found");
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send("Error retrieving the evaluation");
    }
});

// PUT - Update an evaluation
router.put("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { employeeId, evaluationYear, managerId } = req.body;
    try {
        const result = await db.query(
            "UPDATE evaluations SET employeeId = ?, evaluationYear = ?, managerId = ? WHERE evaluationId = ?",
            [employeeId, evaluationYear, managerId, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Evaluation not found");
        }
        res.status(200).send("Evaluation updated");
    } catch (error) {
        res.status(500).send("Error updating the evaluation");
    }
});

// DELETE - Delete an evaluation
router.delete("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "DELETE FROM evaluations WHERE evaluationId = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Evaluation not found");
        }
        res.status(200).send("Evaluation deleted");
    } catch (error) {
        res.status(500).send("Error deleting the evaluation");
    }
});

export default router;
