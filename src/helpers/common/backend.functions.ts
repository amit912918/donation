import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Function to generate JWT Token
export const generateToken = (id: unknown): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '10d',
  });
};

export const createError = (status: number, message: string): Error & { status?: number } => {
  const error = new Error(message);
  (error as any).status = status;
  return error;
};


// Generate a random 6-digit OTP
export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Validate contact (email or phone)
export function validateContact(contact: string, isEmail: boolean): boolean {
  if (isEmail) {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(contact);
  } else {
    const phoneRegex: RegExp = /^\+?[1-9]\d{1,14}$/; // Supports international phone numbers
    return phoneRegex.test(contact);
  }
}
