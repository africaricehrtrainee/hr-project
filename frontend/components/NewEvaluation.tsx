"use client";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SetStateAction, useState } from "react";

export function NewEvaluation({
    user,
    evaluations,
    setEvaluations,
    onSubmit,
    cache,
}: {
    user: string;
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
    return (
        <div className="relative flex flex-1 flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            {evaluations[index] && (
                <>
                    <div className="flex w-full items-center justify-between">
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
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col justify-start gap-1">
                                    <label className="text-[10px] font-medium text-zinc-300">
                                        EFFICIENCY / EFFICACITE
                                    </label>
                                    <div className="flex w-full items-center justify-start gap-8">
                                        <div className="flex flex-col items-center justify-center">
                                            <input
                                                type="radio"
                                                name="rating-efficiency"
                                                id="1"
                                                value="1"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
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
                                            />
                                            <label className="text-[10px] font-bold text-zinc-800">
                                                1
                                            </label>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <input
                                                type="radio"
                                                name="rating-efficiency"
                                                id="1"
                                                value="2"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
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
                                            />
                                            <label className="text-[10px] font-bold text-zinc-800">
                                                2
                                            </label>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <input
                                                type="radio"
                                                name="rating-efficiency"
                                                id="1"
                                                value="3"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
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
                                            />
                                            <label className="text-[10px] font-bold text-zinc-800">
                                                3
                                            </label>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <input
                                                type="radio"
                                                name="rating-efficiency"
                                                id="1"
                                                value="4"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
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
                                            />
                                            <label className="text-[10px] font-bold text-zinc-800">
                                                4
                                            </label>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <input
                                                type="radio"
                                                name="rating-efficiency"
                                                id="1"
                                                value="5"
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
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
                                            />
                                            <label className="text-[10px] font-bold text-zinc-800">
                                                5
                                            </label>
                                        </div>
                                    </div>
                                    <textarea
                                        autoCorrect="off"
                                        spellCheck="false"
                                        disabled={
                                            user !==
                                            evaluations[
                                                index
                                            ].authorId.toString()
                                        }
                                        value={
                                            evaluations[index].authorId ?? ""
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
                                        className="h-[80px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                    />
                                </div>
                            </div>
                        </form>
                        {parseInt(user) == evaluations[index].authorId && (
                            <div className="absolute bottom-4 right-4 flex w-full items-center justify-end gap-2">
                                <Button
                                    className="absolute bottom-4 left-4"
                                    disabled={
                                        JSON.stringify(cache) ===
                                        JSON.stringify(evaluations)
                                        // objectives.some((objective) => objective.title == "") ||
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
                                    className="absolute bottom-4 right-4"
                                    disabled={
                                        evaluations.every(
                                            (objective) =>
                                                objective.status == "sent"
                                        ) ||
                                        evaluations.some(
                                            (evaluations) =>
                                                !evaluations.efficiency
                                        )
                                        // objectives.some((objective) => objective.title == "") ||
                                    }
                                    onClick={() => {
                                        setEvaluations((prev) => {
                                            let arr = [...prev];
                                            for (const objective of arr) {
                                                objective.status =
                                                    objective.status == "draft"
                                                        ? "sent"
                                                        : objective.status;
                                            }
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
            )}
        </div>
    );
}
