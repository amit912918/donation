import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface ICommonType extends Document {
    relationName: string;
    description?: string;
}

const CommonTypeSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, Enum: ['familytype'], default: 'familytype', required: true }
}, { timestamps: true });

// ✅ Correct Export
const CommonType = mongoose.model<ICommonType>("CommonType", CommonTypeSchema);
export default CommonType;