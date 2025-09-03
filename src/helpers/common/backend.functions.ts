import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from "crypto";
import User from '@/models/auth/auth.models';

dotenv.config();

const JWT_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const LOCATION_URL = process.env.LOCATION_URL as string;

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

export const getCoordinates = async(city: String, state: String, country: String) => {
  const query = `${city}, ${state}, ${country}`;
  const url = `${LOCATION_URL}/search?format=json&q=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  }
  return null;
}

export const findNearestUsers = async(longitude: number, latitude: number) => {
  const users = await User.find({
  "profile.location": {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      $maxDistance: 50000, // 50 km
    },
  },
});

  return users;
}

type Candidate = {
  name: string;
  nickName: string;
  dob: string;
  address: string;
  city: string;
  mobile: string;
  qualification: string;
  college: string;
  occupation: string;
  jobDetail: any;
  language: string;
  serviceTypes: any[];
  maritalStatus: string;
  assetInfo: string;
  drink: string;
  smoke: string;
  food: string;
  photos: any[];
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

type BicholiyaData = {
  gotraDetails: {
    selfGotra: string;
    maaGotra: string;
    dadiGotra: string;
    naniGotra: string;
    additionalGotra: { stepMotherGotra: string };
  };
  familyDetails: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    grandfatherName: string;
    grandfatherOccupation: string;
    siblings: any[];
    familyLivingIn: string;
    additionalInfo: string;
  };
  _id: string;
  profileCreatedById: string;
  profileCreatedBy: string;
  relationWithCandiate: string;
  profileCount: string;
  gender: string;
  contact: string;
  state: string;
  city: string;
  BicholiyaId: string;
  paymentStatus: string;
  adminVerificationStatus: string;
  bicholiyaVerificationStatus: string;
  candidate: Candidate[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export async function validateBicholiyaData(data: Partial<BicholiyaData>): Promise<boolean> {
  const requiredFields: (keyof BicholiyaData)[] = [
    "_id",
    "profileCreatedById",
    "profileCreatedBy",
    "relationWithCandiate",
    "profileCount",
    "gender",
    "contact",
    "state",
    "city",
    "BicholiyaId",
    "gotraDetails",
    "familyDetails",
    "paymentStatus",
    "adminVerificationStatus",
    "bicholiyaVerificationStatus",
    "candidate",
    "createdAt",
    "updatedAt",
    "__v",
  ];

  for (const field of requiredFields) {
    if (!(field in data) || data[field] === undefined || data[field] === null) {
      return false;
    }
  }

  // validate candidate array has required fields
  if (Array.isArray(data.candidate)) {
    for (const cand of data.candidate) {
      const requiredCandidateFields: (keyof Candidate)[] = [
        "_id",
        "name",
        "dob",
        "address",
        "city",
        "mobile",
        "qualification",
        "college",
        "occupation",
        "jobDetail",
        "language",
        "serviceTypes",
        "maritalStatus",
        "drink",
        "smoke",
        "food",
        "photos",
        "createdAt",
        "updatedAt",
      ];
      for (const field of requiredCandidateFields) {
        if (!(field in cand) || cand[field] === undefined || cand[field] === null) {
          return false;
        }
      }
    }
  } else {
    return false;
  }

  return true;
}

