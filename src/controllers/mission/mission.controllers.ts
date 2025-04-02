import { NextFunction, Request, Response } from "express";
import missionModels from "@/models/mission/mission.models";
import Mission from "@/models/mission/mission.models";
import { createError } from "@/helpers/common/backend.functions";

// 📌 Create a new mission
export const createMission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, photos, videoUrl, address, city, contactNumber, documents } = req.body;

        if (!title || !description || !address || !city || !contactNumber) {
            throw createError(400, "All required fields must be filled");
        }

        const newMission = new Mission({
            title,
            description,
            photos,
            videoUrl,
            address,
            city,
            contactNumber,
            documents,
        });

        await newMission.save();
        res.status(201).json({ message: "Mission created successfully", newMission });
    } catch (error: any) {
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

// 📌 Upload mission video
export const uploadMissionVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            return next(createError(404, "No video uploaded."));
        }

        res.status(200).json({
            message: "Video uploaded successfully",
            file: req.file,
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all missions
export const getAllMissions = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const missions = await Mission.find().sort({ createdAt: -1 });
        res.status(200).json(missions);
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
