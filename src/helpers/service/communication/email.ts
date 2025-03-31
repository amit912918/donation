import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends an OTP via Email using Nodemailer
 * @param contact - The recipient's email address
 * @param otpValue - The OTP to be sent
 * @returns Promise of the email sending response
 */
export async function sendEmail(contact: string, otpValue: string): Promise<any> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials are not defined in environment variables.');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: contact,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otpValue}`,
    };

    return transporter.sendMail(mailOptions);
}
