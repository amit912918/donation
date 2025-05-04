import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface ISibling extends Document {
    siblingName: string;
    description?: string;
    occupation?: string;
}

const SiblingSchema: Schema = new Schema({
    siblingName: { type: String, required: true },
    description: { type: String, required: true },
    occupation: { type: String, required: true },
}, { timestamps: true });

// ✅ Correct Export
const Sibling = mongoose.model<ISibling>("Sibling", SiblingSchema);
export default Sibling;