import { createError, findNearestUsers } from "@/helpers/common/backend.functions";
import { RequestType } from "@/helpers/shared/shared.type";
import User from "@/models/auth/auth.models";
import BiodataInteraction from "@/models/matrimony/biodata.interaction.models";
import Biodata from "@/models/matrimony/biodata.models";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const getBicholiyaList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const search = (req.query.search as string) || "";

        const searchQuery: any = {
            isBicholiya: true,
        };

        if (search) {
            searchQuery.name = { $regex: search, $options: "i" };
        }

        const new_bicholiya_data = await User.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: "biodatas", // collection name (must match the collection name in MongoDB, usually lowercase plural of model)
                    localField: "_id",
                    foreignField: "BicholiyaId",
                    as: "biodata"
                }
            },
            {
                $addFields: {
                    biodata_manage: { $size: "$biodata" }
                }
            },
            {
                $project: {
                    biodata: 0 // remove the full array, keep only count
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            error: false,
            count: new_bicholiya_data.length,
            data: new_bicholiya_data
        });
    } catch (error: unknown) {
        console.error("Error in get bicholiya list", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getBicholiyaAnalyticsData = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const bicholiya_count = await User.countDocuments({ isBicholiya: true});

        res.status(200).json({
            success: true,
            error: false,
            message: "Bicholiya analytics data retrieve successfully",
            bicholiya_count,
            profiles: 500,
            success_story: 150
        });
    } catch (error: any) {
        console.log("Error in bicholiya analytics data", error);
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

export const getAreawiseCandidateForBicholiya = async (req: RequestType, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const bicholiya_detail = await User.findOne({ _id: req.payload?.appUserId });
    const bicholiya_city = bicholiya_detail?.profile?.city;

    if (!bicholiya_city) {
      return next(createError(400, 'City not found in user profile'));
    }

    const query: any = {
      'city': bicholiya_city,
      adminVerificationStatus: 'approved',
      bicholiyaVerificationStatus: 'approved'
    };

    if (search !== "" && search !== undefined && search !== null) {
      query['profileCreatedBy'] = { $regex: search, $options: 'i' }; // case-insensitive
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [user_list, total] = await Promise.all([
      Biodata.find(query).skip(skip).limit(Number(limit)),
      Biodata.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      error: false,
      message: "Area wise user data retrieved successfully",
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        users: user_list
    });

  } catch (error: any) {
    console.log("Error in area wise user data", error);
    next(createError(error.status || 500, error.message || "Internal Server Error"));
  }
};

export const getAreaWiseBicholiyaForCandidate = async (req: RequestType, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, user_city, user_state, user_country, search = '' } = req.query;
    // const user = await findNearestUsers(28.5706333, 77.3272147);
    // console.log(user, "user");
    // return;

    if (!user_city) {
      return next(createError(400, 'City not found in user profile'));
    }               

    const query: any = {
     _id: { $ne: new mongoose.Types.ObjectId(req?.payload?.appUserId) },
     isBicholiya: true,
    'profile.city': user_city
    };

    // Apply search filter if provided
    if (search) {
    query['profile.name'] = { $regex: search, $options: 'i' }; // assuming name is inside profile
    }

    // Pagination values
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    let [user_list = [], total = 0] = await Promise.all([
        User.find(query).skip(skip).limit(pageSize),
        User.countDocuments(query),
    ]);

    // include state wise bicholiya also
    if(user_state) {
        const state_query: any = {
        _id: { $ne: new mongoose.Types.ObjectId(req?.payload?.appUserId) },
        isBicholiya: true,
        'profile.city': { $ne: user_city },
        'profile.state': user_state
        };

        // Apply search filter if provided
        if (search) {
        state_query['profile.name'] = { $regex: search, $options: 'i' };
        }

        const [state_user_list = [], state_total = 0] = await Promise.all([
            User.find(state_query).skip(skip).limit(pageSize),
            User.countDocuments(state_query),
        ]);
        user_list = user_list.concat(state_user_list);
        total += state_total;
    }

    // include country wise bicholiya also
    if(user_country) {
        const country_query: any = {
        _id: { $ne: new mongoose.Types.ObjectId(req?.payload?.appUserId) },
        isBicholiya: true,
        'profile.city': { $ne: user_city },
        'profile.state': { $ne: user_state },
        'profile.country': user_country
        };

        // Apply search filter if provided
        if (search) {
        country_query['profile.name'] = { $regex: search, $options: 'i' };
        }

        const [country_user_list = [], country_total = 0] = await Promise.all([
            User.find(country_query).skip(skip).limit(pageSize),
            User.countDocuments(country_query),
        ]);
        user_list = user_list.concat(country_user_list);
        total += country_total;
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Area wise user data retrieved successfully",
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        users: user_list
    });

  } catch (error: any) {
    console.log("Error in area wise user data", error);
    next(createError(error.status || 500, error.message || "Internal Server Error"));
  }
};

export const updateBioDataStatus = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req?.payload?.appUserId;
        const { biodataId, type, message } = req.body;

        if (!biodataId || !userId || !type) {
            throw createError(400, "Missing required fields");
        }

        if (!["approved", "rejected", "pending"].includes(type)) {
            throw createError(400, "Invalid status");
        }

        const biodata = await Biodata.findById(biodataId);
        if (!biodata) throw createError(404, "Biodata not found");

        const user = await User.findById(userId);
        if (!user) throw createError(404, "User not found");

        const updateData: any = {
            bicholiyaVerificationStatus: type,
            statusUpdateTime: new Date(),
            message: message || ""
        };

        const existingInteraction = await Biodata.findOne({ _id: biodataId });

        if(!existingInteraction) {
            throw createError(400, "Biodata not found");
        }

        const updated = await Biodata.findOneAndUpdate(
            { _id: biodataId },
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({
            error: false,
            success: true,
            message: "status updated successfully",
            updatedData: updated
        });
    } catch (error: unknown) {
        console.error("Error in biodata update status:", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

export const getBiodataStatusWise = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status, search, page = "1", limit = "10" } = req.query;
        console.log(req.query);

        // Pagination values
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);
        const skip = (pageNumber - 1) * limitNumber;

        // Build query condition
        let query: any = {};

        // status filter
        if (status) {
            if (!["approved", "rejected", "pending"].includes(status as string)) {
                throw createError(400, "Invalid status");
            }
            query.status = status;
        }

        // search filter (case insensitive regex)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        // get total count (for pagination metadata)
        const totalCount = await Biodata.countDocuments(query);

        // fetch paginated result
        const biodata = await Biodata.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });

        // if (!biodata || biodata.length === 0) {
        //     throw createError(404, "No biodata found");
        // }

        res.status(200).json({
            error: false,
            success: true,
            message: "Biodata fetched successfully",
            pagination: {
                total: totalCount,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalCount / limitNumber),
            },
            data: biodata || [],
        });
    } catch (error: unknown) {
        console.error("Error in biodata status wise search:", error);
        const err = error instanceof Error ? error.message : "Internal server error";
        next(createError(500, err));
    }
};

