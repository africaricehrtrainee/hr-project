import { useEffect, useState } from "react";
import Chip from "./ui/Chip";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "./ui/Button";
import { cn, getCurrentMySQLDate } from "@/util/utils";

interface ObjectiveListProps {
    user: string;
    employeeId: string;
    cache: Objective[];
    objectives: Objective[];
    setObjectives: React.Dispatch<React.SetStateAction<Objective[]>>;
    onSubmit: () => any;
    selectedObjective: number;
    setSelectedObjective: React.Dispatch<React.SetStateAction<number>>;
}

const ObjectiveList: React.FC<ObjectiveListProps> = ({
    cache,
    objectives,
    setObjectives,
    onSubmit,
    selectedObjective,
    setSelectedObjective,
    employeeId,
    user,
}) => {
    return (
        <div className="relative flex h-[450px] w-[275px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white shadow-sm transition-all">
            <div className="flex w-full items-start justify-between p-4">
                <Chip>
                    Objectives
                    <Icon icon="mdi:goal" className="ml-1" fontSize={14} />
                </Chip>
                {user != "supervisor" && (
                    <Button
                        disabled={objectives.length >= 4}
                        onClick={() => {
                            const arr = [...objectives];
                            arr.push({
                                employeeId: parseInt(employeeId),
                                objectiveId: 0,
                                status: "draft",
                                title: null,
                                description: null,
                                successConditions: null,
                                deadline: null,
                                kpi: null,
                                efficiency: null,
                                competency: null,
                                commitment: null,
                                initiative: null,
                                respect: null,
                                leadership: null,
                                createdAt: getCurrentMySQLDate(),
                                updatedAt: getCurrentMySQLDate(),
                            });
                            setObjectives(arr);
                        }}
                        variant="outline"
                    >
                        Create
                        <Icon
                            icon="ic:baseline-plus"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                )}
            </div>
            <div className="w-full">
                {objectives
                    .filter((objective) =>
                        user == "supervisor"
                            ? objective.status != "draft"
                            : true
                    )
                    .map((objective, i) => (
                        <button
                            onClick={() => setSelectedObjective(i)}
                            className={cn(
                                "flex w-full flex-col relative items-start justify-start border-b border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50",
                                {
                                    "bg-zinc-50": i === selectedObjective,
                                }
                            )}
                            key={i}
                        >
                            {" "}
                            <div className="flex w-full items-center justify-between">
                                {objective.status === "draft" && (
                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-zinc-300 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                        Draft
                                        <Icon
                                            icon="octicon:issue-draft-16"
                                            className="ml-1"
                                            fontSize={10}
                                        />
                                    </div>
                                )}
                                {objective.status === "sent" && (
                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-500">
                                        Sent
                                        <Icon
                                            icon="carbon:send-alt-filled"
                                            className="ml-1"
                                            fontSize={10}
                                        />
                                    </div>
                                )}
                                {objective.status === "invalid" && (
                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-red-100 p-1 px-2 text-[8px] font-semibold text-red-500">
                                        Invalid
                                        <Icon
                                            icon="mdi:alert"
                                            className="ml-1"
                                            fontSize={10}
                                        />
                                    </div>
                                )}
                                {objective.status === "ok" && (
                                    <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-500">
                                        OK
                                        <Icon
                                            icon="material-symbols:check"
                                            className="ml-1"
                                            fontSize={10}
                                        />
                                    </div>
                                )}
                                <div className="text-end">
                                    <p className="-mt-0 text-[8px] font-bold text-zinc-500">
                                        {objective.updatedAt.substring(0, 10)}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-2 text-[8px] font-medium text-zinc-300">
                                OBJECTIVE TITLE
                            </p>
                            <p className="w-[200px] truncate text-start text-xs font-bold text-zinc-700">
                                {objective.title ? objective.title : "Untitled"}
                            </p>
                        </button>
                    ))}
            </div>
            {user != "supervisor" && (
                <>
                    <Button
                        className="absolute bottom-4 left-4"
                        disabled={
                            JSON.stringify(cache) === JSON.stringify(objectives)
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
                            objectives.every(
                                (objective) => objective.status == "sent"
                            ) ||
                            objectives.some(
                                (objective) =>
                                    !objective.title ||
                                    !objective.deadline ||
                                    !objective.kpi ||
                                    !objective.description ||
                                    !objective.successConditions
                            )
                            // objectives.some((objective) => objective.title == "") ||
                        }
                        onClick={() => {
                            setObjectives((prev) => {
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
                </>
            )}
        </div>
    );
};

export default ObjectiveList;
