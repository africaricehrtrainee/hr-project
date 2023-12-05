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

    useEffect(() => {
        setIndex(
            evaluations.findIndex(
                (evaluation) => evaluation.authorId !== evaluation.employeeId
            )
        );
    }, [evaluations]);
    return (
        <div className="relative flex flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
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
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        EFFICIENCY / EFFICACITE
                                    </label>
                                    <div className="flex flex-col items-center justify-center">
                                        <select
                                            disabled={
                                                evaluations[index].status ==
                                                    "sent" ||
                                                user.employeeId !=
                                                    evaluations[index].authorId
                                            }
                                            className={`w-full rounded-md border border-zinc-200 p-2 px-3 pr-2 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-800 disabled:bg-zinc-100 ${
                                                !evaluations[index]
                                                    .efficiencyRating &&
                                                "text-zinc-300"
                                            }`}
                                            name="rating-efficiency"
                                            id="rating-efficiency"
                                            value={
                                                evaluations[index]
                                                    .efficiencyRating ?? ""
                                            }
                                            onChange={(e) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[
                                                        index
                                                    ].efficiencyRating =
                                                        parseInt(
                                                            e.target.value
                                                        );
                                                    return arr;
                                                })
                                            }
                                        >
                                            <option
                                                disabled
                                                selected
                                                value=""
                                                className="text-zinc-300"
                                            >
                                                Select a rating
                                            </option>
                                            <option value="1">
                                                1 - Very Poor
                                            </option>
                                            <option value="2">2 - Poor</option>
                                            <option value="3">3 - Fair</option>
                                            <option value="4">4 - Good</option>
                                            <option value="5">
                                                5 - Excellent
                                            </option>
                                        </select>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !==
                                                evaluations[index].authorId ||
                                            evaluations[index].status == "sent"
                                        }
                                        value={
                                            evaluations[index].efficiency ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEvaluations((prev) => {
                                                const arr = [...prev];
                                                arr[index].efficiency =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Write your efficiency review"
                                        className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        TECHNICAL COMPETENCY / COMPETENCES
                                        TECHNIQUES
                                    </label>
                                    <div className="flex flex-col items-center justify-center">
                                        <select
                                            disabled={
                                                evaluations[index].status ==
                                                    "sent" ||
                                                user.employeeId !=
                                                    evaluations[index].authorId
                                            }
                                            className={`w-full rounded-md border border-zinc-200 p-2 px-3 pr-2 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-800 disabled:bg-zinc-100 ${
                                                !evaluations[index]
                                                    .competencyRating &&
                                                "text-zinc-300"
                                            }`}
                                            name="rating-competency"
                                            id="rating-competency"
                                            value={
                                                evaluations[index]
                                                    .competencyRating ?? ""
                                            }
                                            onChange={(e) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[
                                                        index
                                                    ].competencyRating =
                                                        parseInt(
                                                            e.target.value
                                                        );
                                                    return arr;
                                                })
                                            }
                                        >
                                            <option
                                                disabled
                                                selected
                                                value=""
                                                className="text-zinc-300"
                                            >
                                                Select a rating
                                            </option>
                                            <option value="1">
                                                1 - Very Poor
                                            </option>
                                            <option value="2">2 - Poor</option>
                                            <option value="3">3 - Fair</option>
                                            <option value="4">4 - Good</option>
                                            <option value="5">
                                                5 - Excellent
                                            </option>
                                        </select>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !==
                                                evaluations[index].authorId ||
                                            evaluations[index].status == "sent"
                                        }
                                        value={
                                            evaluations[index].competency ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEvaluations((prev) => {
                                                const arr = [...prev];
                                                arr[index].competency =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Write your competency review"
                                        className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        COMMITMENT / ENGAGEMENT
                                    </label>
                                    <div className="flex flex-col items-center justify-center">
                                        <select
                                            disabled={
                                                evaluations[index].status ==
                                                    "sent" ||
                                                user.employeeId !=
                                                    evaluations[index].authorId
                                            }
                                            className={`w-full rounded-md border border-zinc-200 p-2 px-3 pr-2 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-800 disabled:bg-zinc-100 ${
                                                !evaluations[index]
                                                    .commitmentRating &&
                                                "text-zinc-300"
                                            }`}
                                            name="rating-commitment"
                                            id="rating-commitment"
                                            value={
                                                evaluations[index]
                                                    .commitmentRating ?? ""
                                            }
                                            onChange={(e) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[
                                                        index
                                                    ].commitmentRating =
                                                        parseInt(
                                                            e.target.value
                                                        );
                                                    return arr;
                                                })
                                            }
                                        >
                                            <option
                                                disabled
                                                selected
                                                value=""
                                                className="text-zinc-300"
                                            >
                                                Select a rating
                                            </option>
                                            <option value="1">
                                                1 - Very Poor
                                            </option>
                                            <option value="2">2 - Poor</option>
                                            <option value="3">3 - Fair</option>
                                            <option value="4">4 - Good</option>
                                            <option value="5">
                                                5 - Excellent
                                            </option>
                                        </select>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !==
                                                evaluations[index].authorId ||
                                            evaluations[index].status == "sent"
                                        }
                                        value={
                                            evaluations[index].commitment ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEvaluations((prev) => {
                                                const arr = [...prev];
                                                arr[index].commitment =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Write your commitment review"
                                        className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        TAKING INITITATIVE / PRISE D’INITIATIVE
                                    </label>
                                    <div className="flex flex-col items-center justify-center">
                                        <select
                                            disabled={
                                                evaluations[index].status ==
                                                    "sent" ||
                                                user.employeeId !=
                                                    evaluations[index].authorId
                                            }
                                            className={`w-full rounded-md border border-zinc-200 p-2 px-3 pr-2 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-800 disabled:bg-zinc-100 ${
                                                !evaluations[index]
                                                    .initiativeRating &&
                                                "text-zinc-300"
                                            }`}
                                            name="rating-initiative"
                                            id="rating-initiative"
                                            value={
                                                evaluations[index]
                                                    .initiativeRating ?? ""
                                            }
                                            onChange={(e) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[
                                                        index
                                                    ].initiativeRating =
                                                        parseInt(
                                                            e.target.value
                                                        );
                                                    return arr;
                                                })
                                            }
                                        >
                                            <option
                                                disabled
                                                selected
                                                value=""
                                                className="text-zinc-300"
                                            >
                                                Select a rating
                                            </option>
                                            <option value="1">
                                                1 - Very Poor
                                            </option>
                                            <option value="2">2 - Poor</option>
                                            <option value="3">3 - Fair</option>
                                            <option value="4">4 - Good</option>
                                            <option value="5">
                                                5 - Excellent
                                            </option>
                                        </select>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !==
                                                evaluations[index].authorId ||
                                            evaluations[index].status == "sent"
                                        }
                                        value={
                                            evaluations[index].initiative ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEvaluations((prev) => {
                                                const arr = [...prev];
                                                arr[index].initiative =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Write your initiative review"
                                        className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        FOLLOWING INSTRUCTIONS / RESPECT DES
                                        PROCEDURES
                                    </label>
                                    <div className="flex flex-col items-center justify-center">
                                        <select
                                            disabled={
                                                evaluations[index].status ==
                                                    "sent" ||
                                                user.employeeId !=
                                                    evaluations[index].authorId
                                            }
                                            className={`w-full rounded-md border border-zinc-200 p-2 px-3 pr-2 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-800 disabled:bg-zinc-100 ${
                                                !evaluations[index]
                                                    .respectRating &&
                                                "text-zinc-300"
                                            }`}
                                            name="rating-respect"
                                            id="rating-respect"
                                            value={
                                                evaluations[index]
                                                    .respectRating ?? ""
                                            }
                                            onChange={(e) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[index].respectRating =
                                                        parseInt(
                                                            e.target.value
                                                        );
                                                    return arr;
                                                })
                                            }
                                        >
                                            <option
                                                disabled
                                                selected
                                                value=""
                                                className="text-zinc-300"
                                            >
                                                Select a rating
                                            </option>
                                            <option value="1">
                                                1 - Very Poor
                                            </option>
                                            <option value="2">2 - Poor</option>
                                            <option value="3">3 - Fair</option>
                                            <option value="4">4 - Good</option>
                                            <option value="5">
                                                5 - Excellent
                                            </option>
                                        </select>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !==
                                                evaluations[index].authorId ||
                                            evaluations[index].status == "sent"
                                        }
                                        value={evaluations[index].respect ?? ""}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEvaluations((prev) => {
                                                const arr = [...prev];
                                                arr[index].respect =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Write your diligence review"
                                        className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>

                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        LEADERSHIP
                                    </label>
                                    <div className="flex flex-col items-center justify-center">
                                        <select
                                            disabled={
                                                evaluations[index].status ==
                                                    "sent" ||
                                                user.employeeId !=
                                                    evaluations[index].authorId
                                            }
                                            className={`w-full rounded-md border border-zinc-200 p-2 px-3 pr-2 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-800 disabled:bg-zinc-100 ${
                                                !evaluations[index]
                                                    .leadershipRating &&
                                                "text-zinc-300"
                                            }`}
                                            name="rating-leadership"
                                            id="rating-leadership"
                                            value={
                                                evaluations[index]
                                                    .leadershipRating ?? ""
                                            }
                                            onChange={(e) =>
                                                setEvaluations((prev) => {
                                                    const arr = [...prev];
                                                    arr[
                                                        index
                                                    ].leadershipRating =
                                                        parseInt(
                                                            e.target.value
                                                        );
                                                    return arr;
                                                })
                                            }
                                        >
                                            <option
                                                disabled
                                                selected
                                                value=""
                                                className="text-zinc-300"
                                            >
                                                Select a rating
                                            </option>
                                            <option value="1">
                                                1 - Very Poor
                                            </option>
                                            <option value="2">2 - Poor</option>
                                            <option value="3">3 - Fair</option>
                                            <option value="4">4 - Good</option>
                                            <option value="5">
                                                5 - Excellent
                                            </option>
                                        </select>
                                    </div>

                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user.employeeId !==
                                                evaluations[index].authorId ||
                                            evaluations[index].status == "sent"
                                        }
                                        value={
                                            evaluations[index].leadership ?? ""
                                        }
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>
                                        ) =>
                                            setEvaluations((prev) => {
                                                const arr = [...prev];
                                                arr[index].leadership =
                                                    e.target.value;
                                                return arr;
                                            })
                                        }
                                        placeholder="Write your leadership review"
                                        className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
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
                        <Icon icon="fluent:dust-20-filled" fontSize={64} />
                        <h1 className="text-2xl font-bold">
                            An evaluation has not been made yet.
                        </h1>
                        {user.employeeId !== employee.employeeId && (
                            <Button
                                className=""
                                disabled={evaluations.some(
                                    (evaluation) =>
                                        evaluation.authorId !==
                                        evaluation.employeeId
                                )}
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
                                    icon="mdi:performance"
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
