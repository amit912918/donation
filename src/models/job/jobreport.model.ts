import mongoose, { Schema, Document } from "mongoose";

export interface IJobReport extends Document {
    jobId: mongoose.Types.ObjectId;
    reportedBy: mongoose.Types.ObjectId;
    reason: string;
    details?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const JobReportSchema: Schema<IJobReport> = new Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true
        },
        details: {
            type: String,
        },
    },
    { timestamps: true }
);

const JobReport = mongoose.model<IJobReport>("JobReport", JobReportSchema);
export default JobReport;
