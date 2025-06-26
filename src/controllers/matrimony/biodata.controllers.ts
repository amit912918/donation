import { createError, isBiodataComplete } from "@/helpers/common/backend.functions";
import { RequestType } from "@/helpers/shared/shared.type";
import User from "@/models/auth/auth.models";
import BiodataInteraction from "@/models/matrimony/biodata.interaction.models";
import Biodata from "@/models/matrimony/biodata.models";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const createBiodata = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const existingBiodata = await Biodata.findOne({ profileCreatedById: req.payload?.appUserId });

        if (existingBiodata) {
            const updatedBiodata = await Biodata.findByIdAndUpdate(
                existingBiodata._id,
                { ...req.body },
                { new: true }
            );
            res.status(200).json({ success: true, message: "Biodata updated", data: updatedBiodata });
            return;
        } else {
            const newBiodata = await Biodata.create({
                ...req.body,
                profileCreatedById: req.payload?.appUserId,
            });
            res.status(200).json({ success: true, message: "Biodata created", data: newBiodata });
            return;
        }
    } catch (error) {
        next(error);
    }
};

export const getAllBiodatas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const search = (req.query.search as string) || "";

        // Build search query (case-insensitive, partial match on candidate name, city, or profileCreatedBy)
        const searchQuery = {
            $or: [
                { "candidate.name": { $regex: search, $options: "i" } },
                { "candidate.city": { $regex: search, $options: "i" } },
                { profileCreatedBy: { $regex: search, $options: "i" } }
            ]
        };

        const biodatas = await Biodata.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Biodata.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            count: biodatas.length,
            data: biodatas
        });
    } catch (error) {
        next(error);
    }
};

export const getBiodataById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const biodata = await Biodata.findById(req.params.id);
        if (!biodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, data: biodata });
    } catch (error) {
        next(error);
    }
};

export const getBiodataByUserId = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const biodata = await Biodata.find({ profileCreatedById: req.payload?.appUserId });
        if (!biodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, data: biodata });
    } catch (error) {
        next(error);
    }
};

export const updateBiodata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedBiodata = await Biodata.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBiodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedBiodata });
    } catch (error) {
        next(error);
    }
};

export const deleteBiodata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deletedBiodata = await Biodata.findByIdAndDelete(req.params.id);
        if (!deletedBiodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Biodata deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const getBicholiyaList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const search = (req.query.search as string) || "";

        const searchQuery = {
            isBicholiya: true,
            ...(search && {
                name: { $regex: search, $options: "i" }
            })
        };

        const bicholiyaDatas = await User.find(searchQuery).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            error: false,
            count: bicholiyaDatas.length,
            data: bicholiyaDatas
        });
    } catch (error: unknown) {
        console.error("Error in get bicholiya list", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getNewlyJoined = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
                const newlyJoinedData = await Biodata.aggregate([
        {
            $match: {
            profileCreatedById: { $ne: req?.payload?.appUserId }
            },
        },
        {
            $lookup: {
            from: 'biodatainteractions',
            let: { biodataId: '$_id' },
            pipeline: [
                {
                $match: {
                    $expr: {
                    $and: [
                        { $eq: ['$biodataId', '$$biodataId'] },
                        { $eq: ['$isCheckout', true] },
                        { $eq: ['$userId', new mongoose.Types.ObjectId(req?.payload?.appUserId)] }
                    ]
                    }
                }
                }
            ],
            as: 'userInteractions'
            }
        },
        {
            $match: {
            'userInteractions': { $eq: [] } // Only allow biodatas where the user has NOT checked out
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $project: {
            userInteractions: 0
            }
        }
        ]);



        const totalJoinedCount = await Biodata.countDocuments({});

        res.status(200).json({
            success: true,
            error: false,
            count: totalJoinedCount,
            data: newlyJoinedData
        });
    } catch (error: unknown) {
        console.error("Error in get newly joined user", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const recommendationBiodata = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {

        const appUserId = req?.payload?.appUserId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        const userBioData = await Biodata.findOne({profileCreatedById: appUserId}).select('gotraDetails');

        const allTopMatchData = await Biodata.aggregate([
            {
                $match: { profileCreatedById: { $ne: req?.payload?.appUserId }, gotraDetails: userBioData?.gotraDetails}
            },
            {
                $lookup: {
                    from: 'biodatainteractions',
                    localField: '_id',
                    foreignField: 'biodataId',
                    as: 'interactionDetails'
                }
            },
        ])
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            success: true,
            error: false,
            count: allTopMatchData.length,
            data: allTopMatchData
        });
    } catch (error: unknown) {
        console.error("Error in get all bio data match", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getAllBioDataMatch = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {

        const appUserId = req?.payload?.appUserId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        const userBioData = await Biodata.findOne({profileCreatedById: appUserId}).select('gotraDetails');

        const recommendationData = await Biodata.find({ profileCreatedById: { $ne: req?.payload?.appUserId }, gotraDetails: userBioData?.gotraDetails})
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            success: true,
            error: false,
            count: recommendationData.length,
            data: recommendationData
        });
    } catch (error: unknown) {
        console.error("Error in get newly joined user", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getSendRequest = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {

        const appUserId = req?.payload?.appUserId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        const requestGetData = await BiodataInteraction.find({ userId: appUserId, isRequestSend: true, isAccpted: false })
        .populate("biodataId", "candidate createdAt")
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            success: true,
            error: false,
            count: requestGetData.length,
            data: requestGetData
        });
    } catch (error: unknown) {
        console.error("Error in send request", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getReceiveRequest = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {

        const appUserId = req?.payload?.appUserId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        const requestGetData = await BiodataInteraction.find({ biodataCreatedBy: appUserId, isRequestSend: true, isAccpted: false })
        .populate("biodataId", "candidate createdAt")
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            success: true,
            error: false,
            count: requestGetData.length,
            data: requestGetData
        });
    } catch (error: unknown) {
        console.error("Error in receive request", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getFavouristList = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {

        const appUserId = req?.payload?.appUserId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        const requestGetData = await BiodataInteraction.find({ userId: appUserId, addingToFavourite: true })
        .populate("biodataId", "candidate createdAt")
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            success: true,
            error: false,
            count: requestGetData.length,
            data: requestGetData
        });
    } catch (error: unknown) {
        console.error("Error in get favourite list", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getBiodataInteraction = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const biodataId = req.params.id;
        let interactionTypes: any = req?.query?.interactionTypes;

        if (!biodataId) {
            throw createError(400, "Biodata ID is required");
        }

        const filter: any = { _id: biodataId };

        if (interactionTypes && interactionTypes?.length > 0) {
            filter.interactionType = { $in: JSON.parse(interactionTypes) };
        }

        const interactions = await BiodataInteraction.find(filter).populate("biodataCreatedBy", "name email");
        res.status(200).json({
            error: false,
            success: true,
            count: interactions.length || 0,
            data: interactions
        });
    } catch (error: unknown) {
        console.error("Error in get favourite list", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getBiodataInteractionByUser = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        let interactionTypes: any = req?.query?.interactionTypes;

        const filter: any = { biodataCreatedBy: req?.payload?.appUserId };

        if (interactionTypes && interactionTypes?.length > 0) {
            filter.interactionType = { $in: JSON.parse(interactionTypes) };
        }

        const interactions = await BiodataInteraction.find(filter).populate("biodataCreatedBy", "name email");
        res.status(200).json({
            error: false,
            success: true,
            count: interactions.length || 0,
            data: interactions
        });
    } catch (error: unknown) {
        console.error("Error in get favourite list", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getAllBiodataInteraction = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        let interactionTypes: any = req?.query?.interactionTypes;

        const filter: any = { };

        if (interactionTypes && interactionTypes?.length > 0) {
            filter.interactionType = { $in: JSON.parse(interactionTypes) };
        }

        const interactions = await BiodataInteraction.find(filter).populate("biodataCreatedBy", "name email");
        res.status(200).json({
            error: false,
            success: true,
            count: interactions.length || 0,
            data: interactions
        });
    } catch (error: unknown) {
        console.error("Error in get favourite list", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const biodataInteraction = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req?.payload?.appUserId;
        const { biodataId, interactionType, message } = req.body;

        if (!biodataId || !userId || !interactionType) {
            throw createError(400, "Missing required fields");
        }

        if (!["checkout", "addToFavourite"].includes(interactionType)) {
            throw createError(400, "Interaction type is not valid");
        }

        const biodata = await Biodata.findById(biodataId);
        if (!biodata) throw createError(404, "Biodata not found");

        const user = await User.findById(userId);
        if (!user) throw createError(404, "User not found");

        const updateData: any = {};
        if (interactionType === "checkout") 
        {
            updateData.isCheckout = true;
            updateData.isCheckoutTime = new Date();
        }
        if (interactionType === "addToFavourite") {
            updateData.addingToFavourite = true;
            updateData.addingToFavouriteTime = new Date();
        }
        updateData.message = message || "";

        const existingInteraction = await BiodataInteraction.findOne({ biodataId, userId });

        if (existingInteraction) {
            const updated = await BiodataInteraction.findOneAndUpdate(
                { biodataId, userId },
                { $set: updateData },
                { new: true }
            );
            res.status(200).json({ message: "Interaction updated successfully", interaction: updated });
            return;
        }

        const newInteraction = new BiodataInteraction({
            biodataId,
            biodataCreatedBy: biodata?.profileCreatedById,
            userId,
            isCheckout: interactionType === "checkout",
            isCheckoutTime: interactionType === "checkout" ? new Date() : "",
            addingToFavourite: interactionType === "addToFavourite",
            addingToFavouriteTime: interactionType === "addToFavourite" ? new Date() : "",
            message: message || "",
        });

        await newInteraction.save();

        res.status(200).json({ message: "Interaction recorded successfully", interaction: newInteraction });
    } catch (error: unknown) {
        console.error("Error in biodata Interaction:", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const biodataSendAccept = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req?.payload?.appUserId;
        const { biodataId, type, message } = req.body;

        if (!biodataId || !userId || !type) {
            throw createError(400, "Missing required fields");
        }

        if (!["send", "accept", "reject"].includes(type)) {
            throw createError(400, "Invalid interaction type");
        }

        const biodata = await Biodata.findById(biodataId);
        if (!biodata) throw createError(404, "Biodata not found");

        const user = await User.findById(userId);
        if (!user) throw createError(404, "User not found");

        const updateData: any = {};
        if (type === "send") 
            {
                updateData.isRequestSend = true;
                updateData.requestSendTime = new Date();
            }
        if (type === "accept") {
            updateData.isAccpted = true;
            updateData.isRejected = false;
            updateData.requestAcceptTime = new Date();
        }
        if (type === "reject") {
            updateData.isRejected = true;
            updateData.isAccpted = false;
            updateData.requestRejectTime = new Date();
        }

        updateData.message = message || "";

        const existingInteraction = await BiodataInteraction.findOne({ biodataId, userId });

        if (existingInteraction) {
            const updated = await BiodataInteraction.findOneAndUpdate(
                { biodataId, userId },
                { $set: updateData },
                { new: true }
            );
            res.status(200).json({ message: "Interaction updated successfully", interaction: updated });
            return;
        }

        const newInteraction = new BiodataInteraction({
            biodataId,
            biodataCreatedBy: biodata?.profileCreatedById,
            userId,
            isRequestSend: type === "send",
            isAccpted: type === "accept",
            isRejected: type === "reject",
            requestSendTime: type === "send" ? new Date() : "",
            requestAcceptTime: type === "accept" ? new Date() : "",
            requestRejectTime: type === "reject" ? new Date() : "",
            message: message || "",
        });

        await newInteraction.save();

        res.status(200).json({ message: "Interaction recorded successfully", interaction: newInteraction });
    } catch (error: unknown) {
        console.error("Error in biodata send accept:", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const biodataCancelFavourite_Remove = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req?.payload?.appUserId;
        const { biodataId, type, message } = req.body;

        if (!biodataId || !userId || !type) {
            throw createError(400, "Missing required fields");
        }

        if (!["cancel", "remove_from_favourite"].includes(type)) {
            throw createError(400, "Invalid interaction type");
        }

        const biodata = await Biodata.findById(biodataId);
        if (!biodata) throw createError(404, "Biodata not found");

        const user = await User.findById(userId);
        if (!user) throw createError(404, "User not found");

        const updateData: any = {};
        if (type === "cancel") {
            updateData.isRequestSend = false;
            updateData.requestSendTime = "";
        }
        if (type === "remove_from_favourite") {
                updateData.addingToFavourite = false;
                updateData.addingToFavouriteTime = "";
        }

        updateData.message = message || "";

        const existingInteraction = await BiodataInteraction.findOne({ biodataId, userId });

        if (!existingInteraction) {
              throw createError(404, "Interaction not exist");
        }

        const updated = await BiodataInteraction.findOneAndUpdate(
                { biodataId, userId },
                { $set: updateData },
                { new: true }
        );

        res.status(200).json({ message: "Interaction updated successfully", interaction: updated });
    } catch (error: unknown) {
        console.error("Error in biodata cancel remove and remove_from_favourite:", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const checkBiodataCompleted = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
       
        const biodata = await Biodata.findOne({ profileCreatedById: req?.payload?.appUserId });

        const isComplete = isBiodataComplete(biodata);

        res.status(200).json({
            error: false,
            success: true,
            message: "Interaction updated successfully", 
            isComplete
        });
    } catch (error: unknown) {
        console.error("Error in biodata cancel remove and remove_from_favourite:", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};