"use client";
import { EmployeeResult } from "@/app/objectives/[userId]/page";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

export function NewObjective({
    user,
    employee,
    objectives,
    selectedObjective,
    setObjectives,
    onMark,
    onGrade,
}: {
    user: Employee;
    employee: EmployeeResult;
    objectives: Objective[];
    selectedObjective: number;
    setObjectives: React.Dispatch<React.SetStateAction<Objective[]>>;
    onMark: (ok?: boolean) => any;
    onGrade: () => any;
}) {
    return (
        <div className="relative flex flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            {objectives[selectedObjective] && (
                <>
                    {user.employeeId == employee.supervisorId &&
                        objectives[selectedObjective].status !== "graded" && (
                            <>
                                <div className="absolute right-4 top-4 flex w-full items-center justify-end gap-2">
                                    <Button
                                        onClick={() => onMark(true)}
                                        disabled={
                                            objectives[selectedObjective]
                                                .status == "ok"
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
                                            objectives[selectedObjective]
                                                .status == "invalid"
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
                    <div className="flex w-full items-center justify-between">
                        {objectives[selectedObjective].status == "draft" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                Draft
                                <Icon
                                    icon="octicon:issue-draft-16"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {objectives[selectedObjective].status == "sent" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                Sent
                                <Icon
                                    icon="carbon:send-alt-filled"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {objectives[selectedObjective].status == "invalid" && (
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
                        {(objectives[selectedObjective].status == "ok" ||
                            objectives[selectedObjective].status ==
                                "graded") && (
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
                                {objectives[selectedObjective].status == "ok" ||
                                objectives[selectedObjective].status ==
                                    "graded" ? null : (
                                    <Button
                                        disabled={
                                            objectives[selectedObjective]
                                                .status == "ok" ||
                                            objectives[selectedObjective]
                                                .status == "graded"
                                        }
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Do you want to delete this objective ?"
                                                )
                                            ) {
                                                const arr = [...objectives];

                                                setObjectives(
                                                    arr.filter(
                                                        (obj, idx) =>
                                                            selectedObjective !==
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
                    <div className="mt-2 h-full w-full">
                        <p className="text-2xl font-bold text-zinc-700">
                            {objectives[selectedObjective].title
                                ? objectives[selectedObjective].title
                                : "Untitled"}
                        </p>
                        <form className="mt-2 grid w-full grid-cols-2 gap-4 pt-2">
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
                                            objectives[selectedObjective]
                                                .status == "ok" ||
                                            objectives[selectedObjective]
                                                .status == "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        type="text"
                                        required
                                        value={
                                            objectives[selectedObjective]
                                                .title ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[selectedObjective].title =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Enter the objective title"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        OBJECTIVE DESCRIPTION / MAIN ACTIVITY
                                    </label>
                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            objectives[selectedObjective]
                                                .status == "ok" ||
                                            objectives[selectedObjective]
                                                .status == "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        value={
                                            objectives[selectedObjective]
                                                .description ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].description = e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Enter the description of the objective"
                                        className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-1 flex flex-col gap-2">
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        DEADLINE OF THE OBJECTIVE
                                    </label>
                                    <input
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            objectives[selectedObjective]
                                                .status == "ok" ||
                                            objectives[selectedObjective]
                                                .status == "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        type="text"
                                        value={
                                            objectives[selectedObjective]
                                                .deadline ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].deadline = e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Enter the deadline of the objective"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
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
                                            objectives[selectedObjective]
                                                .status == "ok" ||
                                            objectives[selectedObjective]
                                                .status == "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        value={
                                            objectives[selectedObjective]
                                                .successConditions ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].successConditions =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Enter the objective’s success conditions"
                                        className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
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
                                            objectives[selectedObjective]
                                                .status == "ok" ||
                                            objectives[selectedObjective]
                                                .status == "graded" ||
                                            user.employeeId !==
                                                employee.employeeId
                                        }
                                        type="text"
                                        value={
                                            objectives[selectedObjective].kpi ??
                                            ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[selectedObjective].kpi =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Enter the objective’s key performance indicators (KPI)"
                                        className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    {((user.employeeId == employee.supervisorId &&
                        (objectives[selectedObjective].status == "ok" ||
                            objectives[selectedObjective].status ==
                                "graded")) ||
                        objectives[selectedObjective].status == "graded") && (
                        <div className="flex w-full items-start justify-between">
                            <div className="flex flex-col items-start justify-start gap-1">
                                {objectives[selectedObjective].status !==
                                    "graded" && (
                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                        Ungraded
                                        <Icon
                                            icon="octicon:issue-draft-16"
                                            className="ml-1"
                                            fontSize={10}
                                        />
                                    </div>
                                )}
                                {objectives[selectedObjective].status ==
                                    "graded" && (
                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                        Graded
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
                                {objectives[selectedObjective].status ==
                                "graded" ? (
                                    <div className="absolute right-4 top-4 flex flex-col items-end justify-center rounded-md border border-zinc-100 p-2 text-end">
                                        <p className="text-[10px] font-bold text-zinc-400">
                                            Estimated objective grade
                                        </p>
                                        <p className="text-2xl font-bold text-zinc-700">
                                            {
                                                objectives[selectedObjective]
                                                    .grade
                                            }
                                            <span className="text-xs font-bold text-zinc-400">
                                                /5
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Are you sure you want to submit this evaluation ?"
                                                )
                                            ) {
                                                setObjectives((prev) => {
                                                    const arr = [...prev];
                                                    arr[
                                                        selectedObjective
                                                    ].status = "graded";
                                                    return arr;
                                                });
                                                onGrade();
                                            }
                                        }}
                                        disabled={
                                            objectives[selectedObjective]
                                                .status == "graded" ||
                                            !objectives[selectedObjective]
                                                .grade ||
                                            !objectives[selectedObjective]
                                                .comment
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
                                )}
                            </div>
                            <div className="flex w-[350px] flex-col items-end justify-end gap-2">
                                <div className="flex w-full items-center justify-center gap-1">
                                    <button
                                        type="button"
                                        disabled={
                                            user.employeeId !=
                                                employee.supervisorId ||
                                            objectives[selectedObjective]
                                                .status == "graded"
                                        }
                                        onClick={() =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].grade = 1;
                                                return arr;
                                            })
                                        }
                                        className={
                                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                            ` ${
                                                objectives[selectedObjective]
                                                    .grade == 1
                                                    ? "bg-green-400 text-green-50 border-transparent"
                                                    : " text-green-500 bg-green-100 border-green-300"
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
                                            objectives[selectedObjective]
                                                .status == "graded"
                                        }
                                        onClick={() =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].grade = 2;
                                                return arr;
                                            })
                                        }
                                        className={
                                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                            ` ${
                                                objectives[selectedObjective]
                                                    .grade == 2
                                                    ? "bg-green-400 text-green-50 border-transparent"
                                                    : " text-green-500 bg-green-100 border-green-300"
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
                                            objectives[selectedObjective]
                                                .status == "graded"
                                        }
                                        onClick={() =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].grade = 3;
                                                return arr;
                                            })
                                        }
                                        className={
                                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                            ` ${
                                                objectives[selectedObjective]
                                                    .grade == 3
                                                    ? "bg-green-400 text-green-50 border-transparent"
                                                    : " text-green-500 bg-green-100 border-green-300"
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
                                            objectives[selectedObjective]
                                                .status == "graded"
                                        }
                                        onClick={() =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].grade = 4;
                                                return arr;
                                            })
                                        }
                                        className={
                                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                            ` ${
                                                objectives[selectedObjective]
                                                    .grade == 4
                                                    ? "bg-green-400 text-green-50 border-transparent"
                                                    : " text-green-500 bg-green-100 border-green-300"
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
                                            objectives[selectedObjective]
                                                .status == "graded"
                                        }
                                        onClick={() =>
                                            setObjectives((prev) => {
                                                const arr = [...prev];
                                                arr[
                                                    selectedObjective
                                                ].grade = 5;
                                                return arr;
                                            })
                                        }
                                        className={
                                            "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                            ` ${
                                                objectives[selectedObjective]
                                                    .grade == 5
                                                    ? "bg-green-400 text-green-50 border-transparent"
                                                    : " text-green-500 bg-green-100 border-green-300"
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
                                        objectives[selectedObjective].status ==
                                            "graded"
                                    }
                                    value={
                                        objectives[selectedObjective].comment ??
                                        ""
                                    }
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                        setObjectives((prev) => {
                                            const arr = [...prev];
                                            arr[selectedObjective].comment =
                                                e.target.value;
                                            return arr;
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
