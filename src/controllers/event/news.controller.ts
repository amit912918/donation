import { createError } from '@/helpers/common/backend.functions';
import { RequestType } from '@/helpers/shared/shared.type';
import News from '@/models/event/news.model';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Create news
export const createNews = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { title, content, fileName, fileType, author = "admin", category, isPublished } = req.body;

        if(fileType !== 'image' && fileType !== 'video') {
            return next(createError(400, 'Please check fileType, it should be image or video'));
        }

        if (!title && !content && !fileName && !fileType) return next(createError(400, 'Check all required field'));

        const news = new News({
            title,
            content,
            fileName,
            fileType,
            author,
            category,
            isPublished,
            publishedById: new mongoose.Types.ObjectId(req?.payload?.appUserId),
            publishedAt: isPublished ? new Date() : undefined,
        });

        const savedNews = await news.save();
        res.status(200).json({
            error: false,
            success: true,
            message: "Create news successfully",
            data: savedNews
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get all news
export const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newsList = await News.find()
        .sort({ createdAt: -1 });
        res.status(200).json(newsList);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get news for user
export const getNewsForUser = async (req: RequestType, res: Response, next: NextFunction) => {
    try {

        const newsList = await News.find({ publishedById: { $ne: req?.payload?.appUserId } })
        .populate("publishedById", "name profile")
        .sort({ createdAt: -1 });

        res.status(200).json({
            error: false,
            success: true,
            count: newsList.length,
            data: newsList
        });
    } catch (error: any) {
        console.log("Error in get news for user", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get news by user
export const getNewsByUser = async (req: RequestType, res: Response, next: NextFunction) => {
    try {

        const newsList = await News.find({ publishedById: req?.payload?.appUserId })
        .populate("publishedById", "name profile")
        .sort({ createdAt: -1 });

        res.status(200).json({
            error: false,
            success: true,
            count: newsList.length,
            data: newsList
        });
    } catch (error: any) {
        console.log("Error in get news for user", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get a single news by ID
export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const news = await News.findById(req.params.id);
        // if (!news) return next(createError(400, 'News not found'));
        res.status(200).json(
            {
                success: true,
                error: false,
                message: news ? "News get successfully" : "News not found",
                data: news
            });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Update news
export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return next(createError(404, 'News not found'));
        res.status(200).json(updated);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Delete news
export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await News.findByIdAndDelete(req.params.id);
        if (!deleted) return next(createError(404, 'News not found'));
        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Like news handler
export const likeNewsHandler = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const userId: any = req?.payload?.appUserId;
        const newsId = req.params.id;
        const news = await News.findById(newsId);
        if (!news) return next(createError(404, 'News not found'));

        const alreadyLiked = news.likes.includes(userId);

        if (alreadyLiked) {
            news.likes = news.likes.filter((id) => id.toString() !== userId);
        } else {
            news.likes.push(userId);
        }

        await news.save();

        res.status(200).json({
            error: false,
            success: true,
            message: alreadyLiked ? 'Unliked' : 'Liked',
            totalLikes: news.likes.length,
        });
    } catch (error: any) {
        console.log("Error in like news handler", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Comment handler
export const commentHandler = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const userId: any = req.payload?.appUserId;
        const newsId = req.params.id;
        const { comment } = req.body;
        const news = await News.findById(newsId);
        if (!news) return next(createError(404, 'News not found'));

        const newComment = {
            user: userId,
            comment,
            createdAt: new Date(),
        };

        news.comments.push(newComment);
        await news.save();

        res.status(200).json({
            error: false,
            success: true,
            message: 'Comment added',
            comment: newComment,
            totalComments: news.comments.length,
        });
    } catch (error: any) {
        console.log("Error in comment handler", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));;
    }
};

// Share handler
export const shareHandler = async (req: RequestType, res: Response, next: NextFunction) => {
    const userId: any = req.payload?.appUserId;
    const newsId = req.params.id;

    try {
        const news = await News.findById(newsId);
        if (!news) return next(createError(404, 'News not found'));

        const alreadyShared = news.shares.includes(userId);

        if (!alreadyShared) {
            news.shares.push(userId);
            await news.save();
        }

        res.status(200).json({
            error: false,
            success: true,
            message: alreadyShared ? 'Already shared' : 'News shared',
            totalShares: news.shares.length,
        });
    } catch (error: any) {
        console.log("Error in share handler", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};
