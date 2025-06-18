import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
    user: mongoose.Types.ObjectId;
    comment: string;
    createdAt: Date;
}

export interface INews extends Document {
    title: string;
    content: string;
    fileName?: string;
    fileType?: string;
    author?: string;
    category?: string;
    isPublished: boolean;
    publishedById: mongoose.Types.ObjectId;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    likes: mongoose.Types.ObjectId[];
    shares: mongoose.Types.ObjectId[];
    comments: IComment[];
}

const CommentSchema: Schema = new Schema<IComment>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

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
        fileName: {
            type: String,
        },
        fileType: {
            type: String,
            enum: ['image', 'video', 'file'],
            default: 'image',
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
            ref: 'User',
            required: true,
        },
        publishedAt: {
            type: Date,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        shares: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [CommentSchema],
    },
    { timestamps: true }
);

const News = mongoose.model<INews>('News', NewsSchema);
export default News;
