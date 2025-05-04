import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
    name: string;
    nickName?: string;
    gender?: string;
    dob: string;
    address: string;
    city: string;
    mobile: string;
    email?: string;
    qualification: string;
    college: string;
    occupation: string;
    language?: string;
    serviceTypes: string[];
    maritalStatus: string;
    assetInfo: string;
    drink: string;
    smoke: string;
    food: string;
    photo?: string;
}

const CandidateSchema: Schema = new Schema({
    name: { type: String, required: true },
    nickName: { type: String },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true },
    qualification: { type: String, required: true },
    college: { type: String, required: true },
    occupation: { type: String, required: true },
    language: { type: String, default: "English" },
    serviceTypes: [{ type: String }],
    maritalStatus: { type: String, required: true },
    assetInfo: { type: String, required: true },
    drink: { type: String, required: true },
    smoke: { type: String, required: true },
    food: { type: String, required: true },
    photo: { type: String },
}, { timestamps: true });

export interface ISibling {
    name: string;
    occupation: string;
}

export interface IBiodata extends Document {
    profileCreatedBy: string;
    relationWithCandiate: string;
    profileCount: string;
    gender: string;
    contact: string;
    candidate: ICandidate[];
    gotraDetails: {
        selfGotra: string;
        maaGotra: string;
        dadiGotra: string;
        naniGotra?: string;
        additionalGotra?: Record<string, any>;
    };
    familyDetails: {
        fatherName: string;
        fatherOccupation: string;
        motherName: string;
        motherOccupation: string;
        grandfatherName: string;
        grandfatherOccupation: string;
        siblings: ISibling[];
        familyLivingIn: string;
        elderBrotherName: string;
        elderBrotherOccupation: string;
        additionalInfo?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const SiblingSchema = new Schema({
    siblingName: String,
    occupation: String,
});

const BiodataSchema: Schema = new Schema<IBiodata>({
    profileCreatedBy: { type: String, required: true },
    relationWithCandiate: { type: String, required: true },
    profileCount: { type: String, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    candidate: [CandidateSchema],
    gotraDetails: {
        selfGotra: { type: String, required: true },
        maaGotra: { type: String, required: true },
        dadiGotra: { type: String, required: true },
        naniGotra: { type: String },
        additionalGotra: { type: Object },
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
        elderBrotherName: { type: String, required: true },
        elderBrotherOccupation: { type: String, required: true },
        additionalInfo: { type: String },
    }
}, { timestamps: true });

// ✅ Correct Export
const Biodata = mongoose.model<IBiodata>("Biodata", BiodataSchema);
export default Biodata;