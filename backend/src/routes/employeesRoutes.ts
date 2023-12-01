// src/routes/employeesRoutes.ts
import bcrypt from "bcrypt";
import express from "express";
import { DbService } from "../services/db-service";
import { isAuthenticated } from "./authRoutes";
import { keygen } from "./util/utils";
import { Comment, Objective } from "../global";

const router = express.Router();
const dbService = new DbService();

// Route : api/employees
// Create a new employee
router.post("/", async (req, res) => {
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

router.post("/:id/objectives", async (req, res) => {
    try {
        const { id } = req.params;
        const { objectives }: { objectives: Objective[] } = req.body;

        if (!objectives) {
            return res
                .status(400)
                .json("Please include an objective list in your request.");
        }

        const previous: Objective[] = await dbService.query(
            "SELECT * FROM objectives WHERE employeeId = ?",
            [id]
        );

        console.log(previous);

        const arr = previous.filter(
            (previousObjective) =>
                !objectives.some(
                    (objective) =>
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
            const efficiency = objective.efficiency ?? null;
            const competency = objective.competency ?? null;
            const commitment = objective.commitment ?? null;
            const initiative = objective.initiative ?? null;
            const respect = objective.respect ?? null;
            const leadership = objective.leadership ?? null;

            // Find if objective already exists
            if (objectiveId) {
                const result = await dbService.query(
                    "UPDATE objectives SET title = ?, status = ?, description = ?, successConditions = ?, deadline = ?, kpi = ?, efficiency = ?, competency = ?, commitment = ?, initiative = ?, respect = ?, leadership = ? WHERE objectiveId = ?",
                    [
                        title,
                        status,
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
                    "INSERT INTO objectives (title, description, successConditions, deadline, kpi, efficiency, competency, commitment, initiative, respect, leadership, employeeId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
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

router.get("/:id/objectives", async (req, res) => {
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

router.get("/:id/comments", async (req, res) => {
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

router.post("/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body.content || !req.body.objectiveId || !req.body.content) {
            return res
                .status(400)
                .json("Please include a comment in your request.");
        }

        const result = await dbService.query(
            "INSERT INTO comments (employeeId, objectiveId, content) VALUES (?, ?, ?)",
            [req.body.employeeId, req.body.objectiveId, req.body.content]
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
            "SELECT employees.employeeId, employees.firstName, employees.lastName, employee_role.name as employeeRoleName, supervisor_profile.firstName as supervisorFirstName, supervisor_profile.lastName as supervisorLastName, manager_profile.firstName as managerFirstName, manager_profile.lastName as managerLastName FROM employees LEFT JOIN positions employee_role on employee_role.holderId = employees.employeeId LEFT JOIN positions supervisor_role on supervisor_role.superviseeId = employee_role.roleId LEFT JOIN employees supervisor_profile on supervisor_profile.employeeId = supervisor_role.holderId LEFT JOIN positions manager_role on supervisor_role.roleId = manager_role.superviseeId LEFT JOIN employees manager_profile on manager_role.holderId = manager_profile.employeeId WHERE employees.employeeId = ?;",
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

// Partially Update Employee Route (HTTP PATCH)
router.patch("/:id", async (req, res) => {
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
router.delete("/:id/password", async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the existing employee record from the database
        const existingEmployee = await dbService.query(
            "SELECT * FROM employees WHERE employeeId = ?",
            [id]
        );
        const pass = keygen();

        if (!existingEmployee || existingEmployee.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Update the employee record in the database
        await dbService.query(
            `UPDATE employees SET password = ? WHERE employeeId = ?`,
            [pass, id]
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