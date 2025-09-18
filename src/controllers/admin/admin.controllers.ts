import { createError } from "@/helpers/common/backend.functions";
import { RequestType } from "@/helpers/shared/shared.type";
import User from "@/models/auth/auth.models";
import Job from "@/models/job/job.models";
import Biodata from "@/models/matrimony/biodata.models";
import Mission from "@/models/mission/mission.models";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// 📌 Make remove mentor
export const makeRemoveMentor = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { isMentor } = req.body;
        const updateUserProfileData = await User.findByIdAndUpdate(
            req.params.userId,
            { isMentor },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            error: false,
            success: true,
            message: "User detail updated successfully",
            data: updateUserProfileData
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Make remove admin
export const makeRemoveAdmin = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updateUserProfileData = await User.findByIdAndUpdate(
            req.params.userId,
            { role: 'admin' },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            error: false,
            success: true,
            message: "User detail updated successfully",
            data: updateUserProfileData
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Make remove bicholiya
export const makeRemoveBicholiya = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { isBicholiya } = req.body;
        const updateUserProfileData = await User.findByIdAndUpdate(
            req.params.userId,
            { isBicholiya },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            error: false,
            success: true,
            message: "User detail updated successfully",
            data: updateUserProfileData
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 get mentor list
export const getMentorList = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name } = req.query;

        const filter: any = {
            isMentor: true,
            confirmed: true,
            blocked: false,
        };

        if (typeof name === 'string') {
            filter.name = new RegExp(name.replace(/"/g, ''), 'i');
        }

        const mentorListData = await User.aggregate([
        { $match: filter },
        {
            $lookup: {
            from: 'news',
            localField: '_id',
            foreignField: 'publishedById',
            as: 'posts',
            },
        },
        {
            $addFields: {
            postCount: { $size: '$posts' },
            },
        },
        {
            $project: {
            posts: 0,
            },
        },
        ]);

        res.status(200).json({
            error: false,
            success: true,
            message: "Mentor fetch detail successfully",
            count: mentorListData.length,
            data: mentorListData
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 get all unassigned biodata
export const getAllUnassignedBiodata = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name } = req.query;

        const filter: any = {};

        if (typeof name === 'string') {
            filter.name = new RegExp(name.replace(/"/g, ''), 'i');
        }

        let applicableBiodata: any = [];

        const biodata = await Biodata.find(filter).populate("profileCreatedBy", "name email profile");

        biodata.map((item: any, index) => {
            if(!item?.bicholiyaId || item?.bicholiyaId === "" || item?.bicholiyaId === null || item?.bicholiyaId === undefined) {
                applicableBiodata.push(item);
            }
        })

        res.status(200).json({
            error: false,
            success: true,
            message: "Biodata fetch detail successfully",
            count: applicableBiodata.length,
            data: applicableBiodata
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 get all unassigned biodata
export const assignBicholiya = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { biodataId, BicholiyaId } = req.body;

        // Step 1: Set all existing statuses to inactive
        await Biodata.updateOne(
        { _id: biodataId },
        { $set: { "assignBicholiyaSchema.$[].status": "inactive" } }
        );

        const updated_data = await Biodata.findByIdAndUpdate(
        biodataId,
        {
            BicholiyaId: new mongoose.Types.ObjectId(BicholiyaId),
            $addToSet: {
            assignBicholiyaSchema: { bicholiyaId: new mongoose.Types.ObjectId(BicholiyaId), status: "active" }
            }
        },
        { new: true }
        );

        res.status(200).json({
            error: false,
            success: true,
            message: "Assign bicholiya successfully",
            data: updated_data
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Active mission by admin
export const activeMissionByAdmin = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const missionId = req.params.missionId;
        const { status } = req.body;

        if (!["Pending", "Approved", "Disapproved"].includes(status)) {
            return next(createError(400, "Invalid mission status"));
        }

        const missionUpdateData = await Mission.findByIdAndUpdate(
            missionId,
            {
                adminVerificationStatus: status
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            error: false,
            success: true,
            message: "Mission updated successfully",
            data: missionUpdateData
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Active job by admin
export const activeJobByAdmin = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.params.jobId;
        const { isPublished, status } = req.body;

        if (!["Pending", "Approved", "Disapproved"].includes(status)) {
            return next(createError(400, "Invalid job status"));
        }

        const missionUpdateData = await Job.findByIdAndUpdate(
            jobId,
            {
                isPublished: isPublished ? true : false,
                status
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            error: false,
            success: true,
            message: "Job updated successfully",
            data: missionUpdateData
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Active job by admin
export const activeBiodataByAdmin = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const biodataId = req.params.biodataId;
        const { adminVerificationStatus } = req.body;

        const biodataUpdateData = await Biodata.findByIdAndUpdate(
            biodataId,
            {
                adminVerificationStatus: adminVerificationStatus,
                statusUpdateTime: new Date()
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            error: false,
            success: true,
            message: "Biodata updated successfully",
            data: biodataUpdateData
        });
    } catch (error: any) {
        console.log("Error in updata biodata by admin", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};