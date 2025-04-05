import { createError } from "@/helpers/common/backend.functions";
import Job from "@/models/job/job.models";
import { Request, Response, NextFunction } from "express";

// 📌 Create a new job
export const createJob = async (req: Request, res: Response, next: NextFunction) => {
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
            documents
        });

        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all job
export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, jobType, jobLocation, experience, jobCity } = req.query;

        const filter: any = {};
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

// 📌 Get job by id
export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) throw createError(400, "Job not found");

        res.status(200).json(job);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 delete job
export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) throw createError(400, "Job not found");

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

