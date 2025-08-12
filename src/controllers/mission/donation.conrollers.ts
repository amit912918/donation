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

        res.status(200).json({ message: "Donation successful!" });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get top donon of the week
export const getTopDonor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { time, search } = req.body; // expects { "time": "weekly", "search": "john" }
        const now = new Date();
        let startDate: Date;
        let limit: number;

        if (time === 'monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            limit = 50;
        } else {
            const dayOfWeek = now.getDay(); // Sunday = 0
            startDate = new Date(now);
            startDate.setDate(now.getDate() - dayOfWeek);
            startDate.setHours(0, 0, 0, 0);
            limit = 10;
        }

        // Match donation time
        const matchStage: any = {
            donatedAt: { $gte: startDate, $lte: now }
        };

        // Aggregate top donors
        const topDonors = await Donation.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: '$user',
                    totalDonated: { $sum: '$amount' }
                }
            },
            { $sort: { totalDonated: -1 } },
            { $limit: limit }
        ]);

        if (!topDonors.length) {
            res.status(200).json({
                success: true,
                error: false,
                message: `No donations found for the selected ${time || 'weekly'} period`,
                data: []
            });
            return;
        }

        // Build user filter if search is provided
        const userFilter: any = {};
        if (search && search.trim()) {
            userFilter.name = { $regex: search.trim(), $options: "i" };
        }

        // Get donor details with optional search
        const donorsData = await Promise.all(
            topDonors.map(async (donor) => {
                const userData = await User.findOne({ _id: donor._id, ...userFilter })
                    .select({
                        name: 1,
                        email: 1,
                        mobile: 1,
                        'profile.image': 1,
                        'profile.address': 1,
                        'profile.city': 1,
                        'profile.gender': 1,
                        'profile.dob': 1
                    });

                if (!userData) return null; // filtered out by search
                return { totalDonated: donor.totalDonated, userData };
            })
        );

        // Filter out nulls (non-matching search results)
        const filteredData = donorsData.filter(Boolean);

        res.status(200).json({
            success: true,
            error: false,
            message: `Top ${limit} ${time || 'weekly'} donors fetched successfully.`,
            data: filteredData
        });

    } catch (error: any) {
        console.log("Error in getTopDonor:", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};


// 📌 Get all donate by Id
export const getDonateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params.id, "req.params.id");
        const donation = await Donation.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'users',
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
        res.status(200).json(donation);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all donors
export const getAllDonors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const donation = await Donation.aggregate([
            {
                $group: {
                    _id: '$user', // group by user ID
                    totalDonated: { $sum: '$amount' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id', // match grouped _id with user._id
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    userId: '$_id',
                    name: '$userDetails.name',
                    profile: '$userDetails.profile',
                    totalDonated: 1
                }
            }
        ]);

        res.status(200).json({
            error: false,
            success: true,
            count: donation ? donation.length : 0,
            data: donation
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get donation by user
export const getDonationByUser = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const appUserId = req?.payload?.appUserId;
        const donation = await Donation.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(appUserId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $lookup: {
                    from: 'missions',
                    localField: 'mission',
                    foreignField: '_id',
                    as: 'missionDetails'
                }
            },
            { $unwind: '$missionDetails' },
            {
                $project: {
                    profile: '$userDetails.profile',
                    amount: 1,
                    name: '$userDetails.name',
                    mission: '$missionDetails',
                    donatedAt: '$donatedAt'
                }
            }
        ]);
        
        res.status(200).json({
            error: false,
            success: true,
            count: donation.length,
            data: donation
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get donation analytics data
export const getDonationAnalyticsData = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const appUserId = req?.payload?.appUserId;
        const total_donation = await Donation.countDocuments({ user: appUserId });
        const result = await Donation.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(appUserId) }  // Filter by user
        },
        {
            $group: {
            _id: null,                          // Grouping across all matched documents
            totalDonated: { $sum: "$amount" }  // Sum the `amount` field
            }
        }
        ]);
        const amount_donated = result[0]?.totalDonated || 0;

        const mission_count = await Mission.countDocuments({ missionCreatedBy: appUserId });
        
        res.status(200).json({
            error: false,
            success: true,
            total_donation,
            amount_donated,
            mission_count
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};