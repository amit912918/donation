import mongoose, { Schema, Document } from "mongoose";
import BankDetailsSchema from "./bankdetails.models";

// Define interface for TypeScript
export interface IMission extends Document {
    title: string;
    description: string;
    photos: string[]; // Array of image URLs
    videoUrl?: string;
    needyPersonAddress: string;
    needyPersonCity: string;
    needyPersonCount: string;
    contactNumber: string;
    documents?: string[]; // Array of document URLs
    createdAt: Date;
    updatedAt: Date;
}

// Define Mongoose schema
const MissionSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        photos: { type: [String], default: [] },
        videoUrl: { type: String },
        needyPersonAddress: { type: String, required: true },
        needyPersonCity: { type: String, required: true },
        memberCount: {
            son: { type: Number, required: true },
            daughter: { type: Number, required: true }
        },
        isWife: { type: Boolean, required: true, defaultValue: false },
        contactNumber: { type: String, required: true },
        bankDetails: BankDetailsSchema,
        missionCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        isPublished: { type: Boolean, default: true },
        documents: [
            {
                type: { type: String, required: true },
                side: { type: String, enum: ["Front", "Back"], required: true },
                path_name: { type: String, required: true }
            }
        ]
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

// ✅ Correct Export
const Mission = mongoose.model<IMission>("Mission", MissionSchema);
export default Mission;
