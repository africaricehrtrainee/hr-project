import emailjs from "@emailjs/nodejs";
import { DbService } from "./db-service";
import { Employee } from "../global";

export default function sendMail({
    title,
    content,
    recipients,
}: {
    title: string;
    content: string;
    recipients: string;
}) {
    emailjs
        .send(
            "service_swkr8dc",
            "template_6ryb4f6",
            {
                title,
                content,
                recipients,
            },
            {
                publicKey: "8VojYnxF076zkbnHg",
                privateKey: "n1u5laTNhfdUwaxmHyn3U", // optional, highly recommended for security reasons
            }
        )
        .then(
            (response) => {
                console.log("SUCCESS!", response.status, response.text);
            },
            (err) => {
                console.log("FAILED...", err);
            }
        );
}

export async function mailEvaluationStep() {
    const db = new DbService();
    const employees: Employee[] = await db.query(
        `SELECT email, firstName, lastName, matricule, employeeId, deletedAt, role FROM employees WHERE deletedAt is NULL ORDER BY lastName ASC`
    );

    if (employees.length < 1 || !employees) {
        console.log("No employees have been found.");
        return null;
    }

    const recipients = employees.reduce(
        (previous, current) => previous + ";" + current.email,
        ""
    );
    const currentStep: {
        name: string;
        message: string;
        deadline: string;
    }[] = await db.query(
        `SELECT name, message, deadline FROM steps WHERE active IS TRUE`
    );

    if (!currentStep) {
        console.log("No active performance step has been found");
    }

    const getCurrentDate = (): string => new Date().toISOString().split("T")[0];
    const date = getCurrentDate();

    console.log("Current date: " + date);
    console.log("Active step of the evaluation: " + currentStep[0].deadline);

    if (date === currentStep[0].deadline) {
        sendMail({
            title: "Update from AfricaRice HR",
            content: `<h1>${currentStep[0].message}<h1>`,
            recipients,
        });
    }
}
