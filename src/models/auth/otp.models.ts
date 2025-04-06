import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
    otp: string;
    sentTo: string;
    isEmail: boolean;
    expiry: Date;
    type: 'signup' | 'login' | 'resetPassword' | 'forgotPassword' | 'addContact' | 'addEmail';
    isValid: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const otpSchema = new Schema<IOtp>(
    {
        otp: { type: String, required: true },
        sentTo: { type: String, required: true },
        isEmail: { type: Boolean, required: true },
        expiry: { type: Date, required: true },
        type: {
            type: String,
            enum: ['signup', 'login', 'resetPassword', 'forgotPassword', 'addContact', 'addEmail'],
            required: true,
        },
        isValid: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Otp = mongoose.model<IOtp>('Otp', otpSchema);

export default Otp;
