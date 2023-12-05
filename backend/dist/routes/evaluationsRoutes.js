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
// src/routes/evaluations.js
const express_1 = __importDefault(require("express"));
const db_service_1 = require("../services/db-service");
const authRoutes_1 = require("./authRoutes");
// Ensure you have a DB configuration file
const db = new db_service_1.DbService();
const router = express_1.default.Router();
// POST - Create a new evaluation
router.post("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId, evaluationYear, managerId } = req.body;
    try {
        const result = yield db.query("INSERT INTO evaluations (employeeId, evaluationYear, managerId) VALUES (?, ?, ?)", [employeeId, evaluationYear, managerId]);
        res.status(201).json({
            message: "Evaluation created",
            id: result.insertId,
        });
    }
    catch (error) {
        res.status(500).send("Error creating the evaluation");
    }
}));
// GET - Retrieve all evaluations
router.get("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db.query("SELECT * FROM evaluations");
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).send("Error retrieving evaluations");
    }
}));
// GET - Retrieve a specific evaluation by ID
router.get("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [rows] = yield db.query("SELECT * FROM evaluations WHERE evaluationId = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Evaluation not found");
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).send("Error retrieving the evaluation");
    }
}));
// PUT - Update an evaluation
router.put("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { employeeId, evaluationYear, managerId } = req.body;
    try {
        const result = yield db.query("UPDATE evaluations SET employeeId = ?, evaluationYear = ?, managerId = ? WHERE evaluationId = ?", [employeeId, evaluationYear, managerId, id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Evaluation not found");
        }
        res.status(200).send("Evaluation updated");
    }
    catch (error) {
        res.status(500).send("Error updating the evaluation");
    }
}));
// DELETE - Delete an evaluation
router.delete("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db.query("DELETE FROM evaluations WHERE evaluationId = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Evaluation not found");
        }
        res.status(200).send("Evaluation deleted");
    }
    catch (error) {
        res.status(500).send("Error deleting the evaluation");
    }
}));
exports.default = router;
