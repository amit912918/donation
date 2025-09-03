import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface IGotra extends Document {
    gotraName: string;
    description?: string;
}

const GotraSchema: Schema = new Schema({
    gotraName: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// ✅ Correct Export
const Gotra = mongoose.model<IGotra>("Gotra", GotraSchema);
export default Gotra;