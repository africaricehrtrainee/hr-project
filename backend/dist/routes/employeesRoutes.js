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
// src/routes/employeesRoutes.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const db_service_1 = require("../services/db-service");
const authRoutes_1 = require("./authRoutes");
const utils_1 = require("./util/utils");
const router = express_1.default.Router();
const dbService = new db_service_1.DbService();
// Route : api/employees
// Create a new employee
router.post("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        console.log(req.body);
        const email = (_a = req.body.email) !== null && _a !== void 0 ? _a : null;
        const firstName = (_b = req.body.firstName) !== null && _b !== void 0 ? _b : null;
        const lastName = (_c = req.body.lastName) !== null && _c !== void 0 ? _c : null;
        const matricule = (_d = req.body.matricule) !== null && _d !== void 0 ? _d : null;
        const role = (_e = req.body.role) !== null && _e !== void 0 ? _e : null;
        if (!email) {
            return res.status(400).json("Please include an email address");
        }
        const pass = (0, utils_1.keygen)();
        console.log(pass);
        const hash = yield bcrypt_1.default.hash(pass, 10);
        const result = yield dbService.query("INSERT INTO employees (email, firstName, lastName, password, matricule, role) VALUES (?, ?, ?, ?, ?, ?)", [email, firstName, lastName, hash, matricule, role]);
        console.log(result);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// Get all employees
router.get("/", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query;
        if (req.query.all) {
            // Fetch all employees, including soft deletes
            query =
                "SELECT email, firstName, lastName, matricule, employeeId, deletedAt, role FROM employees ORDER BY lastName ASC";
        }
        else {
            // Fetch only non-deleted employees
            query =
                "SELECT email, firstName, lastName, matricule, employeeId, role FROM employees WHERE deletedAt IS NULL";
        }
        const result = yield dbService.query(query);
        const employees = result;
        res.status(201).json(employees);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// Get a specific employee by ID
router.get("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield dbService.query("SELECT * FROM employees WHERE employeeId = ?", [id]);
        const employee = result[0];
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(201).json(employee);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/:id/objectives", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j, _k, _l, _m, _o;
    try {
        const { id } = req.params;
        const { objectives } = req.body;
        if (!objectives) {
            return res
                .status(400)
                .json("Please include an objective list in your request.");
        }
        const previous = yield dbService.query("SELECT * FROM objectives WHERE employeeId = ?", [id]);
        console.log(previous);
        const arr = previous.filter((previousObjective) => !objectives.some((objective) => objective.objectiveId == previousObjective.objectiveId));
        if (arr.length > 0) {
            for (const el of arr) {
                const result = dbService.query("DELETE FROM objectives WHERE objectiveId = ?", [el.objectiveId]);
            }
        }
        for (const objective of objectives) {
            // Getting the objective contents
            const objectiveId = objective.objectiveId;
            const title = (_f = objective.title) !== null && _f !== void 0 ? _f : null;
            const status = (_g = objective.status) !== null && _g !== void 0 ? _g : null;
            const description = (_h = objective.description) !== null && _h !== void 0 ? _h : null;
            const successConditions = (_j = objective.successConditions) !== null && _j !== void 0 ? _j : null;
            const deadline = (_k = objective.deadline) !== null && _k !== void 0 ? _k : null;
            const kpi = (_l = objective.kpi) !== null && _l !== void 0 ? _l : null;
            const grade = (_m = objective.grade) !== null && _m !== void 0 ? _m : null;
            const comment = (_o = objective.comment) !== null && _o !== void 0 ? _o : null;
            // Find if objective already exists
            if (objectiveId) {
                const result = yield dbService.query("UPDATE objectives SET title = ?, status = ?, description = ?, successConditions = ?, deadline = ?, kpi = ?, grade = ?, comment = ? WHERE objectiveId = ?", [
                    title,
                    status,
                    description,
                    successConditions,
                    deadline,
                    kpi,
                    grade,
                    comment,
                    objectiveId,
                ]);
                if (result) {
                }
                else {
                    res.status(500).json("Internal error occured");
                    break;
                }
            }
            else {
                const result = yield dbService.query("INSERT INTO objectives (title, description, successConditions, deadline, kpi, grade, comment, employeeId) VALUES (?,?,?,?,?,?,?,?)", [
                    title,
                    description,
                    successConditions,
                    deadline,
                    kpi,
                    grade,
                    comment,
                    id,
                ]);
                if (result) {
                }
                else {
                    res.status(500).json("Internal error occured");
                    break;
                }
            }
        }
        res.status(201).json("Successfully updated objectives.");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/:id/evaluations", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the employee ID from request params
    const { evaluationId, status, authorId, evaluationYear, efficiency, efficiencyRating, competency, competencyRating, commitment, commitmentRating, initiative, initiativeRating, respect, respectRating, leadership, leadershipRating, } = req.body;
    try {
        // Define the SQL query using INSERT ... ON DUPLICATE KEY UPDATE
        const sqlQuery = `
            INSERT INTO evaluations (
                evaluationId,
                status,
                authorId,
                employeeId,
                evaluationYear,
                updatedAt,
                createdAt,
                efficiency,
                efficiencyRating,
                competency,
                competencyRating,
                commitment,
                commitmentRating,
                initiative,
                initiativeRating,
                respect,
                respectRating,
                leadership,
                leadershipRating
            ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                authorId = VALUES(authorId),
                evaluationYear = VALUES(evaluationYear),
                updatedAt = CURRENT_TIMESTAMP,
                efficiency = VALUES(efficiency),
                efficiencyRating = VALUES(efficiencyRating),
                competency = VALUES(competency),
                competencyRating = VALUES(competencyRating),
                commitment = VALUES(commitment),
                commitmentRating = VALUES(commitmentRating),
                initiative = VALUES(initiative),
                initiativeRating = VALUES(initiativeRating),
                respect = VALUES(respect),
                respectRating = VALUES(respectRating),
                leadership = VALUES(leadership),
                leadershipRating = VALUES(leadershipRating)
        `;
        // Execute the query
        const result = yield dbService.query(sqlQuery, [
            evaluationId,
            status,
            authorId,
            id, // Use the employee ID from request params
            evaluationYear,
            efficiency,
            efficiencyRating,
            competency,
            competencyRating,
            commitment,
            commitmentRating,
            initiative,
            initiativeRating,
            respect,
            respectRating,
            leadership,
            leadershipRating,
        ]);
        res.status(201).json({
            message: "Evaluation created or updated",
            id: result.insertId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error creating or updating the evaluation");
    }
}));
router.get("/:id/evaluations", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Get the employee ID from request params
    try {
        // Define the SQL query to fetch evaluations for the specified employee
        const sqlQuery = `
            SELECT * FROM evaluations
            WHERE employeeId = ?
        `;
        // Execute the query
        const evaluations = yield dbService.query(sqlQuery, [id]);
        console.log(evaluations);
        res.status(200).json(evaluations);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving evaluations");
    }
}));
router.get("/:id/objectives", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield dbService.query("SELECT * from objectives WHERE employeeId = ?", [id]);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.get("/:id/comments", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield dbService.query("SELECT * from comments WHERE employeeId = ?", [id]);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
router.post("/:id/comments", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!req.body.content ||
            !req.body.objectiveId ||
            !req.body.content ||
            !req.body.authorId) {
            return res
                .status(400)
                .json("Please include a comment in your request.");
        }
        const result = yield dbService.query("INSERT INTO comments (employeeId, objectiveId, content, authorId) VALUES (?, ?, ?, ?)", [
            req.body.employeeId,
            req.body.objectiveId,
            req.body.content,
            req.body.authorId,
        ]);
        res.status(201).json("Successfully added comment.");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// Get supervisors for a specific employee by ID
router.get("/:id/supervisors", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield dbService.query("SELECT profile.employeeId as employeeId, profile.firstName as firstName, profile.lastName as lastName, employee.name as employeeRoleName, supervisor.holderId as supervisorId, supervisorProfile.firstName as supervisorFirstName, supervisorProfile.lastName as supervisorLastName, manager.holderId as managerId, managerProfile.firstName as managerFirstName, managerProfile.lastName as managerLastName FROM positions employee JOIN employees profile on profile.employeeId = employee.holderId LEFT JOIN positions supervisor on employee.supervisorId = supervisor.roleId LEFT JOIN employees supervisorProfile on supervisor.holderId = supervisorProfile.employeeId LEFT JOIN positions manager on manager.roleId = supervisor.supervisorId LEFT JOIN employees managerProfile on manager.holderId = managerProfile.employeeId WHERE profile.employeeId = ?", [id]);
        const employee = result[0];
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(201).json(employee);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// Get supervisees for a specific employee by ID
router.get("/:id/supervisees", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield dbService.query("SELECT roleId, holderId, name, matricule, firstName, lastName FROM positions JOIN employees ON employees.employeeId = positions.holderId WHERE supervisorId = (SELECT roleId FROM positions JOIN employees ON employees.employeeId = positions.holderId WHERE positions.holderId = ?)", [id]);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// Partially Update Employee Route (HTTP PATCH)
router.patch("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        // Fetch the existing employee record from the database
        const existingEmployee = yield dbService.query("SELECT * FROM employees WHERE employeeId = ?", [id]);
        if (!existingEmployee || existingEmployee.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        // Generate the SET clause for the SQL query based on the keys in updatedFields
        const setClause = Object.keys(updatedFields)
            .map((key) => {
            return `${key} = ?`;
        })
            .join(", ");
        // Create an array of values for the SET clause
        const setValues = Object.values(updatedFields);
        // Update the employee record in the database
        yield dbService.query(`UPDATE employees SET ${setClause} WHERE employeeId = ?`, [...setValues, id]);
        return res.json({ message: "Employee updated successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
// Partially Update Employee Route (HTTP PATCH)
router.delete("/:id/password", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Fetch the existing employee record from the database
        const existingEmployee = yield dbService.query("SELECT * FROM employees WHERE employeeId = ?", [id]);
        const pass = (0, utils_1.keygen)();
        console.log(pass);
        if (!existingEmployee || existingEmployee.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const hash = yield bcrypt_1.default.hash(pass, 10);
        // Update the employee record in the database
        yield dbService.query(`UPDATE employees SET password = ? WHERE employeeId = ?`, [hash, id]);
        res.json({ message: "Employee updated successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
// Delete an employee by ID
router.delete("/:id", authRoutes_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield dbService.query("UPDATE employees SET deletedAt = now() WHERE employeeId = ?", [id]);
        if (!result) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
