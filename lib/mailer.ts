import nodemailer from "nodemailer";
import { metaData } from "./utils";

type SendEmailOptions = {
    to: string;
    subject: string;
    html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
    const gmailUser = process.env.GMAIL_USER!;
    const yahooUser = process.env.YAHOO_USER!;
    const webMailUser = process.env.WEB_MAIL_USER!;
    const senderName = metaData.name + " Team";

    const gmailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: gmailUser,
            pass: process.env.GMAIL_PASS,
        },
    });

    const yahooTransporter = nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        secure: true,
        auth: {
            user: yahooUser,
            pass: process.env.YAHOO_PASS,
        },
    });

    const webMailTransporter = nodemailer.createTransport({
        host: process.env.WEB_MAIL_HOST,
        port: Number(process.env.WEB_MAIL_PORT),
        secure: process.env.WEB_MAIL_SECURE === "true",
        auth: {
            user: webMailUser,
            pass: process.env.WEB_MAIL_PASS,
        },
    });

    try {
        await gmailTransporter.sendMail({
            from: `"${senderName}" <${gmailUser}>`,
            to,
            subject,
            html,
        });
        console.log("✅ Email sent using Gmail");
    } catch (gmailError) {

        try {
            await yahooTransporter.sendMail({
                from: `"${senderName}" <${yahooUser}>`,
                to,
                subject,
                html,
            });
            console.log("✅ Email sent using Yahoo");
        } catch (yahooError) {

            try {
                await webMailTransporter.sendMail({
                    from: `"${senderName}" <${webMailUser}>`,
                    to,
                    subject,
                    html,
                });
                console.log("✅ Email sent using Webmail");
            } catch (webmailError) {
                console.error("❌ All email services failed:", webmailError);
                // throw new Error("All email services failed");
                return false;
            }
        }
    }
};

export const allowEmailSending = 1; // 1, yes send and 0, no don't send
