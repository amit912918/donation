import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface ICommonType extends Document {
    name: string;
    description?: string;
    category?: string;
}

const CommonTypeSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, Enum: ['familytype', 'incometype'], default: 'familytype', required: true }
}, { timestamps: true });

// ✅ Correct Export
const CommonType = mongoose.model<ICommonType>("CommonType", CommonTypeSchema);
export default CommonType;