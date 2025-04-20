import mongoose, { Schema, Document } from "mongoose";

// Define interface for TypeScript
export interface IMission extends Document {
    title: string;
    description: string;
    photos: string[]; // Array of image URLs
    videoUrl?: string;
    address: string;
    memberCount: number;
    city: string;
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
        address: { type: String, required: true },
        memberCount: { type: Number, required: true },
        city: { type: String, required: true },
        contactNumber: { type: String, required: true },
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
