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
    respectRating: number | null;
    leadership: string | null;
    leadershipRating: number | null;
}
