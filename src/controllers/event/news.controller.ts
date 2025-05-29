import { createError } from '@/helpers/common/backend.functions';
import { RequestType } from '@/helpers/shared/shared.type';
import News from '@/models/event/news.model';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Create news
export const createNews = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { title, content, image, author, category, isPublished } = req.body;

        const news = new News({
            title,
            content,
            image,
            author,
            category,
            isPublished,
            publishedById: new mongoose.Types.ObjectId(req?.payload?.appUserId),
            publishedAt: isPublished ? new Date() : undefined,
        });

        const savedNews = await news.save();
        res.status(201).json(savedNews);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get all news
export const getAllNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newsList = await News.find().sort({ createdAt: -1 });
        res.status(200).json(newsList);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// Get a single news by ID
export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return next(createError(404, 'News not found'));
        res.status(200).json(news);
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
