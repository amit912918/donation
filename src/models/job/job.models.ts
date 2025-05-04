import mongoose, { Schema, Document } from "mongoose";

interface IDocumentInfo {
    type: string;
    size: number;
    path_name: string;
}
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
    isPublished: boolean;
    documents: IDocumentInfo[]; // Array of document URLs
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
    isPublished: { type: Boolean, default: true },
    jobCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    documents: [
        {
            type: { type: String, required: true },
            side: { type: String, enum: ["Front", "Back"], required: true },
            path_name: { type: String, required: true }
        }
    ]
}, { timestamps: true });

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;
