import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface IRelation extends Document {
    relationName: string;
    description?: string;
}

const RelationSchema: Schema = new Schema({
    relationName: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// ✅ Correct Export
const Relation = mongoose.model<IRelation>("Relation", RelationSchema);
export default Relation;