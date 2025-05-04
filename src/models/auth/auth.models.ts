import crypto from 'crypto';
import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import profileSchema, { IProfile } from './profile.models';

// Define TypeScript interface for User model
export interface IUser extends Document {
    name: string;
    email?: string;
    mobile?: string;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    confirmed: boolean;
    agreeTermConditions: boolean;
    profile: IProfile,
    blocked: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
    encryptPassword(password: string): Promise<string>;
    getResetPasswordToken(): string;
}

// Define Mongoose Schema
const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, lowercase: true, sparse: true },
        mobile: { type: String, unique: true, sparse: true },
        password: { type: String, default: '12345' },
        resetPasswordToken: { type: String },
        resetPasswordExpire: { type: Date },
        confirmed: { type: Boolean, default: true },
        agreeTermConditions: { type: Boolean, default: true },
        profile: profileSchema,
        blocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password
userSchema.methods.encryptPassword = async function (password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Pre-save middleware to hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate password reset token
userSchema.methods.getResetPasswordToken = function (): string {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return resetToken;
};

// Create User model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
