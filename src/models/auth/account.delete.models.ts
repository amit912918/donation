// models/DeleteRequest.ts
import mongoose, { Schema, model, Document } from "mongoose";

export interface IDeleteRequest extends Document {
  mobile: string,
  reason?: string;        // Optional reason from user
  status: "pending" | "approved" | "rejected"; 
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;    // Admin ID who reviewed
}

const deleteRequestSchema = new Schema<IDeleteRequest>({
  mobile: { type: String, unique: true, sparse: true },
  reason: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "Admin" }
});

export const DeleteRequest = model<IDeleteRequest>("DeleteRequest", deleteRequestSchema);
