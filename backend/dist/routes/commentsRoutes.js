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
// src/routes/commentRoutes.ts
const express_1 = __importDefault(require("express"));
const db_service_1 = require("./../services/db-service");
const authRoutes_1 = require("./authRoutes");
const router = express_1.default.Router();
const db = new db_service_1.DbService();
// POST - Create a new comment
router.post("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { objectiveId, employeeId, content } = req.body;
    if (!objectiveId || !employeeId || !content) {
        return res.status(500).send("Please provide all elements");
    }
    try {
        const result = yield db.query("INSERT INTO comments (objectiveId, employeeId, content) VALUES (?, ?, ?)", [objectiveId, employeeId, content]);
        return res.status(201).json({
            message: "Comment created",
            id: result.insertId,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Error creating the comment");
    }
}));
// GET - Retrieve all comments
router.get("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db.query("SELECT * FROM comments ORDER BY updatedAt DESC");
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).send("Error retrieving comments");
    }
}));
// GET - Retrieve a specific comment by ID
router.get("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [rows] = yield db.query("SELECT * FROM comments WHERE commentId = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).send("Error retrieving the comment");
    }
}));
// PUT - Update a comment
router.put("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const result = yield db.query("UPDATE comments SET content = ? WHERE commentId = ?", [content, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).send("Comment updated");
    }
    catch (error) {
        res.status(500).send("Error updating the comment");
    }
}));
// DELETE - Delete a comment
router.delete("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db.query("DELETE FROM comments WHERE commentId = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).send("Comment deleted");
    }
    catch (error) {
        res.status(500).send("Error deleting the comment");
    }
}));
exports.default = router;
