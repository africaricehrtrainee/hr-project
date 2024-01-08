"use client";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { cn } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import Modal from "./ui/Modal";
import axios from "axios";
import {
    selectActiveObjective,
    useObjectivesDataStore,
} from "@/app/objectives/[userId]/_store/useStore";

interface CommentListProps {
    user: Employee;
    employee: EmployeeResult;
    objectives: Objective[];
    comments: Comment[];
    cache: Comment[];
    onMark: (ok?: boolean) => any;
    fetch: () => any;
}

export const CommentList: React.FC<CommentListProps> = ({
    user,
    employee,
    objectives,
    comments,
    cache,
    fetch,
}) => {
    const data = useObjectivesDataStore();
    const selectedObjective = useObjectivesDataStore(selectActiveObjective);

    const [content, setContent] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState<boolean>();

    function postComment(e: React.SyntheticEvent) {
        e.preventDefault();
        setSubmitLoading(true);
        if (!selectedObjective) {
            return null;
        }
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    employee.employeeId +
                    "/comments",
                {
                    authorId: user.employeeId,
                    employeeId: employee.employeeId,
                    objectiveId: selectedObjective.objectiveId,
                    content,
                }
            )
            .then((response) => {
                if (response.status == 201) {
                    fetch();
                    alert("Comment updated successfully");
                    setContent("");
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSubmitLoading(false);
            });
    }
    return (
        <div className="flex h-[500px] w-[300px] flex-col items-start justify-start overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 shadow-sm transition-all">
            <div className="flex w-full items-center justify-between border-b border-b-zinc-100 bg-white p-4">
                <div className="">
                    <Chip>
                        Conversation
                        <Icon icon="mdi:goal" className="ml-1" fontSize={14} />
                    </Chip>
                </div>
                <Button type="button" onClick={() => fetch()} variant="outline">
                    Refresh
                    <Icon icon="bx:refresh" className="ml-1" fontSize={14} />
                </Button>
            </div>

            {objectives && selectedObjective && (
                <>
                    <div className="scroll-hover flex h-full w-full flex-col-reverse overflow-y-scroll py-1">
                        {comments
                            .filter(
                                (comment) =>
                                    comment.objectiveId ==
                                    selectedObjective.objectiveId
                            )
                            .sort((a, b) => {
                                const dateA = new Date(a.updatedAt);
                                const dateB = new Date(b.updatedAt);

                                // Sort in descending order by comparing the dates
                                return dateB.getTime() - dateA.getTime();
                            })
                            .map((comment, i) => (
                                <button
                                    // onClick={() => setSelectedObjective(i)}
                                    className={cn(
                                        "flex w-full active:scale-95 flex-col relative justify-start transition-all p-2 py-1 " +
                                            `${
                                                comment.authorId ==
                                                user.employeeId
                                                    ? "items-end"
                                                    : "items-starte"
                                            }`
                                    )}
                                    key={i}
                                >
                                    <div
                                        className={
                                            "flex w-fit flex-col items-start justify-start rounded-md border border-zinc-100 p-3 px-4 shadow-sm bg-white"
                                        }
                                    >
                                        <div className="flex w-full items-center justify-between">
                                            {comment.authorId ==
                                                employee.employeeId && (
                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                                                    Staff
                                                    <Icon
                                                        icon="ic:baseline-star"
                                                        className="ml-1"
                                                        fontSize={10}
                                                    />
                                                </div>
                                            )}
                                            {comment.authorId ==
                                                employee.supervisorId && (
                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-purple-100 p-1 px-2 text-[8px] font-semibold text-purple-700">
                                                    Supervisor
                                                    <Icon
                                                        icon="ic:baseline-star"
                                                        className="ml-1"
                                                        fontSize={10}
                                                    />
                                                </div>
                                            )}
                                            <div className="text-end">
                                                <p className="-mt-0 text-[8px] font-bold text-zinc-500">
                                                    {comment.updatedAt.substring(
                                                        0,
                                                        10
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-2 text-[8px] font-medium text-zinc-300">
                                            COMMENT CONTENT
                                        </p>
                                        <p className="w-[200px] overflow-hidden text-ellipsis text-start text-xs font-bold text-zinc-700">
                                            {comment.content}
                                        </p>
                                    </div>
                                </button>
                            ))}
                    </div>
                    <form
                        className="flex w-full flex-col items-end justify-normal border-t border-t-zinc-100 bg-white p-4"
                        onSubmit={postComment}
                    >
                        <div className="flex w-full flex-col justify-start gap-1">
                            {" "}
                            <textarea
                                required
                                autoCorrect="off"
                                spellCheck="false"
                                value={content ?? ""}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>
                                ) => setContent(e.target.value)}
                                placeholder="Write a comment you have on this objective"
                                className="h-[60px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                            />
                        </div>
                        <div className="mt-2 flex w-full items-center justify-end gap-2">
                            <Button
                                type="submit"
                                disabled={!content}
                                variant="primary"
                                loading={submitLoading}
                            >
                                Send
                                <Icon
                                    icon="material-symbols:upload-sharp"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};
