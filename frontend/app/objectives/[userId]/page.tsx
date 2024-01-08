"use client";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useMemo, useRef, useState } from "react";
import ObjectiveList from "@/components/ObjectiveList";
import { NewObjective } from "../../../components/NewObjective";
import { cn } from "@/util/utils";
import { CommentList } from "../../../components/CommentList";
import axios from "axios";
import { NewSelfEvaluation } from "@/components/NewSelfEvaluation";
import { NewEvaluation } from "@/components/NewEvaluation";
import { useAuth } from "@/hooks/useAuth";
import Modal from "@/components/ui/Modal";
import EditStep from "@/components/EditStep";
import {
    selectActiveObjective,
    selectActiveStep,
    useObjectivesDataStore,
} from "./_store/useStore";

export default function Objectives({ params }: { params: { userId: string } }) {
    const data = useObjectivesDataStore();
    const { user } = useAuth();

    const [evaluations, setEvaluations] = useState<Evaluation[] | null>(null);
    const [comments, setComments] = useState<Comment[] | null>(null);

    const selectedObjective = useObjectivesDataStore(selectActiveObjective);

    async function markObjective(ok?: boolean) {
        if (data.objectivesLocal && selectedObjective) {
            let arr = [...data.objectivesLocal];
            if (
                ok &&
                confirm("Do you want to mark this objective as ready ?")
            ) {
                arr[data.selectedObjectiveIndex].status = "ok";
                data.setObjectivesLocal(arr);
                postObjectives();
            }

            if (
                !ok &&
                confirm("Do you want to mark this objective as invalid ?")
            ) {
                arr[data.selectedObjectiveIndex].status = "invalid";
                data.setObjectivesLocal(arr);
                postObjectives();
            }
        } else {
        }
    }

    async function fetchStep() {
        axios
            .get<Step[]>(process.env.NEXT_PUBLIC_API_URL + "/api/steps/")
            .then((response) => {
                if (response.data) {
                    console.log("steps", response.data);
                    data.setEvaluationSteps(response.data);
                } else {
                    data.setEvaluationSteps([]);
                }
            })
            .catch((err) => console.log(err));
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
                    data.setObjectives([...response.data]);
                    console.log("objectives", response.data);
                } else {
                    data.setObjectives([]);
                }
            })
            .catch((err) => console.log(err));
    }

    async function fetchObjectiveEvaluations() {
        axios
            .get<ObjectiveEvaluation[]>(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/objectiveEvaluations"
            )
            .then((response) => {
                if (response.data) {
                    data.setObjectiveEvaluations([...response.data]);
                    console.log("objectiveEvaluations", response.data);
                } else {
                    data.setObjectiveEvaluations([]);
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
                    console.log("employee", response.data);
                    data.setEmployee(response.data);
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
                console.log("comments", response.data);
                if (response.data[0].commentId) {
                    data.setComments(response.data);
                } else {
                    data.setComments([]);
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
                    const found = data.evaluations.find(
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
            console.log("evaluations", response.data);
            data.setEvaluations(response.data);
            if (!response.data) {
                data.setEvaluations([]);
            }
        } catch (error) {
            console.error("Error fetching evaluations:", error);
        }
    };

    function postObjectives() {
        console.log(data.objectivesLocal);
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    params.userId +
                    "/objectives",
                {
                    objectives: data.objectivesLocal,
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
        fetchObjectiveEvaluations();
        fetchComments();
        fetchEvaluations();
        fetchStep();
    }

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            console.log("Cleaning up");
            data.reset();
        };
    }, []);

    useEffect(() => {
        const arr = data.objectives.map((a) => ({ ...a }));
        data.setObjectivesLocal(arr);
    }, [data.objectives]);

    useEffect(() => {
        const arr = data.comments.map((a) => ({ ...a }));
        setComments(arr);
    }, [data.comments]);

    useEffect(() => {
        const arr = data.evaluations.map((a) => ({ ...a }));
        setEvaluations(arr);
    }, [data.evaluations]);

    useEffect(() => {
        console.log("user", user);
        console.log("employee", data.employee);
    }, [user, data.employee]);

    return (
        // <ProtectedRoute>
        <main className="flex min-h-screen flex-col items-start justify-start gap-2 p-4 px-8">
            {data.objectivesLocal !== null &&
            data.employee !== null &&
            comments !== null ? (
                evaluations != null &&
                user &&
                data.employee &&
                data.evaluationSteps && (
                    <>
                        {/* Top Row */}
                        <div className="flex w-full gap-2 transition-all">
                            <Evaluation fetch={fetchStep} />
                            {data.employee && <Profile user={data.employee} />}
                        </div>
                        {/* Main row */}
                        {data.selectedEvaluationStep == 0 && (
                            <div className="flex w-full gap-2">
                                {/* Sidebar with objective list */}
                                <ObjectiveList
                                    employee={data.employee}
                                    onSubmit={postObjectives}
                                    objectives={data.objectivesLocal}
                                />
                                {/* Main objective form */}
                                <NewObjective
                                    employee={data.employee}
                                    objectives={data.objectivesLocal}
                                    onMark={markObjective}
                                />
                                {/* List of comments of the supervisor */}
                                <CommentList
                                    user={user}
                                    employee={data.employee}
                                    objectives={data.objectivesLocal}
                                    // @ts-expect-error
                                    setComments={setComments}
                                    comments={comments}
                                    cache={data.comments}
                                    fetch={fetchComments}
                                />
                            </div>
                        )}
                        {data.selectedEvaluationStep == 1 && (
                            <div className="flex w-full justify-center">
                                {/* Self evaluation form */}
                                <NewSelfEvaluation
                                    evaluations={evaluations}
                                    cache={data.evaluations}
                                    user={user}
                                    employee={data.employee}
                                    // @ts-expect-error
                                    setEvaluations={setEvaluations}
                                    onSubmit={postEvaluations}
                                    employeeId={params.userId}
                                />
                            </div>
                        )}

                        {data.selectedEvaluationStep == 2 && (
                            <div className="flex w-full justify-center">
                                {/* Self evaluation form */}
                                <NewEvaluation
                                    evaluations={evaluations}
                                    cache={data.evaluations}
                                    user={user}
                                    employee={data.employee}
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

function Step({
    step,
    postSteps,
    index,
}: {
    step: Step;
    postSteps: (number: number) => any;
    index: 0 | 1 | 2;
}) {
    const data = useObjectivesDataStore();
    const activeStep = useObjectivesDataStore(selectActiveStep);
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        setIsOpen(false);
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [divRef]);

    return (
        <>
            {user && (
                <div className="relative flex items-center justify-center gap-4">
                    <Modal
                        show={isEditingMessage}
                        onClose={() => setIsEditingMessage(false)}
                    >
                        <EditStep
                            step={step}
                            onFormSubmit={(success) => {
                                if (success) {
                                    setIsEditingMessage(false);
                                } else {
                                }
                            }}
                        />
                    </Modal>

                    <button
                        onContextMenu={(e) => {
                            e.preventDefault();
                            if (user.role == "hr") {
                                setIsOpen(true);
                            }
                        }}
                        onClick={(e) => {
                            if (activeStep >= index) {
                                data.setSelectedEvaluationStep(index);
                            }
                        }}
                        className={cn(
                            "p-2 px-4 border border-transparent rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all active:scale-95",
                            `${
                                activeStep >= index
                                    ? "bg-transparent-100 text-green-600 border-green-300"
                                    : "bg-zinc-100 text-zinc-500 hover:border-zinc-300"
                            }`,
                            `${
                                data.selectedEvaluationStep == index &&
                                "bg-green-100 text-green-600 border-green-300"
                            }`
                        )}
                    >
                        <Icon
                            icon="ic:baseline-star"
                            className="ml-1"
                            fontSize={14}
                        />
                        {step.name}
                        <p className="-mt-0 text-[8px]">
                            starts{" "}
                            {step.deadline.substring(8, 10) +
                                "/" +
                                step.deadline.substring(5, 7)}
                        </p>
                    </button>

                    <div
                        ref={divRef}
                        className={
                            "absolute left-0 flex flex-col justify-start items-start min-w-full top-full mt-2 rounded-sm border border-zinc-200 bg-white shadow-sm transition-all z-10 " +
                            `${
                                isOpen
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 invisible -translate-y-4"
                            }`
                        }
                    >
                        <button
                            onClick={() => {
                                setIsEditingMessage(true);
                            }}
                            className={
                                "rounded-lg whitespace-nowrap p-2 px-3 text-xs font-bold transition-all hover:text-zinc-800 text-zinc-800 hover:bg-zinc-50 active:scale-90 flex items-center justify-between gap-4 group w-full "
                            }
                        >
                            Edit evaluation step
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 1024 1024"
                            >
                                <path
                                    fill="currentColor"
                                    d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32m-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => {
                                if (
                                    confirm(
                                        "Do you want to set this step as active ?"
                                    )
                                ) {
                                    postSteps(index);
                                }
                            }}
                            className={
                                "whitespace-nowrap p-2 px-3 text-xs font-bold transition-all hover:text-zinc-800 text-green-600 bg-green-100 hover:bg-zinc-50 active:scale-90 flex items-center justify-between gap-4 group w-full "
                            }
                        >
                            Set as active
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2q.625 0 1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22M2 10q0-2.5 1.113-4.587T6.1 1.95l1.175 1.6q-1.5 1.1-2.387 2.775T4 10zm18 0q0-2-.888-3.675T16.726 3.55l1.175-1.6q1.875 1.375 2.988 3.463T22 10z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function Evaluation({ fetch }: { fetch: () => any }) {
    const data = useObjectivesDataStore();
    const activeStep = useObjectivesDataStore(selectActiveStep);

    const postSteps = async (index: number) => {
        await axios
            .put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/steps/${index}/current`
            )
            .then((response) => {
                if (response.status == 200) {
                    fetch();
                    alert("Steps updated successfully");
                }
            })
            .catch((err) => console.log(err));
    };

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
                    {data.evaluationSteps
                        .sort((a, b) => a.stepId - b.stepId)
                        .map((stepObj, index) => (
                            <>
                                <Step
                                    key={stepObj.name}
                                    step={stepObj}
                                    postSteps={postSteps}
                                    index={index as 0 | 1 | 2}
                                />
                                {index < data.evaluationSteps.length - 1 && (
                                    <>
                                        <div
                                            className={
                                                "h-2 w-2 rounded-full" +
                                                (activeStep > index
                                                    ? " bg-green-300"
                                                    : " bg-zinc-300")
                                            }
                                        ></div>
                                        <div
                                            className={
                                                "h-2 w-2 rounded-full" +
                                                (activeStep > index
                                                    ? " bg-green-300"
                                                    : " bg-zinc-300")
                                            }
                                        ></div>
                                        <div
                                            className={
                                                "h-2 w-2 rounded-full" +
                                                (activeStep > index
                                                    ? " bg-green-300"
                                                    : " bg-zinc-300")
                                            }
                                        ></div>
                                    </>
                                )}
                            </>
                        ))}
                </div>
            </div>
        </div>
    );
}
