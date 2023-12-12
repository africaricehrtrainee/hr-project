"use client";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import ObjectiveList from "@/components/ObjectiveList";
import { NewObjective } from "../../../components/NewObjective";
import { cn, getStep } from "@/util/utils";
import { CommentList } from "../../../components/CommentList";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { NewSelfEvaluation } from "@/components/NewSelfEvaluation";
import { NewEvaluation } from "@/components/NewEvaluation";
import { useAuth } from "@/hooks/useAuth";

export interface EmployeeResult {
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

export default function Objectives({ params }: { params: { userId: string } }) {
    const searchParams = useSearchParams();
    const [panel, setPanel] = useState<number>(0);

    const { user } = useAuth();

    const [objectivesData, setObjectivesData] = useState<Objective[]>([]);
    const [objectives, setObjectives] = useState<Objective[] | null>(null);
    const [selectedObjective, setSelectedObjective] = useState<number>(0);

    const [commentsData, setcommentsData] = useState<Comment[]>([]);
    const [comments, setComments] = useState<Comment[] | null>(null);

    const [evaluationsData, setEvaluationsData] = useState<Evaluation[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[] | null>(null);

    const [employee, setEmployee] = useState<EmployeeResult | null>(null);

    async function markObjective(ok?: boolean) {
        if (objectives && objectives[selectedObjective]) {
            let arr = [...objectives];
            if (
                ok &&
                confirm("Do you want to mark this objective as ready ?")
            ) {
                arr[selectedObjective].status = "ok";
                setObjectives(arr);
                postObjectives();
            }

            if (
                !ok &&
                confirm("Do you want to mark this objective as invalid ?")
            ) {
                arr[selectedObjective].status = "invalid";
                setObjectives(arr);
                postObjectives();
            }
        } else {
        }
    }

    async function fetchObjectives() {
        axios
            .get<Objective[]>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/objectives"
            )
            .then((response) => {
                if (response.data) {
                    setObjectivesData([...response.data]);
                } else {
                    console.log(response);
                    setObjectivesData([]);
                }
            })
            .catch((err) => console.log(err));
    }

    async function fetchUser() {
        axios
            .get<EmployeeResult>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/supervisors"
            )
            .then((response) => {
                if (response.data.employeeId) {
                    setEmployee(response.data);
                } else {
                }
            })
            .catch((err) => console.log(err));
    }

    async function fetchComments() {
        axios
            .get<Comment[]>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/comments"
            )
            .then((response) => {
                console.log(response.data);
                if (response.data[0].commentId) {
                    setcommentsData(response.data);
                } else {
                    setcommentsData([]);
                }
            })
            .catch((err) => console.log(err));
    }

    const postEvaluations = async () => {
        try {
            if (evaluations) {
                // Iterate over new evaluations
                console.log("evaluations", evaluations);
                for (const draft of evaluations) {
                    console.log(draft);
                    // Check if there's an existing evaluation with the same evaluationId
                    const found = evaluationsData.find(
                        (before) => before.evaluationId === draft.evaluationId
                    );
                    // If there's no existing evaluation or the new one is different, post it
                    if (
                        !found ||
                        JSON.stringify(found) !== JSON.stringify(draft)
                    ) {
                        await axios.post(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${params.userId}/evaluations`,
                            draft
                        );
                    }
                }

                // After posting/updating evaluations, fetch the updated list
                alert("Evaluations updated successfully");
                await fetchEvaluations();
            }
        } catch (error) {
            console.error("Error posting evaluations:", error);
        }
    };

    const fetchEvaluations = async () => {
        try {
            const response = await axios.get<Evaluation[]>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${params.userId}/evaluations`
            ); // Adjust the API endpoint
            console.log(response.data);
            setEvaluationsData(response.data);
            if (!response.data) {
                setEvaluationsData([]);
            }
        } catch (error) {
            console.error("Error fetching evaluations:", error);
        }
    };

    function postObjectives() {
        console.log(objectives);
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/objectives",
                {
                    objectives,
                }
            )
            .then((response) => {
                if (response.status == 201) {
                    fetchObjectives();
                    alert("Objectives updated successfully");
                }
            })
            .catch((err) => console.log(err));
    }

    function init() {
        fetchUser();
        fetchObjectives();
        fetchComments();
        fetchEvaluations();
    }

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const arr = objectivesData.map((a) => ({ ...a }));
        setObjectives(arr);
    }, [objectivesData]);

    useEffect(() => {
        const arr = commentsData.map((a) => ({ ...a }));
        setComments(arr);
    }, [commentsData]);

    useEffect(() => {
        const arr = evaluationsData.map((a) => ({ ...a }));
        setEvaluations(arr);
    }, [evaluationsData]);

    useEffect(() => {
        console.log("user", user);
        console.log("employee", employee);
    }, [user, employee]);

    return (
        // <ProtectedRoute>
        <main className="flex min-h-screen flex-col items-start justify-start gap-2 p-8">
            {objectives !== null && employee !== null && comments !== null ? (
                evaluations != null &&
                user &&
                employee && (
                    <>
                        {/* Top Row */}
                        <div className="flex w-full gap-2 transition-all">
                            {/* Shows the different steps of the evaluation process and allows navigation between them */}
                            <Menu setSelected={setPanel} selected={panel} />

                            <Evaluation />
                            {/* Shows profile card with supervisor */}
                            {employee && <Profile user={employee} />}
                        </div>
                        {/* Main row */}
                        {panel == 0 && (
                            <div className="flex w-full gap-2 transition-all">
                                {/* Sidebar with objective list */}
                                <ObjectiveList
                                    user={user}
                                    employee={employee}
                                    // @ts-expect-error
                                    setObjectives={setObjectives}
                                    onSubmit={postObjectives}
                                    objectives={objectives}
                                    cache={objectivesData}
                                    selectedObjective={selectedObjective}
                                    setSelectedObjective={setSelectedObjective}
                                />
                                {/* Main objective form */}
                                <NewObjective
                                    user={user}
                                    employee={employee}
                                    selectedObjective={selectedObjective}
                                    objectives={objectives}
                                    // @ts-expect-error
                                    setObjectives={setObjectives}
                                    onMark={markObjective}
                                    onGrade={postObjectives}
                                />
                                {/* List of comments of the supervisor */}
                                <CommentList
                                    user={user}
                                    employee={employee}
                                    objectives={objectives}
                                    selectedObjective={selectedObjective}
                                    // @ts-expect-error
                                    setComments={setComments}
                                    comments={comments}
                                    cache={commentsData}
                                    fetch={fetchComments}
                                />
                            </div>
                        )}
                        {panel == 1 && (
                            <div className="flex w-full gap-2 transition-all">
                                {/* Self evaluation form */}
                                <NewSelfEvaluation
                                    evaluations={evaluations}
                                    cache={evaluationsData}
                                    user={user}
                                    employee={employee}
                                    // @ts-expect-error
                                    setEvaluations={setEvaluations}
                                    onSubmit={postEvaluations}
                                    employeeId={params.userId}
                                />
                                {/* Superior evaluation form */}
                                <NewEvaluation
                                    evaluations={evaluations}
                                    cache={evaluationsData}
                                    user={user}
                                    employee={employee}
                                    // @ts-expect-error
                                    setEvaluations={setEvaluations}
                                    onSubmit={postEvaluations}
                                    employeeId={params.userId}
                                />
                            </div>
                        )}
                    </>
                )
            ) : (
                <></>
            )}
        </main>
        // </ProtectedRoute>
    );
}

function Profile({ user }: { user: EmployeeResult }) {
    return (
        <div className="ml-auto flex w-[350px] items-start justify-evenly gap-4 rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <div className="flex h-full flex-col items-center justify-center gap-2">
                <Chip>
                    Staff
                    <Icon
                        icon="mingcute:profile-fill"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
                <div className="te flex h-10 w-10 items-center justify-center rounded-full bg-brand font-bold text-white">
                    {user.firstName && user.lastName
                        ? user.lastName.charAt(0) + user.firstName.charAt(0)
                        : ""}
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        NAME
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {user.firstName && user.lastName
                            ? user.lastName + " " + user.firstName
                            : ""}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        Position
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {user.employeeRoleName ?? "..."}
                    </p>
                </div>
            </div>
            <div className="flex h-full flex-col items-start justify-evenly">
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+1)
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {user.supervisorFirstName && user.supervisorLastName
                            ? user.supervisorLastName +
                              " " +
                              user.supervisorFirstName
                            : "..."}
                    </p>
                </div>
                <div className="">
                    <p className="text-[10px] font-medium text-zinc-300">
                        SUPERVISOR (N+2)
                    </p>
                    <p className="text-xs font-bold text-zinc-700">
                        {user.managerFirstName && user.managerLastName
                            ? user.managerLastName + " " + user.managerFirstName
                            : "..."}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Evaluation() {
    const [step, setStep] = useState<number>(0);
    return (
        <div className="flex w-full flex-1 items-center justify-between rounded-md border border-zinc-200 bg-white p-4 text-center shadow-sm transition-all">
            <div className="flex flex-col items-start justify-start gap-2">
                <Chip>
                    Evaluation schedule
                    <Icon
                        icon="material-symbols:info"
                        className="ml-1"
                        fontSize={14}
                    />
                </Chip>
                <div className="flex w-full items-center justify-start gap-2">
                    <button
                        onClick={() => setStep(0)}
                        className={cn(
                            "p-2 px-4 border border-transparent rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-95",
                            `${
                                step >= 0
                                    ? "bg-green-100 text-green-600 border-green-300"
                                    : "bg-zinc-100 text-zinc-500 hover:border-zinc-300"
                            }`
                        )}
                    >
                        <Icon
                            icon="icon-park-solid:list-checkbox"
                            className="ml-1"
                            fontSize={14}
                        />
                        Objective submission
                        <p className="-mt-0 text-[8px]">starts 5/11</p>
                    </button>
                    <div
                        className={
                            "h-2 w-2 rounded-full" +
                            (step > 0 ? " bg-green-300" : " bg-zinc-300")
                        }
                    ></div>
                    <div
                        className={
                            "h-2 w-2 rounded-full" +
                            (step > 0 ? " bg-green-300" : " bg-zinc-300")
                        }
                    ></div>
                    <div
                        className={
                            "h-2 w-2 rounded-full" +
                            (step > 0 ? " bg-green-300" : " bg-zinc-300")
                        }
                    ></div>
                    <button
                        onClick={() => setStep(1)}
                        className={cn(
                            "p-2 px-4 border border-transparent rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-95",
                            `${
                                step >= 1
                                    ? "bg-green-100 text-green-600 border-green-300"
                                    : "bg-zinc-100 text-zinc-500 hover:border-zinc-300"
                            }`
                        )}
                    >
                        <Icon
                            icon="icon-park-solid:thinking-problem"
                            className="ml-1"
                            fontSize={14}
                        />
                        Self-evaluation
                        <p className="-mt-0 text-[8px]">starts 3/12</p>
                    </button>
                    <div
                        className={
                            "h-2 w-2 rounded-full" +
                            (step > 1 ? " bg-green-300" : " bg-zinc-300")
                        }
                    ></div>
                    <div
                        className={
                            "h-2 w-2 rounded-full" +
                            (step > 1 ? " bg-green-300" : " bg-zinc-300")
                        }
                    ></div>
                    <div
                        className={
                            "h-2 w-2 rounded-full" +
                            (step > 1 ? " bg-green-300" : " bg-zinc-300")
                        }
                    ></div>
                    <button
                        onClick={() => setStep(2)}
                        className={cn(
                            "p-2 px-4 border border-transparent rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-95",
                            `${
                                step >= 2
                                    ? "bg-green-100 text-green-600 border-green-300"
                                    : "bg-zinc-100 text-zinc-500 hover:border-zinc-300"
                            }`
                        )}
                    >
                        <Icon
                            icon="iconamoon:pen-fill"
                            className="ml-1"
                            fontSize={14}
                        />
                        Evaluation
                        <p className="-mt-0 text-[8px]">starts 11/12</p>
                    </button>
                </div>
            </div>
            {/* <div className="flex h-full w-[250px] flex-col items-end justify-between p-0 text-end text-xs font-bold text-zinc-700">
                <Button type="submit" variant="outline">
                    Send
                    <Icon
                        icon="material-symbols:upload-sharp"
                        className="ml-1"
                        fontSize={14}
                    />
                </Button>
            </div> */}
        </div>
    );
}

function Menu({
    setSelected,
    selected,
}: {
    setSelected: (idx: number) => any;
    selected: number;
}) {
    return (
        <div className="flex flex-col items-start justify-center gap-2 rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <Chip>
                My performance
                <Icon
                    icon="material-symbols:info"
                    className="ml-1"
                    fontSize={14}
                />
            </Chip>
            <div className="flex gap-2">
                <button
                    onClick={() => setSelected(0)}
                    className={cn(
                        "p-2 px-3 border border-transparent rounded-full flex items-center justify-center gap-1 text-xs font-semibold transition-all active:scale-95",
                        `${
                            selected == 0
                                ? "bg-green-100 text-green-600 border-green-300"
                                : "bg-zinc-100 text-zinc-500 hover:border-zinc-300"
                        }`
                    )}
                >
                    Objectives
                    <Icon
                        icon="material-symbols:target"
                        className="ml-1"
                        fontSize={14}
                    />
                </button>
                <button
                    onClick={() => setSelected(1)}
                    className={cn(
                        "p-2 px-3 border border-transparent rounded-full flex items-center justify-center gap-1 text-xs font-semibold transition-all active:scale-95",
                        `${
                            selected == 1
                                ? "bg-green-100 text-green-600 border-green-300"
                                : "bg-zinc-100 text-zinc-500 hover:border-zinc-300"
                        }`
                    )}
                >
                    Personal evaluation
                    <Icon
                        icon="mdi:performance"
                        className="ml-1"
                        fontSize={14}
                    />
                </button>
            </div>
        </div>
    );
}
