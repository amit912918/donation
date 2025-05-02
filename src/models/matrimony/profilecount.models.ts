import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface IProfileCount extends Document {
    name: string;
    description?: string;
    count?: number;
}

const ProfileCountSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    count: { type: Number, required: true }
}, { timestamps: true });

// ✅ Correct Export
const ProfileCount = mongoose.model<IProfileCount>("ProfileCount", ProfileCountSchema);
export default ProfileCount;