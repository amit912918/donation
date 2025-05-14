import { NextFunction, Request, Response } from "express";
import Mission from "@/models/mission/mission.models";
import { createError } from "@/helpers/common/backend.functions";
import Donation from "@/models/mission/donate.models";
import { RequestType } from "@/helpers/shared/shared.type";
import mongoose from "mongoose";
import User from "@/models/auth/auth.models";

// 📌 Create a new mission
export const donateToMission = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const userId = req.payload?.appUserId;
        const { missionId, amount } = req.body;
        // Find the mission
        const mission = await Mission.findById(missionId);
        if (!mission) {
            throw createError(404, "Mission not found");
        }

        // Create a donation record
        const donation = new Donation({ user: userId, mission: missionId, amount: amount });
        await donation.save();

        res.status(201).json({ message: "Donation successful!" });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get top donon of the week
export const getTopDonorOfTheWeek = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Calculate the start of the current week (Sunday)
        const now = new Date();
        const dayOfWeek = now.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        // Aggregate donations within the current week
        const topDonor = await Donation.aggregate([
            {
                $match: {
                    donatedAt: { $gte: startOfWeek, $lte: now }
                }
            },
            {
                $group: {
                    _id: '$user', // group by user ObjectId
                    totalDonated: { $sum: '$amount' }
                }
            },
            {
                $sort: { totalDonated: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users', // make sure this matches your actual collection name
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    totalDonated: 1,
                    name: '$userDetails.name',
                    email: '$userDetails.email',
                    profile: '$userDetails.profile'
                }
            }
        ]);


        if (topDonor.length === 0) {
            throw createError(404, "No donations found for the current week.");
        }

        res.status(200).json(topDonor[0]);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all donate by Id
export const getDonateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params.id, "req.params.id");
        // const donation = await Donation.findById(req.params.id);
        const donation = await Donation.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'users',                 // collection name
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    profile: '$userDetails.profile',
                    amount: 1,
                    name: '$userDetails.name'
                }
            }
        ]);
        console.log(donation, "donation");
        if (donation.length === 0) {
            return next(createError(404, "Donation not found"));
        }
        res.status(200).json(donation);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get mission donation by mission id
export const getMissionDonation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const missionId = req.params.missionId;
        const donation = await Donation.aggregate([
            { $match: { mission: new mongoose.Types.ObjectId(missionId) } },
            {
                $lookup: {
                    from: 'users',                 // collection name
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    profile: '$userDetails.profile',
                    amount: 1,
                    name: '$userDetails.name'
                }
            }
        ]);
        if (donation.length === 0) {
            return next(createError(404, "Donation not found"));
        }
        res.status(200).json(donation);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};