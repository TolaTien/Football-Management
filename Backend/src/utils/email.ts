import nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer/index.js';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendEmail = async (to: string, subject: string,html: string, attachments?: Attachment[]) => {
    return transporter.sendMail({
        from: `"Sân Bóng Văn Tiến" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
        attachments,
    });
}




export  const initEmail =  async () => {
    const testAccount = await nodemailer.createTestAccount();

    const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
            // user: process.env.GMAIL_USER,
            // pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const testEmail = await testTransporter.sendMail({
        from: '"Test App" <test@example.com>',
        to: 'anyone@example.com',
        subject: 'Hello!',
        html: '<h1>Test email</h1>',
    });

    console.log('Xem mail tại:', nodemailer.getTestMessageUrl(testEmail));
}

