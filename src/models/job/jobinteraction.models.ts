import mongoose, { Schema, Document } from "mongoose";

// ✅ Job Interaction Interface
export interface IJobInteraction extends Document {
    jobId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    isApplied: boolean,
    appliedTime: Date,
    isInterested: boolean,
    interestedTime: Date,
    isContacted: boolean,
    contactedTime: Date,
    message?: string;
    createdAt: Date;
}

const JobInteractionSchema: Schema = new Schema(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        isApplied: {
            type: Boolean,
            default: false
        },
        appliedTime: {
            type: Date,
            default: ""
        },
        isInterested: {
            type: Boolean,
            default: true
        },
        interestedTime: {
            type: Date,
            default: ""
        },
        isContacted: {
            type: Boolean,
            default: false
        },
        contactedTime: {
            type: Date,
            default: ""
        },
        message: { type: String, default: "" },
    },
    { timestamps: true }
);

// ✅ Ensure a user can have only one interaction per job for a given type
// JobInteractionSchema.index({ jobId: 1, userId: 1, interactionType: 1 }, { unique: true });

const JobInteraction = mongoose.model<IJobInteraction>("JobInteraction", JobInteractionSchema);
export default JobInteraction;
