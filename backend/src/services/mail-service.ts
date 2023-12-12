import nodemailer from "nodemailer";

// Define a class named MailService
class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Create a nodemailer transporter with your SMTP service configuration
        this.transporter = nodemailer.createTransport({
            service: "YourSMTPService", // Specify the SMTP service provider (e.g., 'Gmail')
            auth: {
                user: "your_email@example.com", // Your email address
                pass: "your_password", // Your email password or app-specific password
            },
        });
    }

    // Define a method to send an email
    async sendMail(to: string, subject: string, text: string, html?: string) {
        try {
            // Create an object with email options
            const mailOptions: nodemailer.SendMailOptions = {
                from: "your_email@example.com", // Sender's email address
                to, // Recipient's email address
                subject, // Email subject
                text, // Plain text version of the email
                html, // HTML version of the email (optional)
            };

            // Use the transporter to send the email
            await this.transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
            throw error; // Throw an error if there's a problem sending the email
        }
    }
}

// Export an instance of the MailService class
export default new MailService();
