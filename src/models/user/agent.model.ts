import mongoose, { Document, Schema } from 'mongoose';

export interface IAgent extends Document {
    name: string;
    email?: string;
    mobile: string;
    alternateMobile?: string;
    address: string;
    city: string;
    state?: string;
    country?: string;
    pinCode?: string;
    photo?: string;
    verified: boolean;
    agentCode: string;
    totalProfilesAdded?: number;
    remarks?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const AgentSchema: Schema<IAgent> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        mobile: { type: String, required: true, unique: true },
        alternateMobile: { type: String },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, default: 'India' },
        pinCode: { type: String },
        photo: { type: String }, // URL of the photo/avatar
        verified: { type: Boolean, default: false },
        agentCode: { type: String, required: true, unique: true }, // For internal reference or tracking
        totalProfilesAdded: { type: Number, default: 0 },
        remarks: { type: String },
    },
    { timestamps: true }
);

const Agent = mongoose.model<IAgent>('Agent', AgentSchema);
export default Agent;
