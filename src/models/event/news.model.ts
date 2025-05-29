import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
    title: string;
    content: string;
    image?: string;
    author?: string;
    category?: string;
    isPublished: boolean;
    publishedById: mongoose.Types.ObjectId;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const NewsSchema: Schema = new Schema<INews>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        author: {
            type: String,
            default: 'Admin',
        },
        category: {
            type: String,
            enum: ['news', 'update', 'event', 'announcement'],
            default: 'news',
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        publishedById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        publishedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

const News = mongoose.model<INews>("News", NewsSchema);
export default News;
