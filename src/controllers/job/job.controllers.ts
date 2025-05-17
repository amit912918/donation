import { createError } from "@/helpers/common/backend.functions";
import { RequestType } from "@/helpers/shared/shared.type";
import User from "@/models/auth/auth.models";
import Job from "@/models/job/job.models";
import JobInteraction from "@/models/job/jobinteraction.models";
import JobReport from "@/models/job/jobreport.model";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// 📌 Create a new job
export const createJob = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            jobTitle, jobDescription, minimumQualification, jobType,
            jobLocation, experience, salaryCriteria, jobAddress,
            jobCity, businessName, contactNumber, hideContact, documents
        } = req.body;

        const newJob = new Job({
            jobTitle,
            jobDescription,
            minimumQualification,
            jobType,
            jobLocation,
            experience,
            salaryCriteria,
            jobAddress,
            jobCity,
            businessName,
            contactNumber,
            hideContact,
            jobCreatedBy: new mongoose.Types.ObjectId(req?.payload?.appUserId),
            documents
        });

        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Update an existing job
export const updateJob = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.params.id;
        const updatedField = req.body;

        // const updatedJob = await Job.findByIdAndUpdate(
        //     jobId,
        //     {
        //         ...req.body,
        //         jobUpdatedBy: new mongoose.Types.ObjectId(req?.payload?.appUserId),
        //         updatedAt: new Date()
        //     },
        //     { new: true, runValidators: true }
        // );

        const updatedJob = await Job.findByIdAndUpdate(
            new mongoose.Types.ObjectId(jobId),
            { $set: updatedField },
            { new: true } // returns the updated document
        );

        if (!updatedJob) {
            return next(createError(404, "Job not found"));
        }

        res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};


// 📌 Get all job
export const getAllJobs = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { page = 1, limit = 10, jobType, jobLocation, experience, jobCity } = req.query;

        const filter: any = {};
        filter.jobCreatedBy = new mongoose.Types.ObjectId(req?.payload?.appUserId);
        if (jobType) filter.jobType = jobType;
        if (jobLocation) filter.jobLocation = jobLocation;
        if (experience) filter.experience = experience;
        if (jobCity) filter.jobCity = jobCity;

        const jobs = await Job.find(filter)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const totalJobs = await Job.countDocuments(filter);

        res.status(200).json({
            jobs,
            pagination: {
                totalJobs,
                totalPages: Math.ceil(totalJobs / Number(limit)),
                currentPage: Number(page),
                pageSize: Number(limit),
            },
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all job
export const getAllJobWithUser = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allJobs = await Job.aggregate([
            {
                $match: {
                    jobCreatedBy: new mongoose.Types.ObjectId(req?.payload?.appUserId)
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "jobCreatedBy",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            {
                $unwind: {
                    path: "$creator",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    jobTitle: 1,
                    jobDescription: 1,
                    minimumQualification: 1,
                    jobType: 1,
                    jobLocation: 1,
                    experience: 1,
                    salaryCriteria: 1,
                    jobAddress: 1,
                    jobCity: 1,
                    businessName: 1,
                    contactNumber: 1,
                    hideContact: 1,
                    isPublished: 1,
                    createdAt: 1,
                    "creator.name": 1,
                    "creator.email": 1,
                },
            },
        ]);

        for (let i = 0; i < allJobs.length; i++) {
            let item = allJobs[i];
            const appliedUsers = await JobInteraction.aggregate([
                {
                    $match: {
                        jobId: item._id,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "appliedUser",
                    },
                },
                {
                    $unwind: {
                        path: "$appliedUser",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        isApplied: 1,
                        isContacted: 1,
                        isInterested: 1,
                        userId: "$appliedUser._id",
                        name: "$appliedUser.name",
                        email: "$appliedUser.email",
                        mobile: "$appliedUser.mobile",
                        profile: "$appliedUser.profile",
                        appliedAt: "$createdAt",
                    },
                },
            ]);
            allJobs[i].appliedUsers = appliedUsers;
        }

        // allJobs.map(async (item, index) => {
        //     console.log(item._id, "item._id");
        //     const appliedUsers = await JobInteraction.aggregate([
        //         {
        //             $match: {
        //                 jobId: item._id, // Match specific job
        //             },
        //         },
        //         {
        //             $lookup: {
        //                 from: "users",
        //                 localField: "userId",
        //                 foreignField: "_id",
        //                 as: "appliedUser",
        //             },
        //         },
        //         {
        //             $unwind: {
        //                 path: "$appliedUser",
        //                 preserveNullAndEmptyArrays: true,
        //             },
        //         },
        //         {
        //             $project: {
        //                 _id: 0,
        //                 userId: "$appliedUser._id",
        //                 name: "$appliedUser.name",
        //                 email: "$appliedUser.email",
        //                 appliedAt: "$createdAt", // From JobInteraction
        //             },
        //         },
        //     ]);

        //     console.log(appliedUsers, "appliedUsers");
        // })

        // const jobsWithApplicants = await Job.aggregate([
        //     {
        //         $lookup: {
        //             from: 'jobinteractions', // Collection name in MongoDB (lowercase + plural)
        //             localField: '_id',
        //             foreignField: 'jobId',
        //             as: 'interactions'
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: '$interactions',
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'interactions.userId',
        //             foreignField: '_id',
        //             as: 'interactions.user'
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: '$interactions.user',
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: '$_id',
        //             jobTitle: { $first: '$jobTitle' },
        //             jobDescription: { $first: '$jobDescription' },
        //             // include more job fields if needed
        //             applicants: {
        //                 $push: {
        //                     user: '$interactions.user',
        //                     interaction: '$interactions'
        //                 }
        //             }
        //         }
        //     }
        // ]);
        res.status(200).send({
            allJobs
        })
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get job by id
export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) throw createError(400, "Job not found");

        res.status(200).json(job);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Unpublished job
export const unpublishedJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) throw createError(400, "Job not found");

        await Job.updateOne(
            { _id: req.params.id },
            { $set: { isPublished: false } }
        );

        res.status(200).json(job);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get job with user
export const getJobWithUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.params.id;
        let interactionTypes: any = req?.query?.interactionTypes;

        if (!jobId) {
            throw createError(400, "Job ID is required");
        }

        const job = await Job.findById(jobId);

        const filter: any = { jobId };

        if (interactionTypes && interactionTypes?.length > 0) {
            filter.interactionType = { $in: JSON.parse(interactionTypes) };
        }

        const interactions = await JobInteraction.find(filter).populate("userId", "name email profile");

        res.status(200).json({
            error: false,
            message: "Job with user get successfully!",
            job,
            interactions
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 delete job
export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) throw createError(400, "Job not found");

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 create or update job interaction
export const createOrUpdateJobInteraction = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const userId = req?.payload?.appUserId;
        const { jobId, interactionType, message } = req.body;

        if (interactionType !== "Applied" && interactionType !== "notInterested" && interactionType !== "Contacted") {
            throw createError(400, "Interaction type is not valid");
        }

        let filter: any = {};
        if (interactionType === "Applied") filter.isApplied = true;
        if (interactionType === "notInterested") filter.isInterested = true;
        if (interactionType === "Contacted") filter.isContacted = true;

        if (!jobId || !userId || !interactionType) {
            throw createError(400, "Missing required fields");
        }

        const job = await Job.findById(jobId);
        if (!job) throw createError(400, "Job not found");

        const user = await User.findById(userId);
        if (!user) throw createError(400, "User not found");

        const existingInteraction = await JobInteraction.findOne({ jobId, userId });

        if (existingInteraction) {
            await JobInteraction.findOneAndUpdate(
                { jobId, userId },
                filter,
                { new: true }
            );
            // throw createError(400, `User already ${interactionType.toLowerCase()} for this job.`);
            res.status(200).json({ message: "Interaction updated successfully" });
            return;
        }

        // If no interaction exists, create a new one
        const newInteraction = new JobInteraction({
            jobId,
            userId,
            isApplied: interactionType === "Applied" ? true : false,
            isInterested: interactionType === "Interested" ? true : false,
            isContacted: interactionType === "Contacted" ? true : false,
            message
        });
        await newInteraction.save();

        res.status(201).json({ message: "Interaction recorded successfully", interaction: newInteraction });
    } catch (error: any) {
        if (error.code === 11000) {
            next(createError(400, "Duplicate interaction not allowed."));
        }
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 get job interactions
export const getJobInteractions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const jobId = req.params.id;
        let interactionTypes: any = req?.query?.interactionTypes;

        if (!jobId) {
            throw createError(400, "Job ID is required");
        }

        const filter: any = { jobId };

        if (interactionTypes && interactionTypes?.length > 0) {
            filter.interactionType = { $in: JSON.parse(interactionTypes) };
        }

        const interactions = await JobInteraction.find(filter).populate("userId", "name email");
        res.status(200).json(interactions);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 get user interactions
export const getUserInteractions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.id;

        if (!userId) {
            throw createError(400, "User ID is required");
        }

        const interactions = await JobInteraction.find({ userId }).populate("jobId", "jobTitle businessName");
        res.status(200).json(interactions);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all job
export const getJobForUser = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { page = 1, limit = 10, jobType, jobLocation, experience, jobCity } = req.query;

        const filter: any = {};
        if (jobType) filter.jobType = jobType;
        if (jobLocation) filter.jobLocation = jobLocation;
        if (experience) filter.experience = experience;
        if (jobCity) filter.jobCity = jobCity;

        const skip = (Number(page) - 1) * Number(limit);

        const jobs = await Job.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .select('jobTitle jobDescription jobLocation createdAt');

        // Add interactions to jobs
        const userId = req.payload?.appUserId;
        if (!userId) {
            throw createError(401, 'User ID missing in request payload');
        }

        const updatedJobs = await Promise.all(
            jobs.map(async (job) => {
                const interaction = await JobInteraction.findOne({
                    jobId: job._id,
                    userId: new mongoose.Types.ObjectId(userId),
                }).select('_id isApplied isContacted isInterested');

                return {
                    ...job.toObject(),
                    interaction,
                };
            })
        );

        const totalJobs = await Job.countDocuments(filter);

        res.status(200).json({
            jobs: updatedJobs,
            pagination: {
                totalJobs,
                totalPages: Math.ceil(totalJobs / Number(limit)),
                currentPage: Number(page),
                pageSize: Number(limit),
            },
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || 'Internal Server Error'));
    }
};

// 📌 Report on job
export const jobReport = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { jobId, reason, details } = req.body;

        const jobReport = new JobReport({
            jobId: jobId,
            reportedBy: new mongoose.Types.ObjectId(req?.payload?.appUserId),
            reason: reason,
            details: details
        });

        jobReport.save();

        res.status(200).json({
            error: false,
            message: "Report on job created successfully"
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};