// src/routes/positionsRoutes.ts
import express from "express";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";

const router = express.Router();
const db = new DbService();

// POST - Create a new position
router.post("/", isAuthenticated, async (req, res) => {
    try {
        const { name, holderId, supervisorId } = req.body;

        // Check if required fields are provided
        if (!name) {
            return res.status(400).json("Please provide a position name.");
        }

        // Insert a new position into the positions table
        const result = await db.query(
            "INSERT INTO positions (name, holderId, supervisorId) VALUES (?, ?, ?)",
            [name, holderId, supervisorId]
        );

        return res.status(201).json({
            message: "Position created",
            roleId: result.insertId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET - Retrieve all positions
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const positions = await db.query(
            "SELECT * FROM positions LEFT JOIN employees on employees.employeeId = positions.holderId"
        );

        res.status(200).json(positions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET - Retrieve a specific position by roleId
router.get("/:roleId", isAuthenticated, async (req, res) => {
    const { roleId } = req.params;

    try {
        const [position] = await db.query(
            "SELECT * FROM positions WHERE roleId = ?",
            [roleId]
        );

        if (!position) {
            return res.status(404).json({ error: "Position not found" });
        }

        res.status(200).json(position);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT - Update a position by roleId
router.put("/:roleId", isAuthenticated, async (req, res) => {
    const { roleId } = req.params;
    const { name, holderId, supervisorId } = req.body;

    try {
        const result = await db.query(
            "UPDATE positions SET name = ?, holderId = ?, supervisorId = ? WHERE roleId = ?",
            [name, holderId, supervisorId, roleId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Position not found" });
        }

        res.status(200).json({ message: "Position updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE - Delete a position by roleId
router.delete("/:roleId", isAuthenticated, async (req, res) => {
    const { roleId } = req.params;

    try {
        const result = await db.query(
            "DELETE FROM positions WHERE roleId = ?",
            [roleId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Position not found" });
        }

        res.status(200).json({ message: "Position deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
