import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
    name: string;
    gender: string;
    dob: string;
    address: string;
    city: string;
    email?: string;
    mobile: string;
    qualification: string;
    college: string;
    occupation: string;
    serviceTypes: string[];
    maritalStatus: string;
    assetInfo: string;
    drink: string;
    smoke: string;
    food: string;
    photo?: string;
}

const CandidateSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        gender: { type: String, required: true },
        dob: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        email: { type: String },
        mobile: { type: String, required: true },
        qualification: { type: String, required: true },
        college: { type: String, required: true },
        occupation: { type: String, required: true },
        serviceTypes: [{ type: String }],
        maritalStatus: { type: String, required: true },
        assetInfo: { type: String, required: true },
        drink: { type: String, required: true },
        smoke: { type: String, required: true },
        food: { type: String, required: true },
        photo: { type: String },
    },
    { timestamps: true }
);


export interface IBiodata extends Document {
    profileCreatedBy: string;
    relationWithCandiate: string;
    profileCount: string;
    gender: string;
    contact: string;
    candidate1: [ICandidate]
    gotraDetails: {
        candidate1Gotra: string;
        candidate2Gotra: string;
        nativePlace: string;
        additionalGotra1: string;
        additionalGotra2: string;
    };
    familyDetails: {
        fatherName: string;
        fatherOccupation: string;
        motherName: string;
        motherOccupation: string;
        grandfatherName: string;
        grandfatherOccupation: string;
        siblings: {
            name: string;
            occupation: string;
        }[];
        familyLivingIn: string;
        additionalInfo?: string;
    };
    createdAt?: Date;
}

const SiblingSchema = new Schema({
    name: String,
    occupation: String,
});

const BiodataSchema: Schema = new Schema<IBiodata>({
    profileCreatedBy: { type: String, required: true },
    relationWithCandiate: { type: String, required: true },
    profileCount: { type: String, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    candidate1: [CandidateSchema],
    gotraDetails: {
        candidate1Gotra: { type: String, required: true },
        candidate2Gotra: { type: String, required: true },
        nativePlace: { type: String, required: true },
        additionalGotra1: { type: String },
        additionalGotra2: { type: String },
    },
    familyDetails: {
        fatherName: { type: String, required: true },
        fatherOccupation: { type: String, required: true },
        motherName: { type: String, required: true },
        motherOccupation: { type: String, required: true },
        grandfatherName: { type: String, required: true },
        grandfatherOccupation: { type: String, required: true },
        siblings: [SiblingSchema],
        familyLivingIn: { type: String, required: true },
        additionalInfo: { type: String },
    }
}, { timestamps: true });

export default mongoose.model<IBiodata>('Biodata', BiodataSchema);
