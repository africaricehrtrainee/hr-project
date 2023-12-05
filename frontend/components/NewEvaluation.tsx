"use client";
import { EmployeeResult } from "@/app/objectives/[userId]/page";
import Button from "@/components/ui/Button";
import { getCurrentMySQLDate } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SetStateAction, useEffect, useState } from "react";

export function NewEvaluation({
    user,
    evaluations,
    setEvaluations,
    onSubmit,
    cache,
    employee,
}: {
    user: Employee;
    employee: EmployeeResult;
    cache: Evaluation[];
    evaluations: Evaluation[];
    setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
    onSubmit: () => any;
}) {
    const [index, setIndex] = useState<number>(
        evaluations.findIndex(
            (evaluation) => evaluation.authorId !== evaluation.employeeId
        )
    );

    const metrics: {
        name:
            | "efficiency"
            | "competency"
            | "commitment"
            | "initiative"
            | "respect"
            | "leadership";
        rating:
            | "efficiencyRating"
            | "competencyRating"
            | "commitmentRating"
            | "initiativeRating"
            | "respectRating"
            | "leadershipRating";
        label: string;
    }[] = [
        {
            name: "efficiency",
            rating: "efficiencyRating",
            label: "EFFICIENCY / EFFICACITE",
        },
        {
            name: "competency",
            rating: "competencyRating",
            label: "TECHNICAL COMPETENCY / COMPETENCES TECHNIQUES",
        },
        {
            name: "commitment",
            rating: "commitmentRating",
            label: "COMMITMENT / ENGAGEMENT",
        },
        {
            name: "initiative",
            rating: "initiativeRating",
            label: "TAKING INITITATIVE / PRISE D’INITIATIVE",
        },
        {
            name: "respect",
            rating: "respectRating",
            label: "FOLLOWING INSTRUCTIONS / RESPECT DES PROCEDURES",
        },
        {
            name: "leadership",
            rating: "leadershipRating",
            label: "LEADERSHIP",
        },
    ];

    useEffect(() => {
        setIndex(
            evaluations.findIndex(
                (evaluation) => evaluation.authorId != evaluation.employeeId
            )
        );
    }, [evaluations]);
    return (
        <div className="relative flex min-h-[500px] flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            {evaluations[index] &&
            ((user.employeeId !== evaluations[index].authorId &&
                evaluations[index].status == "sent") ||
                user.employeeId == evaluations[index].authorId) ? (
                <>
                    <div className="flex w-full items-center justify-between">
                        {evaluations[index].status == "draft" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                Draft
                                <Icon
                                    icon="octicon:issue-draft-16"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                        {evaluations[index].status == "sent" && (
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                Sent
                                <Icon
                                    icon="carbon:send-alt-filled"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-2 h-full w-full">
                        <p className="text-2xl font-bold text-zinc-700">
                            Your evaluation
                        </p>
                        <form className="mt-1 grid w-full grid-cols-2 gap-4 pt-2">
                            <div className="flex flex-col gap-3">
                                {metrics.slice(0, 3).map((metric) => (
                                    <div
                                        key={metric.name}
                                        className="flex flex-col justify-start gap-1"
                                    >
                                        <label className="text-[10px] font-medium text-zinc-300">
                                            {metric.label}
                                        </label>
                                        <div className="flex w-full items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index].status ==
                                                        "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 1;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-red-300 hover:text-red-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 1
                                                            ? "bg-red-400 text-red-50 border-transparent"
                                                            : " text-red-500 bg-red-100 border-red-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M19 15h4V3h-4m-4 0H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 0 0 2 2h6.31l-.95 4.57c-.02.1-.03.2-.03.31c0 .42.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5a2 2 0 0 0-2-2Z"
                                                    />
                                                </svg>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M19 15h4V3h-4m-4 0H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 0 0 2 2h6.31l-.95 4.57c-.02.1-.03.2-.03.31c0 .42.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5a2 2 0 0 0-2-2Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 2;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-red-300 hover:text-red-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 2
                                                            ? "bg-red-400 text-red-50 border-transparent"
                                                            : " text-red-500 bg-red-100 border-red-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M19 15h4V3h-4m-4 0H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 0 0 2 2h6.31l-.95 4.57c-.02.1-.03.2-.03.31c0 .42.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5a2 2 0 0 0-2-2Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 3;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-orange-300 hover:text-orange-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 3
                                                            ? "bg-orange-400 text-orange-50 border-transparent"
                                                            : " text-orange-500 bg-orange-100 border-orange-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        fill-rule="evenodd"
                                                        d="M1 10a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1Z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 4;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 4
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-100 border-green-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 5;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 5
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-100 border-green-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"
                                                    />
                                                </svg>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <textarea
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={
                                                user.employeeId !==
                                                    evaluations[index]
                                                        .authorId ||
                                                evaluations[index].status ==
                                                    "sent"
                                            }
                                            value={
                                                evaluations[index][
                                                    metric.name
                                                ] ?? ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[index][metric.name] =
                                                        e.target.value;
                                                    return arr;
                                                })
                                            }
                                            placeholder={`Write your ${metric.name} review`}
                                            className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-3">
                                {metrics.slice(3, 6).map((metric) => (
                                    <div
                                        key={metric.name}
                                        className="flex flex-col justify-start gap-1"
                                    >
                                        <label className="text-[10px] font-medium text-zinc-300">
                                            {metric.label}
                                        </label>
                                        <div className="flex w-full items-center justify-center gap-1">
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index].status ==
                                                        "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 1;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-red-300 hover:text-red-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 1
                                                            ? "bg-red-400 text-red-50 border-transparent"
                                                            : " text-red-500 bg-red-100 border-red-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M19 15h4V3h-4m-4 0H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 0 0 2 2h6.31l-.95 4.57c-.02.1-.03.2-.03.31c0 .42.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5a2 2 0 0 0-2-2Z"
                                                    />
                                                </svg>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M19 15h4V3h-4m-4 0H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 0 0 2 2h6.31l-.95 4.57c-.02.1-.03.2-.03.31c0 .42.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5a2 2 0 0 0-2-2Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 2;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-red-300 hover:text-red-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 2
                                                            ? "bg-red-400 text-red-50 border-transparent"
                                                            : " text-red-500 bg-red-100 border-red-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M19 15h4V3h-4m-4 0H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2a2 2 0 0 0 2 2h6.31l-.95 4.57c-.02.1-.03.2-.03.31c0 .42.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5a2 2 0 0 0-2-2Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 3;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-orange-300 hover:text-orange-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 3
                                                            ? "bg-orange-400 text-orange-50 border-transparent"
                                                            : " text-orange-500 bg-orange-100 border-orange-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        fill-rule="evenodd"
                                                        d="M1 10a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1Z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 4;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 4
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-100 border-green-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    user.employeeId !==
                                                        employee.supervisorId ||
                                                    evaluations[index][
                                                        metric.name
                                                    ] == "sent"
                                                }
                                                onClick={() =>
                                                    setEvaluations((prev) => {
                                                        const arr = [...prev];
                                                        arr[index][
                                                            metric.rating
                                                        ] = 5;
                                                        return arr;
                                                    })
                                                }
                                                className={
                                                    "flex flex-1 items-center justify-center rounded-md border p-1 text-xs font-bold  transition-all hover:bg-green-300 hover:text-green-50 gap-1" +
                                                    ` ${
                                                        evaluations[index][
                                                            metric.rating
                                                        ] == 5
                                                            ? "bg-green-400 text-green-50 border-transparent"
                                                            : " text-green-500 bg-green-100 border-green-300"
                                                    }`
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"
                                                    />
                                                </svg>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <textarea
                                            autoCorrect="off"
                                            spellCheck="false"
                                            disabled={
                                                user.employeeId !==
                                                    evaluations[index]
                                                        .authorId ||
                                                evaluations[index].status ==
                                                    "sent"
                                            }
                                            value={
                                                evaluations[index][
                                                    metric.name
                                                ] ?? ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[index][metric.name] =
                                                        e.target.value;
                                                    return arr;
                                                })
                                            }
                                            placeholder={`Write your ${metric.name} review`}
                                            className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>
                        {user.employeeId == evaluations[index].authorId && (
                            <div className="absolute right-4 top-4 flex w-full items-center justify-end gap-2">
                                <Button
                                    disabled={
                                        JSON.stringify(cache) ===
                                        JSON.stringify(evaluations)
                                    }
                                    onClick={() => {
                                        onSubmit();
                                    }}
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
                                    disabled={
                                        evaluations.every(
                                            (objective) =>
                                                objective.status == "sent"
                                        ) ||
                                        evaluations.some(
                                            (evaluations) =>
                                                !evaluations.efficiency ||
                                                !evaluations.efficiencyRating ||
                                                !evaluations.competency ||
                                                !evaluations.competencyRating ||
                                                !evaluations.commitment ||
                                                !evaluations.commitmentRating ||
                                                !evaluations.initiative ||
                                                !evaluations.initiativeRating ||
                                                !evaluations.respect ||
                                                !evaluations.respectRating ||
                                                !evaluations.leadership ||
                                                !evaluations.leadershipRating
                                        )
                                        // objectives.some((objective) => objective.title == "") ||
                                    }
                                    onClick={() => {
                                        setEvaluations((prev) => {
                                            let arr = [...prev];
                                            arr[index].status = "sent";
                                            return arr;
                                        });
                                        onSubmit();
                                    }}
                                    variant="primary"
                                >
                                    Submit
                                    <Icon
                                        icon="material-symbols:upload"
                                        className="ml-1"
                                        fontSize={14}
                                    />
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-zinc-300">
                        <Icon icon="iconamoon:pen-fill" fontSize={64} />
                        <h1 className="text-2xl font-bold">
                            An evaluation has not been made yet.
                        </h1>
                        {user.employeeId == employee.supervisorId && (
                            <Button
                                className=""
                                disabled={
                                    evaluations.some(
                                        (evaluation) =>
                                            evaluation.authorId !==
                                            evaluation.employeeId
                                    ) ||
                                    user.employeeId !== employee.supervisorId
                                }
                                onClick={() => {
                                    setEvaluations((prev) => {
                                        const arr = [...prev];
                                        arr.push({
                                            authorId: user.employeeId,
                                            employeeId: employee.employeeId,
                                            commitment: null,
                                            commitmentRating: null,
                                            competency: null,
                                            competencyRating: null,
                                            createdAt: getCurrentMySQLDate(),
                                            updatedAt: getCurrentMySQLDate(),
                                            efficiency: null,
                                            efficiencyRating: null,
                                            evaluationId: 0,
                                            evaluationYear: "2024",
                                            initiative: null,
                                            initiativeRating: null,
                                            leadership: null,
                                            leadershipRating: null,
                                            respect: null,
                                            respectRating: null,
                                            status: "draft",
                                        });
                                        return arr;
                                    });
                                }}
                                variant="primary"
                            >
                                Start evaluation
                                <Icon
                                    icon="material-symbols:grade"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
