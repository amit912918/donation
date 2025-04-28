import { NextFunction, Request, Response } from "express";
import { createError } from "@/helpers/common/backend.functions";
import BannerModel from "@/models/home/banner.models";

// 📌 Create a new banner
export const createBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, imageUrl, redirectUrl } = req.body;

        if (!title || !imageUrl) {
            throw createError(400, "Title and imageUrl are required");
        }

        // Get the last sequence number and increment it
        const lastBanner = await BannerModel.findOne().sort("-sequence");
        const sequence = lastBanner ? lastBanner.sequence + 1 : 1;

        const newBanner = new BannerModel({
            title,
            imageUrl,
            redirectUrl,
            sequence,
        });

        await newBanner.save();
        res.status(201).json({ message: "Banner created successfully", newBanner });
    } catch (error: any) {
        console.log("Error in create banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 Upload banner image
export const uploadBannerImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            return next(createError(404, "No files uploaded."));
        }

        // Files uploaded successfully
        const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
        }));

        res.status(200).json({
            message: "Files uploaded successfully.",
            files: uploadedFiles,
        });
    } catch (error: any) {
        console.log("Add mission Images Error ::>>", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};


// 📌 Get all banners
export const getAllBanners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const banners = await BannerModel.find().sort("sequence");
        res.status(200).json(banners);
    } catch (error: any) {
        console.log("Error in get all banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 Update a banner
export const updateBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, imageUrl, redirectUrl, sequence, isActive } = req.body;
        const banner = await BannerModel.findById(req.params.id);

        if (!banner) {
            throw createError(404, "Banner not found");
        }

        banner.title = title || banner.title;
        banner.imageUrl = imageUrl || banner.imageUrl;
        banner.redirectUrl = redirectUrl || banner.redirectUrl;
        banner.sequence = sequence || banner.sequence;
        banner.isActive = isActive !== undefined ? isActive : banner.isActive;

        await banner.save();
        res.status(200).json({ message: "Banner updated successfully", banner });
    } catch (error: any) {
        console.log("Error in update banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};

// 📌 Soft delete a banner
export const deleteBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const banner = await BannerModel.findById(req.params.id);
        if (!banner) {
            throw createError(404, "Banner not found");
        }

        banner.isActive = false;
        await banner.save();

        res.status(200).json({ message: "Banner deleted (soft delete)", banner });
    } catch (error: any) {
        console.log("Error in delete banner", error);
        next(createError(500, error?.message || "Internal server error"));
    }
};
