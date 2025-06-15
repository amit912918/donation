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
        biodataCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        isCheckout: {
            type: Boolean,
            default: false
        },
        isCheckoutTime: {
            type: Date,
            default: ""
        },
        addingToFavourite: {
            type: Boolean,
            default: false
        },
        addingToFavouriteTime: {
            type: Date,
            default: ""
        },
        isRequestSend: {
            type: Boolean,
            default: false
        },
        requestSendTime: {
            type: Date,
            default: ""
        },
        isAccpted: {
            type: Boolean,
            default: false
        },
        requestAcceptTime: {
            type: Date,
            default: ""
        },
        isRejected: {
            type: Boolean,
            default: false
        },
        requestRejectTime: {
            type: Date,
            default: ""
        },
        message: { type: String, default: "" },
    },
    { timestamps: true }
);

const BiodataInteraction = mongoose.model<IBiodataInteraction>("BiodataInteraction", BiodataInteractionSchema);
export default BiodataInteraction;
