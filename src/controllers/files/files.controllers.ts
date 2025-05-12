import { NextFunction, Request, Response } from "express";
import { createError } from "@/helpers/common/backend.functions";

// 📌 Upload mission image
export const uploadImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            return next(createError(404, "No files uploaded."));
        }

        // Files uploaded successfully
        const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
            originalName: file.originalname,
            filename: `/assets/${req.body.type}/${file.filename}`,
            path: file.path,
        }));

        res.status(200).json({
            message: "Files uploaded successfully.",
            files: uploadedFiles,
        });
    } catch (error: any) {
        console.log("Add Images Error ::>>", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Upload mission video
export const uploadVideos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        res.status(200).json({
            message: 'Video uploaded successfully',
            file: `/assets/${req.body.type}/${req.file.filename}`,
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Upload mission file
export const uploadFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            return next(createError(404, "No file uploaded."));
        }

        res.status(200).json({
            message: "File uploaded successfully",
            file: `/assets/${req.body.type}/${req.file}`,
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};