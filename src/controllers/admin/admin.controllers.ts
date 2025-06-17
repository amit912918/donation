import { createError } from "@/helpers/common/backend.functions";
import { RequestType } from "@/helpers/shared/shared.type";
import User from "@/models/auth/auth.models";
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
        res.status(201).json({
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
        const mentorListData = await User.find({ isMentor: true, confirmed: true, blocked: true });
        res.status(201).json({
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