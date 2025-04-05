import mongoose, { Schema, Document } from "mongoose";

// ✅ Donation Interface & Schema
interface IDonation extends Document {
    user: mongoose.Types.ObjectId;
    mission: mongoose.Types.ObjectId;
    amount: number;
    donatedAt: Date;
}

const DonationSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: "Mission", required: true },
    amount: { type: Number, required: true },
    donatedAt: { type: Date, default: Date.now },
});

// ✅ Correct Export
const Donation = mongoose.model<IDonation>("Mission", DonationSchema);
export default Donation;