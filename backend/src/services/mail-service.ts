import nodemailer from "nodemailer";

class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "YourSMTPService", // e.g., 'Gmail'
            auth: {
                user: "your_email@example.com",
                pass: "your_password",
            },
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string) {
        try {
            const mailOptions: nodemailer.SendMailOptions = {
                from: "your_email@example.com",
                to,
                subject,
                text,
                html,
            };

            await this.transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}

export default new MailService();
