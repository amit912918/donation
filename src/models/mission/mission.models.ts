import mongoose, { Schema, Document } from "mongoose";
import BankDetailsSchema from "./bankdetails.models";

// Define interface for TypeScript
export interface IMission extends Document {
    mission_id: string;
    title: string;
    description: string;
    photos: string[]; // Array of image URLs
    videoUrl?: string;
    needyPersonAddress: string;
    needyPersonCity: string;
    needyPersonCount: string;
    contactNumber: string;
    documents?: string[]; // Array of document URLs
    createdAt: Date;
    updatedAt: Date;
}

// Define Mongoose schema
const MissionSchema: Schema = new Schema(
    {
        mission_id: { type: String, unique: true, required: [true, "mission id is required"] },
        title: { type: String, required: [true, "title is required"] },
        description: { type: String, required: [true, "description is required"] },
        photos: { type: [String], default: [] },
        videoUrl: { type: String },
        needyPersonAddress: { type: String, required: [true, "needy person is required"] },
        needyPersonCity: { type: String, required: [true, "needy person city is required"] },
        memberCount: {
            son: { type: Number, required: [true, "son count is required"] },
            daughter: { type: Number, required: [true, "daughter count is required"] }
        },
        isWife: { type: Boolean, required: [true, "wife mark is required"], defaultValue: false },
        inclMother: { type: Boolean, required: [true, "mother inclusion mark is required"], defaultValue: false },
        inclFather: { type: Boolean, required: [true, "father inclusion mark is required"], defaultValue: false },
        contactNumber: { type: String, required: [true, "contact number is required"] },
        bankDetails: BankDetailsSchema,
        missionCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "mission created by is required"] },
        isPublished: { type: Boolean, default: false },
        status: { type: String, Enum: ['Pending', 'Approved', 'Disapproved'], default: 'Pending' },
        documents: [
            {
                type: { type: String, required: [true, "document validation failed"] },
                side: { type: String, enum: ["Front", "Back"], required: [true, "document validation failed"] },
                path_name: { type: String, required: [true, "document validation failed"] }
            }
        ]
    },
    { timestamps: true }
);

MissionSchema.pre<IMission>('validate', async function (next) {
    if (this.mission_id) return next(); // already set

    try {
        const lastMission: any = await mongoose
            .model('Mission')
            .findOne({})
            .sort({ createdAt: -1 }) // latest
            .select('mission_id')
            .lean();

        let newId = 0;
        if (lastMission?.mission_id) {
            newId = parseInt(lastMission.mission_id, 10) + 1;
        }

        if (newId > 999) {
            return next(new Error('Maximum mission_id limit (999) reached.'));
        }

        this.mission_id = newId.toString().padStart(3, '0');
        next();
    } catch (error: any) {
        console.log("Error in pre save mission", error);
        next(error);
    }
});


// ✅ Correct Export
const Mission = mongoose.model<IMission>("Mission", MissionSchema);
export default Mission;
