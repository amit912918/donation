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

        const donations = await Donation.find({
            donatedAt: { $gte: startOfWeek, $lte: now }
        });
        const users = await User.find({
            _id: { $in: [new mongoose.Types.ObjectId("681998c8be99d85e5faf7c4d"), new mongoose.Types.ObjectId("6818caba263f1e10901bb1bf")] }
        }).lean();
        console.log(users);

        console.log(donations, "donations");

        // Aggregate donations within the current week
        const topDonor = await Donation.aggregate([
            {
                $match: {
                    donatedAt: { $gte: startOfWeek, $lte: now }
                }
            },
            {
                $group: {
                    _id: '$user',
                    totalDonated: { $sum: '$amount' }
                }
            },
            {
                $sort: { totalDonated: -1 }
            },
            {
                $limit: 10
            }
        ]);
        console.log(topDonor, "topDonar");
        if (topDonor.length === 0) {
            throw createError(404, "No donations found for the current week.");
        }

        const data = [];
        for (let i = 0; i < topDonor.length; i++) {
            const userId = topDonor[i]._id;
            const totalDonated = topDonor[i].totalDonated;
            console.log(userId, "userId");
            const userData = await User.findById(userId).select({
                name: 1,
                email: 1,
                mobile: 1,
                'profile.image': 1,
                'profile.address': 1,
                'profile.city': 1,
                'profile.gender': 1,
                'profile.dob': 1
            });
            data.push({
                totalDonated,
                userData
            })
        }

        res.status(200).json({
            success: true,
            error: false,
            message: "Weekly brahmas fetch successfully",
            data
        });
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