import nodemailer from "nodemailer";
import { metaData } from "./utils";

type SendEmailOptions = {
    to: string;
    subject: string;
    html: string;
};

// Control flags
const gmail = "allow";   // allow || deny
const yahoo = "deny";   // allow || deny
const webmail = "deny"; // allow || deny
const brevo = "allow";   // allow || deny
export const allowEmailSending = 1; // 1 = send, 0 = don't send

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
    if (!allowEmailSending) {
        console.warn("❌ Email sending is disabled globally");
        return false;
    }

    const senderName = metaData.name + " Team";

    const brevoTransporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_API_KEY,
        },
    });

    const gmailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER!,
            pass: process.env.GMAIL_PASS,
        },
    });

    const yahooTransporter = nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.YAHOO_USER!,
            pass: process.env.YAHOO_PASS,
        },
    });

    const webMailTransporter = nodemailer.createTransport({
        host: process.env.WEB_MAIL_HOST,
        port: Number(process.env.WEB_MAIL_PORT),
        secure: process.env.WEB_MAIL_SECURE === "true",
        auth: {
            user: process.env.WEB_MAIL_USER!,
            pass: process.env.WEB_MAIL_PASS,
        },
    });

    const tryService = async (enabled: string, transporter: any, from: string, serviceName: string) => {
        if (enabled !== "allow") {
            //console.log(`⏩ Skipping ${serviceName} (disabled)`);
            return false;
        }
        try {
            await transporter.sendMail({ from, to, subject, html });
            //console.log(`✅ Email sent using ${serviceName}`);
            return true;
        } catch (err) {
            //console.warn(`❌ ${serviceName} failed:`, err.message);
            return false;
        }
    };

    // Priority order
    if (await tryService(brevo, brevoTransporter, `"${senderName}" <${process.env.BREVO_SENDER_EMAIL}>`, "Brevo")) return true;
    if (await tryService(gmail, gmailTransporter, `"${senderName}" <${process.env.GMAIL_USER}>`, "Gmail")) return true;
    if (await tryService(yahoo, yahooTransporter, `"${senderName}" <${process.env.YAHOO_USER}>`, "Yahoo")) return true;
    if (await tryService(webmail, webMailTransporter, `"${senderName}" <${process.env.WEB_MAIL_USER}>`, "Webmail")) return true;

    console.error("❌ All allowed email services failed");
    return false;
};

