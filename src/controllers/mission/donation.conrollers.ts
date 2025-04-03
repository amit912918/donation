import { NextFunction, Request, Response } from "express";
import missionModels from "@/models/mission/mission.models";
import Mission from "@/models/mission/mission.models";
import { createError } from "@/helpers/common/backend.functions";
import Donation from "@/models/mission/donate.models";

// 📌 Create a new mission
export const donateToMission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { missionId, userId, amount } = req.body;
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

        if (topDonor.length === 0) {
            throw createError(404, "No donations found for the current week.");
        }

        res.status(200).json(topDonor[0]);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};