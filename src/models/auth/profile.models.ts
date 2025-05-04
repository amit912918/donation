import mongoose, { Schema, Document, Model } from 'mongoose';

// Define TypeScript interface for Profile model
export interface IProfile extends Document {
    image?: string | null;
    address?: string;
    city?: string;
    state?: string | null;
    country?: string | null;
    phone?: string | null;
    bio?: string | null;
    gender: 'Male' | 'Female' | 'Others';
    occupation?: string | null;
    dob?: Date | null;
    PAN?: string | null;
    Language?: string | null;
}

// Define Mongoose Schema
const profileSchema = new Schema<IProfile>(
    {
        image: { type: String },
        address: { type: String },
        city: { type: String, default: '' },
        state: { type: String, default: null },
        country: { type: String, default: null },
        phone: { type: String },
        bio: { type: String },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Others'],
            default: 'Others',
        },
        occupation: { type: String, default: '' },
        dob: { type: Date, required: true },
        PAN: { type: String, default: '' },
        Language: { type: String, default: 'English' }
    },
    { timestamps: true }
);

// Create Profile model
// const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', profileSchema);
export default profileSchema;
