import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends an OTP via SMS using Twilio
 * @param contact - The recipient's phone number
 * @param otpValue - The OTP to be sent
 * @returns Promise of the Twilio message response
 */
export async function sendSms(contact: string, otpValue: string): Promise<any> {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        throw new Error('Twilio credentials are not defined in environment variables.');
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    return client.messages.create({
        body: `Your OTP is ${otpValue}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact,
    });
}