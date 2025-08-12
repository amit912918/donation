// models/BusinessType.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBusinessType extends Document {
  name: string;
  category: string;
}

const BusinessTypeSchema = new Schema<IBusinessType>({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
}, { timestamps: true });

const BusinessType = mongoose.model<IBusinessType>("BusinessType", BusinessTypeSchema);


export interface IBusinessSector extends Document {
  name: string;
  category: string;
  businessTypeId: mongoose.Types.ObjectId;
}

const BusinessSectorSchema = new Schema<IBusinessSector>({
  name: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  businessTypeId: { type: Schema.Types.ObjectId, ref: "BusinessType" },
}, { timestamps: true });

const BusinessSector = mongoose.model<IBusinessSector>("BusinessSector", BusinessSectorSchema);

export interface IPosition extends Document {
  name: string;
  category: string;
  sectorId: mongoose.Types.ObjectId;
}

const PositionSchema = new Schema<IPosition>({
  name: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  sectorId: { type: Schema.Types.ObjectId, ref: "BusinessSector" }
}, { timestamps: true });

const Position = mongoose.model<IPosition>("Position", PositionSchema);

export { BusinessType, BusinessSector, Position };
