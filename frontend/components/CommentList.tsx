"use client";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { cn } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import Modal from "./ui/Modal";
import axios from "axios";

interface CommentListProps {
    id: string;
    user: "user" | "supervisor" | string;
    objectives: Objective[];
    selectedObjective: number;
    comments: Comment[];
    cache: Comment[];
    onMark: (ok?: boolean) => any;
    fetch: () => any;
}

export const CommentList: React.FC<CommentListProps> = ({
    user,
    objectives,
    selectedObjective,
    comments,
    cache,
    fetch,
    id,
}) => {
    const [openCommentForm, setOpenCommentForm] = useState<boolean>(false);
    const [content, setContent] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState<boolean>();

    function postComment(e: React.SyntheticEvent) {
        e.preventDefault();
        setSubmitLoading(true);
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL +
                    "/api/employees/" +
                    id +
                    "/comments",
                {
                    employeeId: id,
                    objectiveId: objectives[selectedObjective].objectiveId,
                    content,
                }
            )
            .then((response) => {
                if (response.status == 201) {
                    fetch();
                    setOpenCommentForm(false);
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSubmitLoading(false);
            });
    }
    return (
        <div className="flex h-[450px] w-[350px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white shadow-sm transition-all">
            <div className="flex w-full items-center justify-between border-b border-b-zinc-100 p-4">
                <div className="">
                    <Chip>
                        Comments
                        <Icon icon="mdi:goal" className="ml-1" fontSize={14} />
                    </Chip>
                </div>
                {objectives &&
                    objectives[selectedObjective] &&
                    user == "supervisor" && (
                        <>
                            <Button
                                type="button"
                                onClick={() => setOpenCommentForm(true)}
                                disabled={openCommentForm}
                                variant="outline"
                            >
                                Create
                                <Icon
                                    icon="material-symbols:add"
                                    className="ml-1"
                                    fontSize={14}
                                />
                            </Button>
                        </>
                    )}
            </div>

            {objectives && objectives[selectedObjective] && (
                <>
                    {openCommentForm && (
                        <form
                            className="flex w-full flex-col p-4"
                            onSubmit={postComment}
                        >
                            <div className="flex w-full flex-col justify-start gap-1">
                                <label className="text-[10px] font-medium text-zinc-300">
                                    COMMENT CONTENT
                                </label>
                                <textarea
                                    required
                                    autoCorrect="off"
                                    spellCheck="false"
                                    value={content ?? ""}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) => setContent(e.target.value)}
                                    placeholder="Write any changes to be made on this objective"
                                    className="h-[100px] w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                />
                            </div>
                            <div className="mt-2 flex w-full items-center justify-start gap-2">
                                <Button
                                    type="submit"
                                    disabled={!content}
                                    variant="primary"
                                    loading={submitLoading}
                                >
                                    Submit
                                    <Icon
                                        icon="material-symbols:upload-sharp"
                                        className="ml-1"
                                        fontSize={14}
                                    />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    loading={submitLoading}
                                    onClick={() => {
                                        setContent(null);
                                        setOpenCommentForm(false);
                                    }}
                                >
                                    Cancel
                                    <Icon
                                        icon="charm:cross"
                                        className="ml-1"
                                        fontSize={14}
                                    />
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="scroll-hover h-[300px] w-full overflow-y-scroll">
                        {comments
                            .filter(
                                (comment) =>
                                    comment.objectiveId ==
                                    objectives[selectedObjective].objectiveId
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
                                        "flex w-full flex-col relative items-start justify-start border-b border-b-zinc-100  p-2 px-4 transition-all hover:bg-zinc-50"
                                    )}
                                    key={i}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                                            Comment
                                            <Icon
                                                icon="ic:baseline-star"
                                                className="ml-1"
                                                fontSize={10}
                                            />
                                        </div>
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
                                </button>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
};
