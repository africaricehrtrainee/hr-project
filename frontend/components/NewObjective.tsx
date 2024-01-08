"use client";
import {
    selectActiveObjective,
    selectActiveStep,
    useObjectivesDataStore,
} from "@/app/objectives/[userId]/_store/useStore";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useEffect, useState } from "react";

export function NewObjective({
    employee,
    objectives,
    onMark,
}: {
    employee: EmployeeResult;
    objectives: Objective[];
    onMark: (ok?: boolean) => any;
}) {
    const { user } = useAuth();
    const data = useObjectivesDataStore();
    const selectedObjective = useObjectivesDataStore(selectActiveObjective);
    const activeStep = useObjectivesDataStore(selectActiveStep);

    const [evaluation, setEvaluation] =
        useState<Partial<ObjectiveEvaluation>>();
    const [selfEvaluation, setSelfEvaluation] =
        useState<Partial<ObjectiveEvaluation>>();

    async function submitSelfEvaluation(done: boolean) {
        if (!selectedObjective) {
            return null;
        }
        await axios.post(
            process.env.NEXT_PUBLIC_API_URL +
                "/api/objectives/" +
                selectedObjective.objectiveId +
                "/evaluations",
            {
                ...selfEvaluation,
                status: done ? "sent" : "draft",
                authorId: user?.employeeId,
            }
        );
    }

    async function submitEvaluation(done: boolean) {
        if (!selectedObjective) {
            return null;
        }
        await axios.post(
            process.env.NEXT_PUBLIC_API_URL +
                "/api/objectives/" +
                selectedObjective.objectiveId +
                "/evaluations",
            {
                ...evaluation,
                status: done ? "sent" : "draft",
                authorId: user?.employeeId,
            }
        );
    }

    useEffect(() => {
        if (data.objectiveEvaluations && selectedObjective) {
            setEvaluation(
                data.objectiveEvaluations.find(
                    (evaluation) =>
                        evaluation.objectiveId ==
                            selectedObjective.objectiveId &&
                        evaluation.authorId == employee.supervisorId
                )
            );
            setSelfEvaluation(
                data.objectiveEvaluations.find(
                    (evaluation) =>
                        evaluation.objectiveId ==
                            selectedObjective.objectiveId &&
                        evaluation.authorId == employee.employeeId
                )
            );
        }
    }, [data.objectiveEvaluations, employee, selectedObjective]);

    if (!user || data.objectiveEvaluations == undefined)
        return (
            <div className="relative flex flex-1 rounded-md border border-zinc-200 bg-white shadow-sm"></div>
        );

    return (
        <div className="relative flex flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm">
            {selectedObjective && (
                <>
                    {/* Supervisor comment buttons */}
                    {user.employeeId == employee.supervisorId &&
                        evaluation?.status !== "sent" && (
                            <>
                                <div className="absolute right-4 top-4 flex w-full items-center justify-end gap-2">
                                    <Button
                                        onClick={() => onMark(true)}
                                        disabled={
                                            selectedObjective.status == "ok"
                                        }
                                        variant="outline"
                                    >
                                        Mark OK
                                        <Icon
                                            icon="material-symbols:check"
                                            className="ml-1"
                                            fontSize={14}
                                        />
                                    </Button>
                                    <Button
                                        onClick={() => onMark()}
                                        disabled={
                                            selectedObjective.status ==
                                            "invalid"
                                        }
                                        variant="alert"
                                    >
                                        Mark invalid
                                        <Icon
                                            icon="mdi:alert"
                                            className="ml-1"
                                            fontSize={14}
                                        />
                                    </Button>
                                </div>
                            </>
                        )}
                    {evaluation?.status == "sent" && (
                        <>
                            <div className="absolute right-4 top-4 flex flex-col items-end justify-center rounded-md border border-zinc-100 p-2 text-end">
                                <p className="text-[10px] font-bold text-zinc-400">
                                    Objective grade
                                </p>
                                <p className="text-2xl font-bold text-zinc-700">
                                    {evaluation.grade}
                                    <span className="text-xs font-bold text-zinc-400">
                                        /5
                                    </span>
                                </p>
                            </div>
                        </>
                    )}

                    {/* Objective Header */}
                    <div className="flex w-full items-center justify-between">
                        {selectedObjective.status == "draft" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                Draft
                                <Icon
                                    icon="octicon:issue-draft-16"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {selectedObjective.status == "sent" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                Sent
                                <Icon
                                    icon="carbon:send-alt-filled"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {selectedObjective.status == "invalid" && (
                            // </div>
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-red-100 p-1 px-2 text-[8px] font-semibold text-red-500">
                                Invalid
                                <Icon
                                    icon="mdi:alert"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {(selectedObjective.status == "ok" ||
                            selectedObjective.status == "graded") && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-500">
                                OK
                                <Icon
                                    icon="material-symbols:check"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {user.employeeId == employee.employeeId && (
                            <>
                                {selectedObjective.status == "ok" ||
                                selectedObjective.status == "sent" ? null : (
                                    <Button
                                        disabled={
                                            selectedObjective.status == "graded"
                                        }
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Do you want to delete this objective ?"
                                                )
                                            ) {
                                                const arr = [...objectives];

                                                data.setObjectivesLocal(
                                                    arr.filter(
                                                        (obj, idx) =>
                                                            data.selectedObjectiveIndex !==
                                                            idx
                                                    )
                                                );
                                            }
                                        }}
                                        variant="alert"
                                    >
                                        Delete objective
                                        <Icon
                                            icon="gridicons:trash"
                                            className="ml-1"
                                            fontSize={14}
                                        />
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                    {/* Objective Form */}
                    <div className="mt-2 h-full w-full">
                        <p className="text-2xl font-bold text-zinc-700">
                            {selectedObjective.title
                                ? selectedObjective.title
                                : "Untitled"}
                        </p>
                        <form className="mt-2 grid w-full grid-cols-2 gap-4 border-b border-dashed border-b-zinc-200 pb-4 pt-2">
                            <div className="mt-1 flex flex-col gap-2">
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        TITLE OF THE OBJECTIVE
                                    </label>
                                    <input
                                        autoCorrect="off"
                                        spellCheck="false"
                                        maxLength={50}
                                        disabled={
                                            selectedObjective.status == "ok" ||
                                            selectedObjective.status ==
                                                "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        type="text"
                                        required
                                        value={selectedObjective.title ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].title = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the objective title"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        DEADLINE OF THE OBJECTIVE
                                    </label>
                                    <input
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            selectedObjective.status == "ok" ||
                                            selectedObjective.status ==
                                                "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        type="text"
                                        value={selectedObjective.deadline ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].deadline = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the deadline of the objective"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        OBJECTIVE KPI
                                    </label>
                                    <input
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            selectedObjective.status == "ok" ||
                                            selectedObjective.status ==
                                                "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        type="text"
                                        value={selectedObjective.kpi ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].kpi = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the objective’s key performance indicators (KPI)"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-1 flex flex-col gap-2">
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        OBJECTIVE DESCRIPTION / MAIN ACTIVITY
                                    </label>
                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            selectedObjective.status == "ok" ||
                                            selectedObjective.status ==
                                                "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        value={
                                            selectedObjective.description ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].description = e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the description of the objective"
                                        className="h-[80px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        SUCCESS CONDITIONS
                                    </label>
                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            selectedObjective.status == "ok" ||
                                            selectedObjective.status ==
                                                "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        value={
                                            selectedObjective.successConditions ??
                                            ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) => {
                                            const arr = [...(objectives ?? [])];
                                            arr[
                                                data.selectedObjectiveIndex
                                            ].successConditions =
                                                e.target.value;
                                            data.setObjectivesLocal(arr);
                                        }}
                                        placeholder="Enter the objective’s success conditions"
                                        className="h-[80px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Staff self-evaluation */}
                    {(user.employeeId == employee.employeeId ||
                        selfEvaluation?.status == "sent") &&
                        activeStep >= 1 &&
                        selectedObjective.status == "ok" && (
                            <div className="mt-4 flex w-full items-start justify-between">
                                <div className="flex flex-col items-start justify-start gap-1">
                                    {selfEvaluation?.status !== "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                            Unsubmitted
                                            <Icon
                                                icon="octicon:issue-draft-16"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    {selfEvaluation?.status == "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                            Submitted
                                            <Icon
                                                icon="carbon:send-alt-filled"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    <p className="mb-2 text-2xl font-bold text-zinc-700">
                                        Objective self-evaluation
                                    </p>

                                    {/* Submission buttons */}
                                    {true && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Are you sure you want to submit this evaluation ?"
                                                        )
                                                    ) {
                                                        submitSelfEvaluation(
                                                            false
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    selfEvaluation?.status ==
                                                        "sent" ||
                                                    (!selfEvaluation?.grade &&
                                                        !selfEvaluation?.comment)
                                                }
                                                variant="outline"
                                            >
                                                Save draft
                                                <Icon
                                                    icon="iconamoon:pen-fill"
                                                    className="ml-1"
                                                    fontSize={14}
                                                />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Are you sure you want to submit this evaluation ?"
                                                        )
                                                    ) {
                                                        submitSelfEvaluation(
                                                            true
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    selfEvaluation?.status ==
                                                        "sent" ||
                                                    !selfEvaluation?.grade ||
                                                    !selfEvaluation?.comment
                                                }
                                                variant="primary"
                                            >
                                                Submit
                                                <Icon
                                                    icon="material-symbols:upload-sharp"
                                                    className="ml-1"
                                                    fontSize={14}
                                                />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex w-[350px] flex-col items-end justify-end gap-2">
                                    <div className="flex w-full items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.employeeId ||
                                                selfEvaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setSelfEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 1;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    selfEvaluation?.grade == 1
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            1
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.employeeId ||
                                                selfEvaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setSelfEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 2;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    selfEvaluation?.grade == 2
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            2
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.employeeId ||
                                                selfEvaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setSelfEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 3;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    selfEvaluation?.grade == 3
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            3
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.employeeId ||
                                                selfEvaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setSelfEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 4;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    selfEvaluation?.grade == 4
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            4
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.employeeId ||
                                                selfEvaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setSelfEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 5;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    selfEvaluation?.grade == 5
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            5
                                        </button>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !=
                                                employee.employeeId ||
                                            selfEvaluation?.status == "sent"
                                        }
                                        value={selfEvaluation?.comment ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setSelfEvaluation((prev) => {
                                                const obj = { ...prev };
                                                obj.comment = e.target.value;
                                                return obj;
                                            })
                                        }
                                        placeholder={`Write your self-evaluation for this objective`}
                                        className="h-[80px] w-full rounded-md border border-zinc-200 p-2 px-3 text-end text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                        )}

                    {/* Staff evaluation */}
                    {(user.employeeId == employee.supervisorId ||
                        evaluation?.status == "sent") &&
                        activeStep >= 2 &&
                        selectedObjective.status == "ok" && (
                            <div className="mt-4 flex w-full items-start justify-between">
                                <div className="flex flex-col items-start justify-start gap-1">
                                    {evaluation?.status !== "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                            Unsubmitted
                                            <Icon
                                                icon="octicon:issue-draft-16"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    {evaluation?.status == "sent" && (
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                            Submitted
                                            <Icon
                                                icon="carbon:send-alt-filled"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
                                    )}
                                    <p className="mb-2 text-2xl font-bold text-zinc-700">
                                        Objective evaluation
                                    </p>

                                    {/* Submission buttons */}
                                    {true && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Are you sure you want to submit this evaluation ?"
                                                        )
                                                    ) {
                                                        submitEvaluation(false);
                                                    }
                                                }}
                                                disabled={
                                                    evaluation?.status ==
                                                        "sent" ||
                                                    (!evaluation?.grade &&
                                                        !evaluation?.comment)
                                                }
                                                variant="outline"
                                            >
                                                Save draft
                                                <Icon
                                                    icon="iconamoon:pen-fill"
                                                    className="ml-1"
                                                    fontSize={14}
                                                />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Are you sure you want to submit this evaluation ?"
                                                        )
                                                    ) {
                                                        submitEvaluation(true);
                                                    }
                                                }}
                                                disabled={
                                                    evaluation?.status ==
                                                        "sent" ||
                                                    !evaluation?.grade ||
                                                    !evaluation?.comment
                                                }
                                                variant="primary"
                                            >
                                                Submit
                                                <Icon
                                                    icon="material-symbols:upload-sharp"
                                                    className="ml-1"
                                                    fontSize={14}
                                                />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex w-[350px] flex-col items-end justify-end gap-2">
                                    <div className="flex w-full items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.supervisorId ||
                                                evaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 1;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    evaluation?.grade == 1
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            1
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.supervisorId ||
                                                evaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 2;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    evaluation?.grade == 2
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            2
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.supervisorId ||
                                                evaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 3;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    evaluation?.grade == 3
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            3
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.supervisorId ||
                                                evaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 4;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    evaluation?.grade == 4
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            4
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                user.employeeId !=
                                                    employee.supervisorId ||
                                                evaluation?.status == "sent"
                                            }
                                            onClick={() =>
                                                setEvaluation((prev) => {
                                                    const obj = { ...prev };
                                                    obj.grade = 5;
                                                    return obj;
                                                })
                                            }
                                            className={
                                                "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                ` ${
                                                    evaluation?.grade == 5
                                                        ? "bg-green-400 text-green-50 border-transparent"
                                                        : " text-green-500 bg-transparent border-green-300"
                                                }`
                                            }
                                        >
                                            5
                                        </button>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !=
                                                employee.supervisorId ||
                                            evaluation?.status == "sent"
                                        }
                                        value={evaluation?.comment ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEvaluation((prev) => {
                                                const obj = { ...prev };
                                                obj.comment = e.target.value;
                                                return obj;
                                            })
                                        }
                                        placeholder={`Write your evaluation for this objective`}
                                        className="h-[80px] w-full rounded-md border border-zinc-200 p-2 px-3 text-end text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                        )}
                </>
            )}
        </div>
    );
}
