import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface IMarital extends Document {
    relationName: string;
    description?: string;
}

const MaritalSchema: Schema = new Schema({
    maritalName: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// ✅ Correct Export
const Marital = mongoose.model<IMarital>("Marital", MaritalSchema);
export default Marital;