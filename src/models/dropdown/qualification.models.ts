import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface IQualification extends Document {
    qualificationName: string;
    description?: string;
}

const QualificationSchema: Schema = new Schema({
    qualificationName: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// ✅ Correct Export
const Qualification = mongoose.model<IQualification>("Qualification", QualificationSchema);
export default Qualification;