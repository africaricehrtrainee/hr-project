// src/routes/comments.js
import express from "express";
import { DbService } from "./../services/db-service";
import { isAuthenticated } from "./authRoutes";

const router = express.Router();
const db = new DbService();

// POST - Create a new comment
router.post("/", isAuthenticated, async (req, res) => {
    const { objectiveId, employeeId, content } = req.body;
    if (!objectiveId || !employeeId || !content) {
        return res.status(500).send("Please provide all elements");
    }
    try {
        const result = await db.query(
            "INSERT INTO comments (objectiveId, employeeId, content) VALUES (?, ?, ?)",
            [objectiveId, employeeId, content]
        );
        return res.status(201).json({
            message: "Comment created",
            id: result.insertId,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error creating the comment");
    }
});

// GET - Retrieve all comments
router.get("/", isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM comments ORDER BY updatedAt DESC"
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).send("Error retrieving comments");
    }
});

// GET - Retrieve a specific comment by ID
router.get("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM comments WHERE commentId = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).send("Error retrieving the comment");
    }
});

// PUT - Update a comment
router.put("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const result = await db.query(
            "UPDATE comments SET content = ? WHERE commentId = ?",
            [content, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).send("Comment updated");
    } catch (error) {
        res.status(500).send("Error updating the comment");
    }
});

// DELETE - Delete a comment
router.delete("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            "DELETE FROM comments WHERE commentId = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).send("Comment deleted");
    } catch (error) {
        res.status(500).send("Error deleting the comment");
    }
});

export default router;
