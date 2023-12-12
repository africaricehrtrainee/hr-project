"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// Define a class named MailService
class MailService {
    constructor() {
        // Create a nodemailer transporter with your SMTP service configuration
        this.transporter = nodemailer_1.default.createTransport({
            service: "YourSMTPService", // Specify the SMTP service provider (e.g., 'Gmail')
            auth: {
                user: "your_email@example.com", // Your email address
                pass: "your_password", // Your email password or app-specific password
            },
        });
    }
    // Define a method to send an email
    sendMail(to, subject, text, html) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create an object with email options
                const mailOptions = {
                    from: "your_email@example.com", // Sender's email address
                    to, // Recipient's email address
                    subject, // Email subject
                    text, // Plain text version of the email
                    html, // HTML version of the email (optional)
                };
                // Use the transporter to send the email
                yield this.transporter.sendMail(mailOptions);
                console.log("Email sent successfully");
            }
            catch (error) {
                console.error("Error sending email:", error);
                throw error; // Throw an error if there's a problem sending the email
            }
        });
    }
}
// Export an instance of the MailService class
exports.default = new MailService();
