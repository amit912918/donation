import { NextFunction, Request, Response } from "express";
import missionModels from "@/models/mission/mission.models";
import Mission from "@/models/mission/mission.models";
import { createError } from "@/helpers/common/backend.functions";
import bankdetailsModels from "@/models/mission/bankdetails.models";
import { missionSchema } from "@/helpers/joi/mission/mission.joi";
import { IMissionData } from "@/helpers/interface/mission/mission.interface";
import mongoose from "mongoose";
import { RequestType } from "@/helpers/shared/shared.type";

// 📌 Create a new mission with transaction
export const createMission = async (req: RequestType, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();

    try {
        const { error, value } = missionSchema.validate(req.body);
        if (error) return next(createError(400, error.details[0].message || "Missing some field"));

        session.startTransaction();

        const data: IMissionData = value;

        // 📍 Create mission
        const newMission = new Mission({
            title: data.title,
            description: data.description,
            photos: data.photos,
            videoUrl: data.videoUrl,
            address: data.address,
            memberCount: data.memberCount,
            city: data.city,
            contactNumber: data.contactNumber,
            documents: data.documents,
        });

        await newMission.save({ session });

        // 📍 Create bank entry
        const newBankEntry = new bankdetailsModels({
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            accountHolderName: data.accountHolderName,
            bankName: data.bankName,
            upiId: data.upiId,
            userId: new mongoose.Types.ObjectId(req.payload?.appUserId) // cast to ObjectId
        });

        await newBankEntry.save({ session });

        // ✅ Commit if all goes well
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: "Mission created successfully", newMission });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Upload mission image
export const uploadMissionImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            return next(createError(404, "No files uploaded."));
        }

        // Files uploaded successfully
        const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
            originalName: file.originalname,
            filename: `/assets/mission/${file.filename}`,
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

// 📌 Upload mission video
export const uploadMissionVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        res.status(200).json({
            message: 'Video uploaded successfully',
            file: `/assets/mission/${req.file.filename}`,
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Upload mission file
export const uploadMissionFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            return next(createError(404, "No file uploaded."));
        }

        res.status(200).json({
            message: "File uploaded successfully",
            file: `/assets/mission/${req.file}`,
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all missions
export const getAllMissions = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract query parameters with default values
        const { page = 1, limit = 10, title = '' } = _req.query;

        // Convert page and limit to numbers
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        // Validate page and limit values
        if (isNaN(pageNumber) || pageNumber < 1) {
            throw createError(400, "Invalid page number. Page number must be a positive integer.");
        }
        if (isNaN(limitNumber) || limitNumber < 1) {
            throw createError(400, "Invalid limit. Limit must be a positive integer.");
        }

        // Construct the search query
        const searchQuery = title ? { title: new RegExp(title as string, 'i') } : {};

        // Retrieve missions with pagination and sorting
        const missions = await Mission.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        // Get the total count of documents matching the search query
        const totalMissions = await Mission.countDocuments(searchQuery);

        // Calculate total pages
        const totalPages = Math.ceil(totalMissions / limitNumber);

        // Respond with missions and pagination info
        res.status(200).json({
            missions,
            pagination: {
                totalMissions,
                totalPages,
                currentPage: pageNumber,
                pageSize: limitNumber,
            },
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get a single mission by ID
export const getMissionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            throw createError(404, "Mission not found");
        }
        res.status(200).json(mission);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get latest mission
export const getLatestMission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mission = await Mission.find().sort({ createdAt: -1 }).limit(5);;
        if (!mission) {
            throw createError(404, "Mission not found");
        }
        res.status(200).json(mission);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Update a mission
export const updateMission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return next(createError(400, "Request body cannot be empty"));
        }

        // Find and update the mission
        const updatedMission = await Mission.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).lean();

        if (!updatedMission) {
            return next(createError(404, "Mission not found"));
        }

        res.status(200).json({
            message: "Mission updated successfully",
            mission: updatedMission
        });

    } catch (error: any) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};

// 📌 Delete a mission
export const deleteMission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedMission = await Mission.findByIdAndDelete(req.params.id);
        if (!deletedMission) {
            return next(createError(404, "Mission not found"));
        }
        res.status(200).json({ message: "Mission deleted successfully" });
    } catch (error: any) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};
