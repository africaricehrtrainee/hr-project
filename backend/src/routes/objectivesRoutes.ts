// src/routes/objectives.js
import express, { Request, Response, NextFunction } from "express";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";

const router = express.Router();
const dbService = new DbService();

// POST - Create a new objective
router.post("/", isAuthenticated, async (req, res) => {
    const {
        evaluationId,
        title,
        description,
        successConditions,
        deadline,
        kpi,
        efficiency,
        competency,
        commitment,
        initiative,
        respect,
        leadership,
    } = req.body;
    try {
        const result = await dbService.query(
            "INSERT INTO objectives (evaluationId, title, description, successConditions, deadline, kpi, efficiency, competency, commitment, initiative, respect, leadership) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                evaluationId,
                title,
                description,
                successConditions,
                deadline,
                kpi,
                efficiency,
                competency,
                commitment,
                initiative,
                respect,
                leadership,
            ]
        );
        res.status(201).json({
            message: "Objective created",
            id: result.insertId,
        });
    } catch (error) {
        res.status(500).send("Error creating the objective");
    }
});

// GET - Retrieve all objectives
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const [rows] = await dbService.query("SELECT * FROM objectives");
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send("Error retrieving objectives");
    }
});

// GET - Retrieve a specific objective by ID
router.get("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await dbService.query(
            "SELECT * FROM objectives WHERE objectiveId = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).send("Objective not found");
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send("Error retrieving the objective");
    }
});

// PUT - Update an objective
router.put("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        successConditions,
        deadline,
        kpi,
        efficiency,
        competency,
        commitment,
        initiative,
        respect,
        leadership,
    } = req.body;
    try {
        const result = await dbService.query(
            "UPDATE objectives SET title = ?, description = ?, successConditions = ?, deadline = ?, kpi = ?, efficiency = ?, competency = ?, commitment = ?, initiative = ?, respect = ?, leadership = ? WHERE objectiveId = ?",
            [
                title,
                description,
                successConditions,
                deadline,
                kpi,
                efficiency,
                competency,
                commitment,
                initiative,
                respect,
                leadership,
                id,
            ]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Objective not found");
        }
        res.status(200).send("Objective updated");
    } catch (error) {
        res.status(500).send("Error updating the objective");
    }
});

// DELETE - Delete an objective
router.delete("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbService.query(
            "DELETE FROM objectives WHERE objectiveId = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Objective not found");
        }
        res.status(200).send("Objective deleted");
    } catch (error) {
        res.status(500).send("Error deleting the objective");
    }
});

export default router;
