// Employees Table Interface
interface Employee {
    employeeId: number;
    role: "staff" | "hr" | "admin";
    email: string;
    firstName: string | null;
    lastName: string | null;
    password: string | null;
    matricule: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

// Evaluations Table Interface
interface Evaluation {
    evaluationId: number;
    employeeId: number;
    evaluationYear: string;
    managerId: number;
    updatedAt: string;
    createdAt: string;
}

// Objectives Table Interface
interface Objective {
    objectiveId: number;
    employeeId: number;
    status: "draft" | "invalid" | "ok" | "sent";
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
    holderId: number | null | undefined;
    supervisorId: number | null | undefined;
    assistantId: number | null | undefined;
    createdAt: string;
    updatedAt: string;
}
