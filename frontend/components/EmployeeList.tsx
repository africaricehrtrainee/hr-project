// EmployeeList.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import EmployeeForm from "./NewEmployee";
import { cn } from "@/util/utils";

interface EmployeeListProps {
    employees: Array<Employee>;
    fetch: () => any; // Define the type for the "employees" prop
    setSelectedEmployee: (idx: number) => void;
    selectedEmployee: number;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
    employees,
    fetch,
    setSelectedEmployee,
    selectedEmployee,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"hr" | "admin" | "deleted" | "">();

    return (
        <div className="flex h-full w-full flex-col items-start justify-start rounded-md border border-zinc-200 bg-white p-8 shadow-sm transition-all">
            <div className="flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-green-100 p-1 px-2 text-[8px] font-semibold text-green-700">
                Dashboard
                <Icon
                    icon="fluent:board-16-filled"
                    className="ml-1"
                    fontSize={10}
                />
            </div>
            <div className="mt-2 flex w-full items-center justify-between">
                <p className="text-2xl font-bold text-zinc-700">
                    Staff accounts
                </p>
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        onClick={() => setShowModal(true)}
                    >
                        Create employee
                        <Icon
                            icon="majesticons:plus-line"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                    <Button variant="outline" onClick={() => fetch()}>
                        Refresh
                        <Icon
                            icon="bx:refresh"
                            className="ml-1"
                            fontSize={14}
                        />
                    </Button>
                </div>
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <EmployeeForm
                        onFormSubmit={(success) => {
                            if (success) {
                                setShowModal(false);
                                fetch();
                            } else {
                            }
                        }}
                    />
                </Modal>
            </div>
            <div className="flex items-start justify-start gap-3 mt-2 ">
                <input
                    autoCorrect="off"
                    spellCheck="false"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for a staff member"
                    className="w-[400px] rounded-md border border-zinc-200 p-2 px-3 text-xs font-semibold outline-none transition-all placeholder:text-zinc-300 hover:border-zinc-500 focus:border-brand focus:outline-brand-light disabled:text-zinc-500"
                />
                <button
                    type="button"
                    onClick={() =>
                        filter == "admin" ? setFilter("") : setFilter("admin")
                    }
                    className={cn(
                        "flex items-center h-full transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                        filter === "admin"
                            ? "bg-blue-600 text-blue-100"
                            : "bg-zinc-100 text-zinc-700"
                    )}
                >
                    Admin
                    <Icon icon="bxs:wrench" className="ml-1" fontSize={10} />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        filter == "hr" ? setFilter("") : setFilter("hr")
                    }
                    className={cn(
                        "flex items-center h-full transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                        filter === "hr"
                            ? "bg-purple-600 text-purple-100"
                            : "bg-zinc-100 text-zinc-700"
                    )}
                >
                    HR
                    <Icon
                        icon="iconoir:eye-solid"
                        className="ml-1"
                        fontSize={10}
                    />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        filter == "deleted"
                            ? setFilter("")
                            : setFilter("deleted")
                    }
                    className={cn(
                        "flex items-center h-full transition-all justify-center gap-0 whitespace-nowrap rounded-md p-2 px-2 text-[10px] font-semibold",
                        filter === "deleted"
                            ? "bg-zinc-600 text-zinc-100"
                            : "bg-zinc-100 text-zinc-700"
                    )}
                >
                    Deleted
                    <Icon icon="charm:cross" className="ml-1" fontSize={10} />
                </button>
            </div>
            <div className="scroll-hover mt-8 h-full w-full flex-col items-start justify-start overflow-y-scroll transition-all">
                {employees
                    .filter((employee) => {
                        let fil =
                            filter == "deleted"
                                ? employee.deletedAt != null
                                : filter == "hr"
                                ? employee.role == "hr"
                                : filter == "admin"
                                ? employee.role == "admin"
                                : true;
                        return (
                            fil &&
                            (employee.firstName
                                ?.toLowerCase()
                                .includes(search) ||
                                employee.lastName
                                    ?.toLowerCase()
                                    .includes(search) ||
                                employee.email
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
                                    selectedEmployee == i
                                        ? setSelectedEmployee(-1)
                                        : setSelectedEmployee(i);
                                }}
                                className={cn(
                                    "grid grid-cols-5 w-full relative items-center justify-start border-b border-t border-b-zinc-100 border-t-zinc-100 p-2 px-4 transition-all hover:bg-zinc-50 ",
                                    `${
                                        i == selectedEmployee
                                            ? "bg-zinc-50 hover:bg-zinc-50"
                                            : ""
                                    }`,
                                    `${
                                        employee.deletedAt !== null
                                            ? "opacity-50"
                                            : ""
                                    }`
                                )}
                                key={i}
                            >
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        LAST NAME
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs text-zinc-700 max-w-[150px] truncate",
                                            selectedEmployee == i
                                                ? "font-bold"
                                                : "font-medium"
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
                                        EMAIL
                                    </p>
                                    <p className="max-w-[150px] truncate text-xs font-medium text-zinc-700">
                                        {employee.email}
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
                                <div className="flex flex-col items-start justify-start">
                                    <p className="text-[8px] font-medium text-zinc-300">
                                        ROLES
                                    </p>
                                    <div className="flex gap-1">
                                        <div className="flex items-center justify-center gap-0 whitespace-nowrap rounded-md bg-zinc-100 p-1 px-2 text-[8px] font-semibold text-zinc-700">
                                            Staff
                                            <Icon
                                                icon="mdi:tag"
                                                className="ml-1"
                                                fontSize={8}
                                            />
                                        </div>
                                        {employee.role == "hr" && (
                                            <div className="flex items-center justify-center gap-0 whitespace-nowrap rounded-md bg-purple-100 p-1 px-2 text-[8px] font-semibold text-purple-700">
                                                HR
                                                <Icon
                                                    icon="iconoir:eye-solid"
                                                    className="ml-1"
                                                    fontSize={8}
                                                />
                                            </div>
                                        )}
                                        {employee.role == "admin" && (
                                            <div className="flex items-center justify-center gap-0 whitespace-nowrap rounded-md bg-blue-100 p-1 px-2 text-[8px] font-semibold text-blue-700">
                                                Admin
                                                <Icon
                                                    icon="bxs:wrench"
                                                    className="ml-1"
                                                    fontSize={8}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default EmployeeList;
