import mongoose, { Schema, Document } from "mongoose";

// ✅ Job Interaction Interface
export interface IBiodataInteraction extends Document {
    biodataId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    isCheckout: boolean,
    addingToFavourite: boolean,
    isRequestSend: boolean,
    isAccpted: boolean,
    isRejected: boolean,
    message?: string;
    createdAt: Date;
}

const BiodataInteractionSchema: Schema = new Schema(
    {
        biodataId: { type: mongoose.Schema.Types.ObjectId, ref: "Biodata", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        requestSendById: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        isCheckout: {
            type: Boolean,
            default: false
        },
        addingToFavourite: {
            type: Boolean,
            default: false
        },
        isRequestSend: {
            type: Boolean,
            default: false
        },
        isAccpted: {
            type: Boolean,
            default: false
        },
        isRejected: {
            type: Boolean,
            default: false
        },
        message: { type: String, default: "" },
    },
    { timestamps: true }
);

const BiodataInteraction = mongoose.model<IBiodataInteraction>("BiodataInteraction", BiodataInteractionSchema);
export default BiodataInteraction;
