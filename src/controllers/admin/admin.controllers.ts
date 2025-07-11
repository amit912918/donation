import { createError } from "@/helpers/common/backend.functions";
import { RequestType } from "@/helpers/shared/shared.type";
import User from "@/models/auth/auth.models";
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
            foreignField: 'publishedBy',
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

// 📌 Active mission by admin
export const activeMissionByAdmin = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const missionId = req.params.missionId;
        const { isActive } = req.body;

        const missionUpdateData = await Mission.findByIdAndUpdate(
            req.params.missionId,
            { isActive },
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