import { NextFunction, Request, Response } from "express";
import missionModels from "@/models/mission/mission.models";
import Mission from "@/models/mission/mission.models";
import { createError } from "@/helpers/common/backend.functions";
import bankdetailsModels from "@/models/mission/bankdetails.models";
import { missionSchema } from "@/helpers/joi/mission/mission.joi";
import { IMissionData } from "@/helpers/interface/mission/mission.interface";
import mongoose from "mongoose";
import { RequestType } from "@/helpers/shared/shared.type";
import Donation from "@/models/mission/donate.models";

// 📌 Create a new mission with transaction
export const createMission = async (req: RequestType, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();

    try {
        const { error, value } = missionSchema.validate(req.body);
        if (error) return next(createError(400, error.details[0].message || "Missing some field"));

        session.startTransaction();

        const data: IMissionData = value;

        // 📍 Create bank entry
        const newBankEntry = {
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            accountHolderName: data.accountHolderName,
            bankName: data.bankName,
            upiId: data.upiId,
            userId: new mongoose.Types.ObjectId(req.payload?.appUserId) // cast to ObjectId
        };

        // 📍 Create mission
        const newMission = new Mission({
            title: data.title,
            description: data.description,
            photos: data.photos,
            videoUrl: data.videoUrl,
            needyPersonAddress: data.needyPersonAddress,
            needyPersonCity: data.needyPersonCity,
            memberCount: data.memberCount,
            isWife: data.isWife,
            missionCreatedBy: new mongoose.Types.ObjectId(req?.payload?.appUserId),
            contactNumber: data.contactNumber,
            bankDetails: newBankEntry,
            documents: data.documents,
        });

        await newMission.save({ session });

        // ✅ Commit if all goes well
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: "Mission created successfully", newMission });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.log(error, "Error in create mission");
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Upload mission image
export const uploadMissionImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log(req.body.type, "image");
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
export const getAllMissions = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, title = '' } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (isNaN(pageNumber) || pageNumber < 1) {
            throw createError(400, "Invalid page number. Page number must be a positive integer.");
        }
        if (isNaN(limitNumber) || limitNumber < 1) {
            throw createError(400, "Invalid limit. Limit must be a positive integer.");
        }

        const searchQuery = title ? { title: new RegExp(title as string, 'i'), missionCreatedBy: { $ne: req?.payload?.appUserId } } : { missionCreatedBy: { $ne: req?.payload?.appUserId } };

        const missions = await Mission.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .lean(); // use lean() so we get plain objects we can modify

        const missionIds = missions.map(m => m._id);

        // Aggregate donation stats per mission
        const donationStats = await Donation.aggregate([
            { $match: { mission: { $in: missionIds } } },
            {
                $group: {
                    _id: "$mission",
                    totalAmount: { $sum: "$amount" },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        // Map for quick lookup
        const donationMap = donationStats.reduce((acc: any, curr: any) => {
            acc[curr._id.toString()] = {
                totalDonations: curr.totalCount,
                totalAmount: curr.totalAmount
            };
            return acc;
        }, {} as Record<string, { totalDonations: number, totalAmount: number }>);

        // Attach donation data to each mission
        const enrichedMissions = missions.map(m => {
            const stats = donationMap[m._id.toString()] || { totalDonations: 0, totalAmount: 0 };
            return {
                ...m,
                totalDonations: stats.totalDonations,
                totalDonationAmount: stats.totalAmount
            };
        });

        const totalMissions = await Mission.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalMissions / limitNumber);

        res.status(200).json({
            missions: enrichedMissions,
            pagination: {
                totalMissions,
                totalPages,
                currentPage: pageNumber,
                pageSize: limitNumber
            }
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};


// 📌 Get user missions
export const getUserMissions = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        // Extract query parameters with default values
        const { page = 1, limit = 10, title = '' } = req.query;

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
        const searchQuery = title ? { title: new RegExp(title as string, 'i'), missionCreatedBy: new mongoose.Types.ObjectId(req?.payload?.appUserId) } : {};

        // Retrieve missions with pagination and sorting
        // const missions = await Mission.find(searchQuery)
        //     .sort({ createdAt: -1 })
        //     .skip((pageNumber - 1) * limitNumber)
        //     .limit(limitNumber);

        const missions = await Mission.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'donations',
                    localField: '_id',
                    foreignField: 'mission',
                    as: 'donations'
                }
            },
            {
                $addFields: {
                    totalDonations: { $size: '$donations' },
                    totalAmountDonated: {
                        $sum: '$donations.amount'
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    photos: 1,
                    videoUrl: 1,
                    createdAt: 1,
                    totalDonations: 1,
                    totalAmountDonated: 1
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNumber - 1) * limitNumber },
            { $limit: limitNumber }
        ]);


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
        const mission = await Mission.findById(req.params.id).lean(); // .lean() gives plain object

        if (!mission) {
            throw createError(404, "Mission not found");
        }

        // Aggregate donation stats for the mission
        const donationStats = await Donation.aggregate([
            { $match: { mission: mission._id } },
            {
                $group: {
                    _id: "$mission",
                    totalAmount: { $sum: "$amount" },
                    totalCount: { $sum: 1 }
                }
            }
        ]);

        const { totalAmount = 0, totalCount = 0 } = donationStats[0] || {};

        // Add donation stats to mission object
        const enrichedMission = {
            ...mission,
            totalDonations: totalCount,
            totalDonationAmount: totalAmount
        };

        res.status(200).json(enrichedMission);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get latest mission
export const getLatestMission = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const mission = await Mission.find({ missionCreatedBy: { $ne: req?.payload?.appUserId } }).sort({ createdAt: -1 }).limit(5);;
        if (!mission) {
            throw createError(404, "Mission not found");
        }
        res.status(200).json(mission);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get mission created by user
export const getMissionCreatedByUser = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const mission = await Mission.find({ missionCreatedBy: req?.payload?.appUserId}).sort({ createdAt: -1 });
        if (!mission) {
            throw createError(404, "Mission not found");
        }
        res.status(200).json(mission);
    } catch (error: any) {
        console.log("Error in mission created by user", error);
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
