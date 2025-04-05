import mongoose, { Schema, Document } from "mongoose";

interface IJob extends Document {
    jobTitle: string;
    jobDescription: string;
    minimumQualification: string;
    jobType: string;
    jobLocation: string;
    experience: string;
    salaryCriteria: string;
    jobAddress: string;
    jobCity: string;
    businessName: string;
    contactNumber: string;
    hideContact: boolean;
    documents: string[]; // Array of document URLs
}

const JobSchema: Schema = new Schema({
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    minimumQualification: { type: String, required: true },
    jobType: { type: String, enum: ["Full Time", "Part Time"], required: true },
    jobLocation: { type: String, enum: ["On Site", "Remote / Online / Work From Home"], required: true },
    experience: { type: String, enum: ["Freshers", "Experienced", "Both"], required: true },
    salaryCriteria: { type: String, required: true },
    jobAddress: { type: String, required: true },
    jobCity: { type: String, required: true },
    businessName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    hideContact: { type: Boolean, default: false },
    documents: { type: [String], default: [] },
}, { timestamps: true });

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;
