import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface IGender extends Document {
    relationName: string;
    description?: string;
}

const GenderSchema: Schema = new Schema({
    genderName: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// ✅ Correct Export
const Gender = mongoose.model<IGender>("Gender", GenderSchema);
export default Gender;