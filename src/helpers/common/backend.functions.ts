import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();

const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Function to generate JWT Token
export const generateToken = (id: unknown, role: unknown): string => {
  if(!role) {
    role = 'user'
  }
  console.log(role, "role");
  return jwt.sign({ payloadData: { appUserId: id, role: role } }, JWT_SECRET, {
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

export function isBiodataComplete(biodata: any): boolean {
  if (!biodata) return false;

  const requiredFields = [
    'profileCreatedById', 'profileCreatedBy', 'relationWithCandiate',
    'profileCount', 'gender', 'contact', 'state', 'city', 'BicholiyaId'
  ];

  const gotraFields = ['selfGotra', 'maaGotra', 'dadiGotra', 'naniGotra'];
  const familyFields = ['fatherName', 'fatherOccupation', 'motherName', 'motherOccupation', 'familyLivingIn'];

  const isBasicFilled = requiredFields.every(field => !!biodata[field]);

  const isGotraFilled = gotraFields.every(field => !!biodata.gotraDetails?.[field]);
  const isFamilyFilled = familyFields.every(field => !!biodata.familyDetails?.[field]);

  const isAnyCandidateComplete = (biodata.candidate || []).some((cand: any) => {
    const requiredCandidateFields = [
      'name', 'dob', 'address', 'city', 'mobile',
      'qualification', 'college', 'occupation',
      'maritalStatus', 'assetInfo', 'drink', 'smoke', 'food'
    ];
    return requiredCandidateFields.every(field => !!cand[field]);
  });

  return isBasicFilled && isGotraFilled && isFamilyFilled && isAnyCandidateComplete;
}
