import mongoose, { Schema, Document } from "mongoose";

interface IBanner extends Document {
    title: string;
    imageUrl: string;
    redirectUrl?: string;
    sequence: number;
    category: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Schema
const BannerSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        imageUrl: { type: String, required: true },
        redirectUrl: { type: String, required: false },
        sequence: { type: Number, required: true },
        category: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Auto-increment sequence number
// BannerSchema.pre<IBanner>("save", async function (next) {
//     if (!this.sequence) {
//         const lastBanner = await BannerModel.findOne().sort("-sequence");
//         this.sequence = lastBanner ? lastBanner.sequence + 1 : 1;
//     }
//     next();
// });

// Create Model
const BannerModel = mongoose.model<IBanner>("Banner", BannerSchema);

export default BannerModel;
