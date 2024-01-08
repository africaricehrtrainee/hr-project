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
            panzoomRef?.current?.dispose();
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
