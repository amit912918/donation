import mongoose, { Schema, Document, model } from 'mongoose';

export interface IBankDetails extends Document {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    upiId?: string;
    userId?: mongoose.Types.ObjectId; // optional: link to user if needed
    createdAt: Date;
    updatedAt: Date;
}

const BankDetailsSchema: Schema = new Schema<IBankDetails>(
    {
        accountNumber: {
            type: String,
            required: true,
            trim: true,
        },
        ifscCode: {
            type: String,
            required: true,
            uppercase: true,
        },
        accountHolderName: {
            type: String,
            required: true,
            trim: true,
        },
        bankName: {
            type: String,
            required: true,
            trim: true,
        },
        upiId: {
            type: String,
            trim: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

export default BankDetailsSchema;

// export default mongoose.models.BankDetails || model<IBankDetails>('BankDetails', BankDetailsSchema);