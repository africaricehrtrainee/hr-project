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

interface EmployeeResult {
    employeeId: number;
    firstName: string;
    lastName: string;
    employeeRoleName: string;
    supervisorFirstName: string | null;
    supervisorLastName: string | null;
    managerFirstName: string | null;
    managerLastName: string | null;
}

export default function Objectives({ params }: { params: { userId: string } }) {
    const searchParams = useSearchParams();
    const [obj, setObj] = useState<number>(0);

    const [user, setUser] = useState<string>(
        searchParams.get("user") ?? "user"
    );
    const [data, setData] = useState<Objective[]>([]);
    const [employee, setEmployee] = useState<EmployeeResult | null>(null);
    const [selectedObjective, setSelectedObjective] = useState<number>(0);
    const [objectives, setObjectives] = useState<Objective[] | null>(null);
    const [selected, setSelected] = useState<number>(0);
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [dataComment, setDataComment] = useState<Comment[]>([]);

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
                    setData([...response.data]);
                } else {
                    console.log(response);
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
                console.log(response.data);
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
                    setDataComment(response.data);
                } else {
                }
            })
            .catch((err) => console.log(err));
    }

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
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchUser();
        fetchObjectives();
        fetchComments();
    }, []);

    useEffect(() => {
        const arr = data.map((a) => ({ ...a }));
        setObj(getStep(arr));
        console.log(getStep(arr));
        setSelected(getStep(arr));
        setObjectives(arr);
    }, [data]);

    useEffect(() => {
        console.log(dataComment);
        const arr = dataComment.map((a) => ({ ...a }));
        setComments(arr);
    }, [dataComment]);

    return (
        <main className="flex min-h-screen flex-col items-start justify-start gap-2 p-8">
            {objectives !== null && employee !== null && comments !== null ? (
                <>
                    <div className="flex w-full gap-2 transition-all">
                        {/* Shows the different steps of the evaluation process and allows navigation between them */}
                        <Schedule
                            obj={obj}
                            setSelected={setSelected}
                            selected={selected}
                        />

                        {/* Shows profile card with supervisor */}

                        {employee && <Profile user={employee} />}
                    </div>
                    <div className="flex w-full gap-2 transition-all">
                        {/* Sidebar with objective list */}
                        <ObjectiveList
                            // @ts-expect-error
                            setObjectives={setObjectives}
                            onSubmit={postObjectives}
                            objectives={objectives}
                            cache={data}
                            selectedObjective={selectedObjective}
                            setSelectedObjective={setSelectedObjective}
                            employeeId={params.userId}
                            user={user}
                        />
                        {/* Main objective form */}
                        <NewObjective
                            user={user}
                            selectedObjective={selectedObjective}
                            objectives={objectives}
                            // @ts-expect-error
                            setObjectives={setObjectives}
                            selected={selected}
                            onMark={markObjective}
                            step={obj}
                        />
                        {/* List of comments of the supervisor */}
                        <CommentList
                            user={user}
                            id={params.userId}
                            objectives={objectives}
                            selectedObjective={selectedObjective}
                            // @ts-expect-error
                            setComments={setComments}
                            comments={comments}
                            cache={dataComment}
                            fetch={fetchComments}
                        />
                    </div>
                </>
            ) : (
                <></>
            )}
        </main>
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
    return (
        <div className="flex w-[150px] flex-col items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white p-4 text-center shadow-sm transition-all">
            <Chip variant="alternate">
                360 Evaluation
                <Icon
                    icon="mingcute:target-fill"
                    className="ml-1"
                    fontSize={14}
                />
            </Chip>
            <Button className="rounded-full" variant="alternate">
                Access
                <Icon
                    icon="mingcute:target-fill"
                    className="ml-1"
                    fontSize={14}
                />
            </Button>
        </div>
    );
}

function Schedule({
    obj,
    setSelected,
    selected,
}: {
    obj: number;
    setSelected: (idx: number) => any;
    selected: number;
}) {
    return (
        <div className="flex flex-col items-start justify-center gap-2 rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <Chip>
                My evaluation
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
                                ? "bg-green-500 text-green-100"
                                : "bg-green-100 text-green-500 hover:border-green-500"
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
                                ? "bg-green-500 text-green-100"
                                : "bg-green-100 text-green-500 hover:border-green-500"
                        }`
                    )}
                >
                    Evaluation
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