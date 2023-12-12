// src/routes/employeesRoutes.ts
import bcrypt from "bcrypt";
import express from "express";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";
import { keygen } from "./util/utils";

const router = express.Router();
const dbService = new DbService();

// Route : api/employees
// Create a new employee
router.post("/", isAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email ?? null;
        const firstName = req.body.firstName ?? null;
        const lastName = req.body.lastName ?? null;
        const matricule = req.body.matricule ?? null;
        const role = req.body.role ?? null;

        if (!email) {
            return res.status(400).json("Please include an email address");
        }

        const pass = keygen();
        console.log(pass);
        const hash = await bcrypt.hash(pass, 10);

        const result = await dbService.query(
            "INSERT INTO employees (email, firstName, lastName, password, matricule, role) VALUES (?, ?, ?, ?, ?, ?)",
            [email, firstName, lastName, hash, matricule, role]
        );

        console.log(result);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all employees
router.get("/", isAuthenticated, async (req, res) => {
    try {
        let query;
        if (req.query.all) {
            // Fetch all employees, including soft deletes
            query =
                "SELECT email, firstName, lastName, matricule, employeeId, deletedAt, role FROM employees ORDER BY lastName ASC";
        } else {
            // Fetch only non-deleted employees
            query =
                "SELECT email, firstName, lastName, matricule, employeeId, role FROM employees WHERE deletedAt IS NULL";
        }

        const result = await dbService.query(query);
        const employees = result;
        res.status(201).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get a specific employee by ID
router.get("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbService.query(
            "SELECT * FROM employees WHERE employeeId = ?",
            [id]
        );
        const employee = result[0];
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(201).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/:id/objectives", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { objectives } = req.body;

        if (!objectives) {
            return res
                .status(400)
                .json("Please include an objective list in your request.");
        }

        const previous = await dbService.query(
            "SELECT * FROM objectives WHERE employeeId = ?",
            [id]
        );

        console.log(previous);

        const arr = previous.filter(
            (previousObjective: { objectiveId: any }) =>
                !objectives.some(
                    (objective: { objectiveId: any }) =>
                        objective.objectiveId == previousObjective.objectiveId
                )
        );

        if (arr.length > 0) {
            for (const el of arr) {
                const result = dbService.query(
                    "DELETE FROM objectives WHERE objectiveId = ?",
                    [el.objectiveId]
                );
            }
        }

        for (const objective of objectives) {
            // Getting the objective contents
            const objectiveId = objective.objectiveId;
            const title = objective.title ?? null;
            const status = objective.status ?? null;
            const description = objective.description ?? null;
            const successConditions = objective.successConditions ?? null;
            const deadline = objective.deadline ?? null;
            const kpi = objective.kpi ?? null;
            const grade = objective.grade ?? null;
            const comment = objective.comment ?? null;

            // Find if objective already exists
            if (objectiveId) {
                const result = await dbService.query(
                    "UPDATE objectives SET title = ?, status = ?, description = ?, successConditions = ?, deadline = ?, kpi = ?, grade = ?, comment = ? WHERE objectiveId = ?",
                    [
                        title,
                        status,
                        description,
                        successConditions,
                        deadline,
                        kpi,
                        grade,
                        comment,
                        objectiveId,
                    ]
                );
                if (result) {
                } else {
                    res.status(500).json("Internal error occured");
                    break;
                }
            } else {
                const result = await dbService.query(
                    "INSERT INTO objectives (title, description, successConditions, deadline, kpi, grade, comment, employeeId) VALUES (?,?,?,?,?,?,?,?)",
                    [
                        title,
                        description,
                        successConditions,
                        deadline,
                        kpi,
                        grade,
                        comment,
                        id,
                    ]
                );
                if (result) {
                } else {
                    res.status(500).json("Internal error occured");
                    break;
                }
            }
        }
        res.status(201).json("Successfully updated objectives.");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/:id/evaluations", isAuthenticated, async (req, res) => {
    const { id } = req.params; // Get the employee ID from request params
    const {
        evaluationId,
        status,
        authorId,
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
    } = req.body;

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
        const result = await dbService.query(sqlQuery, [
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
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating or updating the evaluation");
    }
});

router.get("/:id/evaluations", isAuthenticated, async (req, res) => {
    const { id } = req.params; // Get the employee ID from request params

    try {
        // Define the SQL query to fetch evaluations for the specified employee
        const sqlQuery = `
            SELECT * FROM evaluations
            WHERE employeeId = ?
        `;

        // Execute the query
        const evaluations = await dbService.query(sqlQuery, [id]);
        console.log(evaluations);
        res.status(200).json(evaluations);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving evaluations");
    }
});

router.get("/:id/objectives", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await dbService.query(
            "SELECT * from objectives WHERE employeeId = ?",
            [id]
        );

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id/comments", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await dbService.query(
            "SELECT * from comments WHERE employeeId = ?",
            [id]
        );

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/:id/comments", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        if (
            !req.body.content ||
            !req.body.objectiveId ||
            !req.body.content ||
            !req.body.authorId
        ) {
            return res
                .status(400)
                .json("Please include a comment in your request.");
        }

        const result = await dbService.query(
            "INSERT INTO comments (employeeId, objectiveId, content, authorId) VALUES (?, ?, ?, ?)",
            [
                req.body.employeeId,
                req.body.objectiveId,
                req.body.content,
                req.body.authorId,
            ]
        );

        res.status(201).json("Successfully added comment.");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get supervisors for a specific employee by ID
router.get("/:id/supervisors", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbService.query(
            "SELECT profile.employeeId as employeeId, profile.firstName as firstName, profile.lastName as lastName, employee.name as employeeRoleName, supervisor.holderId as supervisorId, supervisorProfile.firstName as supervisorFirstName, supervisorProfile.lastName as supervisorLastName, manager.holderId as managerId, managerProfile.firstName as managerFirstName, managerProfile.lastName as managerLastName FROM positions employee JOIN employees profile on profile.employeeId = employee.holderId LEFT JOIN positions supervisor on employee.supervisorId = supervisor.roleId LEFT JOIN employees supervisorProfile on supervisor.holderId = supervisorProfile.employeeId LEFT JOIN positions manager on manager.roleId = supervisor.supervisorId LEFT JOIN employees managerProfile on manager.holderId = managerProfile.employeeId WHERE profile.employeeId = ?",
            [id]
        );
        const employee = result[0];
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(201).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get supervisees for a specific employee by ID
router.get("/:id/supervisees", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbService.query(
            "SELECT roleId, holderId, name, matricule, firstName, lastName FROM positions JOIN employees ON employees.employeeId = positions.holderId WHERE supervisorId = (SELECT roleId FROM positions JOIN employees ON employees.employeeId = positions.holderId WHERE positions.holderId = ?)",
            [id]
        );

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Partially Update Employee Route (HTTP PATCH)
router.patch("/:id", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        // Fetch the existing employee record from the database
        const existingEmployee = await dbService.query(
            "SELECT * FROM employees WHERE employeeId = ?",
            [id]
        );

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
        await dbService.query(
            `UPDATE employees SET ${setClause} WHERE employeeId = ?`,
            [...setValues, id]
        );

        return res.json({ message: "Employee updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Partially Update Employee Route (HTTP PATCH)
router.delete("/:id/password", isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the existing employee record from the database
        const existingEmployee = await dbService.query(
            "SELECT * FROM employees WHERE employeeId = ?",
            [id]
        );
        const pass = keygen();
        console.log(pass);
        if (!existingEmployee || existingEmployee.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const hash = await bcrypt.hash(pass, 10);

        // Update the employee record in the database
        await dbService.query(
            `UPDATE employees SET password = ? WHERE employeeId = ?`,
            [hash, id]
        );
        res.json({ message: "Employee updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete an employee by ID
router.delete("/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbService.query(
            "UPDATE employees SET deletedAt = now() WHERE employeeId = ?",
            [id]
        );

        if (!result) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
