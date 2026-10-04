import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

export async function inviaMail({
    to,
    cc,
    subject,
    text,
    html
}) {
    return transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        cc,
        subject,
        text,
        html
    });
}
