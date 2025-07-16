import { NextFunction, Request, Response } from "express";
import { createError } from "@/helpers/common/backend.functions";

// 📌 Upload mission image
export const uploadImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            return next(createError(404, "No files uploaded."));
        }
        console.log(req.files, "req.files");

        // Files uploaded successfully
        const uploadedFiles = (req.files as Express.Multer.File[]).map((file: any) => ({
            originalName: file.originalname,
            filename: file.location,
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
export const uploadVideos = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return next(createError(400, 'No videos uploaded'));
    }

    const uploadedVideos = (req.files as Express.MulterS3.File[]).map((file) => ({
      originalName: file.originalname,
      location: file.location, // ✅ Full S3 URL
      key: file.key,
    }));

    res.status(200).json({
      message: 'Videos uploaded successfully',
      files: uploadedVideos,
    });
  } catch (error: any) {
    next(createError(error.status || 500, error.message || 'Internal Server Error'));
  }
};

// 📌 Upload mission file
export const uploadFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return next(createError(400, 'No files uploaded.'));
    }

    const uploadedFiles = (req.files as Express.Multer.File[]).map((file: any) => ({
      originalName: file.originalname,
      filename: file.location,
    }));

    res.status(200).json({
      message: 'Files uploaded successfully.',
      files: uploadedFiles,
    });
  } catch (error: any) {
    next(createError(error.status || 500, error.message || 'Internal Server Error'));
  }
};
