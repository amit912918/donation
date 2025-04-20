import mongoose, { Schema, Document } from "mongoose";

// ✅ Job Interaction Interface
export interface IJobInteraction extends Document {
    jobId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    interactionType: "APPLIED" | "CONTACTED" | "INTERESTED";
    message?: string;
    createdAt: Date;
}

const JobInteractionSchema: Schema = new Schema(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        interactionType: {
            type: String,
            enum: ["APPLIED", "CONTACTED", "INTERESTED"],
            required: true
        },
        message: { type: String, default: "" }, // Optional message from the user
    },
    { timestamps: true }
);

// ✅ Ensure a user can have only one interaction per job for a given type
JobInteractionSchema.index({ jobId: 1, userId: 1, interactionType: 1 }, { unique: true });

const JobInteraction = mongoose.model<IJobInteraction>("JobInteraction", JobInteractionSchema);
export default JobInteraction;
