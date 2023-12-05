// SuperviseeList.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import EmployeeForm from "./NewEmployee";
import { cn } from "@/util/utils";
import { useRouter } from "next/navigation";
import { SuperviseeResult } from "@/app/page";

interface SuperviseeListProps {
    employees: SuperviseeResult[];
}

const SuperviseeList: React.FC<SuperviseeListProps> = ({ employees }) => {
    const [search, setSearch] = useState("");
    const router = useRouter();

    return (
        <div className="flex h-[500px] w-[350px] flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                Dashboard
                <Icon
                    icon="fluent:board-16-filled"
                    className="ml-1"
                    fontSize={10}
                />
            </div>
            <div className="mt-2 flex w-full items-center justify-between">
                <p className="text-2xl font-bold text-zinc-700">My team</p>
            </div>
            <div className="mt-2 flex items-start justify-start gap-3">
                <input
                    autoCorrect="off"
                    spellCheck="false"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a staff member"
                    className="w-[250px] rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                />
            </div>
            <div className="scroll-hover mt-8 h-full w-full flex-col items-start justify-start overflow-y-scroll transition-all">
                {employees
                    .filter((employee) => {
                        return (
                            true &&
                            (employee.firstName
                                ?.toLowerCase()
                                .includes(search) ||
                                employee.lastName
                                    ?.toLowerCase()
                                    .includes(search) ||
                                employee.matricule
                                    ?.toLowerCase()
                                    .includes(search))
                        );
                    })
                    .map((employee, i) => {
                        return (
                            <button
                                onClick={() => {
                                    router.push(
                                        `/objectives/${employee.holderId}`
                                    );
                                }}
                                className={cn(
                                    "grid grid-cols-3 w-full relative items-center justify-start border-b border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50"
                                )}
                                key={i}
                            >
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        LAST NAME
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs text-zinc-700 max-w-[150px] truncate font-medium"
                                        )}
                                    >
                                        {employee.lastName}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        FIRST NAME
                                    </p>
                                    <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
                                        {employee.firstName}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        MATRICULE
                                    </p>
                                    <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
                                        {employee.matricule}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default SuperviseeList;
