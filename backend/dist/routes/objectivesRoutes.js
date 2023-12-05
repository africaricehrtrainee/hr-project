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
// src/routes/objectives.js
const express_1 = __importDefault(require("express"));
const db_service_1 = require("../services/db-service");
const authRoutes_1 = require("./authRoutes");
const router = express_1.default.Router();
const dbService = new db_service_1.DbService();
// POST - Create a new objective
router.post("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { evaluationId, title, description, successConditions, deadline, kpi, efficiency, competency, commitment, initiative, respect, leadership, } = req.body;
    try {
        const result = yield dbService.query("INSERT INTO objectives (evaluationId, title, description, successConditions, deadline, kpi, efficiency, competency, commitment, initiative, respect, leadership) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
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
        ]);
        res.status(201).json({
            message: "Objective created",
            id: result.insertId,
        });
    }
    catch (error) {
        res.status(500).send("Error creating the objective");
    }
}));
// GET - Retrieve all objectives
router.get("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield dbService.query("SELECT * FROM objectives");
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).send("Error retrieving objectives");
    }
}));
// GET - Retrieve a specific objective by ID
router.get("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [rows] = yield dbService.query("SELECT * FROM objectives WHERE objectiveId = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).send("Objective not found");
        }
        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).send("Error retrieving the objective");
    }
}));
// PUT - Update an objective
router.put("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, successConditions, deadline, kpi, efficiency, competency, commitment, initiative, respect, leadership, } = req.body;
    try {
        const result = yield dbService.query("UPDATE objectives SET title = ?, description = ?, successConditions = ?, deadline = ?, kpi = ?, efficiency = ?, competency = ?, commitment = ?, initiative = ?, respect = ?, leadership = ? WHERE objectiveId = ?", [
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
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Objective not found");
        }
        res.status(200).send("Objective updated");
    }
    catch (error) {
        res.status(500).send("Error updating the objective");
    }
}));
// DELETE - Delete an objective
router.delete("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield dbService.query("DELETE FROM objectives WHERE objectiveId = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Objective not found");
        }
        res.status(200).send("Objective deleted");
    }
    catch (error) {
        res.status(500).send("Error deleting the objective");
    }
}));
exports.default = router;
