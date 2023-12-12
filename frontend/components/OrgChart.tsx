"use client";
import { constructPositionTree, getCurrentMySQLDate } from "@/util/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import panzoom, { PanZoom } from "panzoom";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

function Label({
    position,
    setPositions,
}: {
    position: Position;
    setPositions: React.Dispatch<React.SetStateAction<Position[] | null>>;
}) {
    const [isShown, setIsShown] = useState<boolean>(false);
    const targetRef = useRef<HTMLButtonElement>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [roleName, setRoleName] = useState<string>("");

    function insertPosition(parentId: number, roleName: string) {
        setPositions((prev) => {
            if (prev) {
                const arr = [...prev];
                arr.push({
                    createdAt: getCurrentMySQLDate(),
                    updatedAt: getCurrentMySQLDate(),
                    firstName: null,
                    holderId: null,
                    lastName: null,
                    name: roleName,
                    roleId: Math.ceil(Math.random() * 10000000),
                    supervisorId: parentId,
                });
                return arr;
            } else {
                return [
                    {
                        createdAt: getCurrentMySQLDate(),
                        updatedAt: getCurrentMySQLDate(),
                        firstName: null,
                        holderId: null,
                        lastName: null,
                        name: roleName,
                        roleId: Math.ceil(Math.random() * 10000000),
                        supervisorId: parentId,
                    },
                ];
            }
        });
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                targetRef.current &&
                !targetRef.current.contains(event.target as Node)
            ) {
                setIsShown(false);
            }
        };

        // Add the click event listener to the document
        document.addEventListener("click", handleClickOutside);

        return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <button
            ref={targetRef}
            onClick={(e) => {
                e.stopPropagation();
                console.log("Triggered");
                setIsShown((prev) => !prev);
            }}
            className={
                "relative select-none cursor-pointer max-w-[200px] border border-transparent hover:border-purple-300 inline-block items-center justify-center gap-1 rounded-md bg-purple-100 p-3 px-5 text-xs transition-all font-semibold text-purple-700 active:bg-purple-200 " +
                `${isShown ? "border-purple-300 bg-purple-200" : ""}`
            }
        >
            <p>{position.name}</p>
            {position.holderId ? (
                <p className="text-[10px] font-medium">
                    {position.firstName + " " + position.lastName}
                </p>
            ) : (
                <p className="text-[10px] font-medium opacity-50">N/A</p>
            )}
            {/* 
            <div
                onClick={(e) => e.stopPropagation()}
                className={
                    "absolute transition-all w-[180px] cursor-default top-full left-0 text-zinc-700 bg-white mt-1 flex flex-col items-center justify-center z-10 rounded-md border border-zinc-200 overflow-hidden shadow-sm" +
                    `${
                        !isShown
                            ? " opacity-0 -translate-y-2 pointer-events-none z-0"
                            : " opacity-100 translate-y-0"
                    }`
                }
            >
                <button
                    onClick={() => {
                        setIsCreating(true);
                        setIsShown(false);
                    }}
                    className="flex w-full items-center justify-between gap-1 p-2 px-3 transition-all hover:bg-zinc-50"
                >
                    Insert position below
                    <Icon
                        icon="ic:baseline-plus"
                        className="ml-1"
                        fontSize={16}
                    />
                </button>
                <button className="flex w-full items-center justify-between gap-1 p-2 px-3 transition-all hover:bg-zinc-50">
                    Assign position
                    <Icon
                        icon="zondicons:refresh"
                        className="ml-1"
                        fontSize={16}
                    />
                </button>
                {position.holderId && (
                    <button
                        onClick={() => {
                            setIsShown(false);
                            setPositions((prev) => {
                                if (prev) {
                                    const arr = [...prev];
                                    const i = arr.findIndex(
                                        (pos) => pos.roleId == position.roleId
                                    );
                                    if (i !== -1) {
                                        arr[i].holderId = null;
                                        return arr;
                                    } else {
                                        return [];
                                    }
                                } else {
                                    return [];
                                }
                            });
                        }}
                        className="flex w-full items-center justify-between gap-1 bg-yellow-50 p-2 px-3 text-yellow-500 transition-all hover:bg-yellow-100"
                    >
                        Set vacant
                        <Icon
                            icon="iconoir:square-dashed"
                            className="ml-1"
                            fontSize={16}
                        />
                    </button>
                )}
                <button className="flex w-full items-center justify-between gap-1 bg-red-50 p-2 px-3 text-red-500 transition-all hover:bg-red-100">
                    Delete role
                    <Icon
                        icon="mdi:alert-outline"
                        className="ml-1"
                        fontSize={16}
                    />
                </button>

                <Modal show={isCreating} onClose={() => setIsCreating(false)}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            insertPosition(position.roleId, roleName);
                            setIsCreating(false);
                            setRoleName("");
                        }}
                    >
                        <div className="flex w-[400px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
                            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
                                Position
                                <Icon
                                    icon="ic:baseline-star"
                                    className="ml-1"
                                    fontSize={10}
                                />
                            </div>
                            <div className="mt-2 flex w-full items-center justify-between">
                                <p className="text-2xl font-bold text-zinc-700">
                                    Create a position
                                </p>
                            </div>
                            <div className="mt-4 flex w-full flex-col justify-start gap-1">
                                <label className="text-[8px] font-medium text-zinc-300">
                                    JOB TITLE
                                </label>
                                <input
                                    required
                                    autoCorrect="off"
                                    spellCheck="false"
                                    type="text"
                                    value={roleName ?? ""}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setRoleName(e.target.value)}
                                    placeholder="Enter the first name"
                                    className="w-full rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                                />
                            </div>
                            <div className="mt-4 flex w-full items-center justify-start gap-2">
                                <Button
                                    type="submit"
                                    disabled={!roleName}
                                    variant="primary"
                                >
                                    Create position
                                    <Icon
                                        icon="ic:baseline-plus"
                                        className="ml-1"
                                        fontSize={14}
                                    />
                                </Button>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div> */}
        </button>
    );
}

export default function OrgChart() {
    const [positions, setPositions] = useState<Position[] | null>(null);
    const [cache, setCache] = useState<Position[]>();
    const [tree, setTree] = useState<TreeNode[]>([]);
    const elementRef = useRef(null);
    const panzoomRef = useRef<PanZoom>(null);

    // Set up panzoom on mount, and dispose on unmount
    useLayoutEffect(() => {
        // @ts-ignore
        panzoomRef.current = panzoom(elementRef.current, {
            minZoom: 0.8,
            maxZoom: 1.5,
            pinchSpeed: 0.2,
            zoomDoubleClickSpeed: 1,
        });

        panzoomRef.current.on("pan", () => console.log("Pan!"));
        panzoomRef.current.on("zoom", () => console.log("Zoom!"));

        return () => {
            // @ts-ignore
            panzoomRef.current.dispose();
        };
    }, []);

    async function fetchPositions() {
        axios
            .get<Position[]>(
                process.env.NEXT_PUBLIC_API_URL + "/api/positions/"
            )
            .then((response) => {
                if (response.data) {
                    setCache([...response.data]);
                } else {
                    setCache([]);
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchPositions();
    }, []);

    useEffect(() => {
        if (positions) {
            setTree(constructPositionTree(positions));
            console.log(constructPositionTree(positions));
        }
    }, [positions]);

    useEffect(() => {
        console.log("positions", positions);
        console.log("cache", cache);
    }, [positions, cache]);

    useEffect(() => {
        if (cache) {
            setPositions(cache.map((a) => ({ ...a })));
        }
    }, [cache]);

    function renderRootTreeNode(tree: TreeNode, depth: number) {
        if (depth == 0)
            return (
                <Tree
                    lineColor="lightgray"
                    label={
                        <Label
                            position={tree.position}
                            setPositions={setPositions}
                        />
                    }
                >
                    {tree.children.map((child) => renderRootTreeNode(child, 1))}
                </Tree>
            );
        if (!tree.children)
            return (
                <TreeNode
                    label={
                        <Label
                            position={tree.position}
                            setPositions={setPositions}
                        />
                    }
                />
            );
        else
            return (
                <TreeNode
                    label={
                        <Label
                            position={tree.position}
                            setPositions={setPositions}
                        />
                    }
                >
                    {tree.children.map((child) =>
                        renderRootTreeNode(child, depth + 1)
                    )}
                </TreeNode>
            );
    }

    return (
        <div className="relative flex h-[500px] w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white p-4 shadow-sm transition-all">
            <div className="absolute left-4 top-4 z-10 flex flex-col items-start justify-start">
                <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-purple-100 p-1 px-2 text-[8px] font-semibold text-purple-700">
                    Organization
                    <Icon
                        icon="fluent:organization-12-filled"
                        className="ml-1"
                        fontSize={10}
                    />
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                    <p className="text-2xl font-bold text-zinc-700">
                        Organizational Chart
                    </p>
                </div>
            </div>
            <div ref={elementRef}>
                {tree && (
                    <div className="flex gap-2">
                        {tree.map((root) => renderRootTreeNode(root, 0))}
                    </div>
                )}
            </div>
            <div className="absolute right-4 top-4 flex items-center justify-center gap-2">
                <Button className="" onClick={() => {}} variant="alternate">
                    Upload filesheet
                    <Icon
                        icon="mingcute:upload-3-fill"
                        className="ml-1"
                        fontSize={16}
                    />
                </Button>
                <Button
                    className=""
                    onClick={() => {
                        panzoomRef.current?.zoomTo(0, 0, 1);
                        panzoomRef.current?.smoothMoveTo(0, 0);
                    }}
                    variant="alternateOutline"
                >
                    Center organogram
                    <Icon icon="fe:target" className="ml-1" fontSize={16} />
                </Button>
            </div>
            {/* <div className="absolute right-4 top-4 flex items-center justify-start gap-2">
                <Button
                    className=""
                    disabled={
                        !positions ||
                        JSON.stringify(cache) === JSON.stringify(positions)
                    }
                    onClick={() => {
                        if (cache) {
                            setPositions(cache.map((a) => ({ ...a })));
                        }
                    }}
                    variant="alert"
                >
                    Undo changes
                    <Icon
                        icon="ic:baseline-undo"
                        className="ml-1"
                        fontSize={14}
                    />
                </Button>
                <Button
                    className=""
                    disabled={
                        !positions ||
                        JSON.stringify(cache) === JSON.stringify(positions)
                    }
                    onClick={() => {}}
                    variant="primary"
                >
                    Apply changes
                    <Icon
                        icon="heroicons-solid:save"
                        className="ml-1"
                        fontSize={14}
                    />
                </Button>
            </div> */}
        </div>
    );
}
