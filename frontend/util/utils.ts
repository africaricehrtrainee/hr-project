import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getStep(objectives: Objective[]): number {
    if (objectives.length == 0) return 0;
    else if (
        objectives.every(
            (objective) =>
                objective.efficiency &&
                objective.competency &&
                objective.commitment &&
                objective.initiative &&
                objective.respect &&
                objective.leadership
        )
    )
        return 3;
    else if (objectives.every((objective) => objective.status == "ok"))
        return 2;
    else return 1;
}

export const getCurrentMySQLDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // January is 0 in JavaScript
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
