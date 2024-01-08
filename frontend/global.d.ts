// Employees Table Interface
interface Employee {
    employeeId: number;
    role: "staff" | "hr" | "admin" | "consultant";
    email: string;
    firstName: string | null;
    lastName: string | null;
    password: string | null;
    matricule: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface EmployeeResult {
    employeeId: number;
    firstName: string;
    lastName: string;
    employeeRoleName: string;
    supervisorId: number | null;
    supervisorFirstName: string | null;
    supervisorLastName: string | null;
    managerId: number | null;
    managerFirstName: string | null;
    managerLastName: number | null;
}

interface ObjectiveEvaluation {
    objectiveEvaluationId: number;
    objectiveId: number;
    authorId: number;
    status: "draft" | "sent";
    grade: number;
    comment: string;
}
// Objectives Table Interface
interface Objective {
    objectiveId: number;
    employeeId: number;
    status: "draft" | "invalid" | "ok" | "sent" | "graded";
    title: string | null;
    description: string | null;
    successConditions: string | null;
    deadline: string | null;
    kpi: string | null;
    efficiency: string | null;
    competency: string | null;
    commitment: string | null;
    initiative: string | null;
    respect: string | null;
    leadership: string | null;
    grade: number | null;
    comment: string | null;
    selfGrade: number | null;
    selfComment: string | null;
    createdAt: string;
    updatedAt: string;
}

// Comments Table Interface
interface Comment {
    commentId: number;
    objectiveId: number;
    employeeId: number;
    authorId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
}

// Positions Table Interface
interface Position {
    roleId: number;
    name: string;
    holderId: number | null;
    supervisorId: number | null;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
    updatedAt: string;
}

interface TreeNode {
    position: Position;
    children: TreeNode[];
}
// Evaluation Table Interface
interface Evaluation {
    status: "draft" | "sent";
    evaluationId: number;
    authorId: number;
    employeeId: number;
    evaluationYear: string;
    updatedAt: string; // You can use a string for TIMESTAMP
    createdAt: string; // You can use a string for TIMESTAMP
    efficiency: string | null; // Assuming these fields can be nullable
    efficiencyRating: number | null;
    competency: string | null;
    competencyRating: number | null;
    commitment: string | null;
    commitmentRating: number | null;
    initiative: string | null;
    initiativeRating: number | null;
    respect: string | null;
    respectRating: number | nulstepI;
    leadership: string | null;
    leadershipRating: number | null;
}

interface Step {
    stepId: number;
    name: string;
    deadline: string;
    active: boolean;
    message;
}
