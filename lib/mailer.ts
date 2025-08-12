import nodemailer from "nodemailer";
import { metaData } from "./utils";

type SendEmailOptions = {
    to: string;
    subject: string;
    html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
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

    try {
        await brevoTransporter.sendMail({
            from: `"${senderName}" <${process.env.BREVO_SENDER_EMAIL}>`,
            to,
            subject,
            html,
        });
        console.log("✅ Email sent using Brevo");
    } catch (brevoError) {
        // console.error("❌ Brevo failed:", brevoError);
        try {
            await gmailTransporter.sendMail({
                from: `"${senderName}" <${process.env.GMAIL_USER}>`,
                to,
                subject,
                html,
            });
            console.log("✅ Email sent using Gmail");
        } catch (gmailError) {
            // console.error("❌ Gmail failed:", gmailError);
            try {
                await yahooTransporter.sendMail({
                    from: `"${senderName}" <${process.env.YAHOO_USER}>`,
                    to,
                    subject,
                    html,
                });
                console.log("✅ Email sent using Yahoo");
            } catch (yahooError) {
                // console.error("❌ Yahoo failed:", yahooError);
                try {
                    await webMailTransporter.sendMail({
                        from: `"${senderName}" <${process.env.WEB_MAIL_USER}>`,
                        to,
                        subject,
                        html,
                    });
                    console.log("✅ Email sent using Webmail");
                } catch (webmailError) {
                    console.error("❌ All email services failed:", webmailError);
                    return false;
                }
            }
        }
    }

    return true;
};

export const allowEmailSending = 1; // 1 = send, 0 = don't send
