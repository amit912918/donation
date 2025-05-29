import { RequestType } from "@/helpers/shared/shared.type";
import Biodata from "@/models/matrimony/biodata.models";
import { Request, Response, NextFunction } from "express";

export const createBiodata = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const existingBiodata = await Biodata.findOne({ profileCreatedById: req.payload?.appUserId });

        if (existingBiodata) {
            const updatedBiodata = await Biodata.findByIdAndUpdate(
                existingBiodata._id,
                { ...req.body },
                { new: true }
            );
            res.status(200).json({ success: true, message: "Biodata updated", data: updatedBiodata });
            return;
        } else {
            const newBiodata = await Biodata.create({
                ...req.body,
                profileCreatedById: req.payload?.appUserId,
            });
            res.status(201).json({ success: true, message: "Biodata created", data: newBiodata });
            return;
        }
    } catch (error) {
        next(error);
    }
};

export const getAllBiodatas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const search = (req.query.search as string) || "";

        // Build search query (case-insensitive, partial match on candidate name, city, or profileCreatedBy)
        const searchQuery = {
            $or: [
                { "candidate.name": { $regex: search, $options: "i" } },
                { "candidate.city": { $regex: search, $options: "i" } },
                { profileCreatedBy: { $regex: search, $options: "i" } }
            ]
        };

        const biodatas = await Biodata.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Biodata.countDocuments(searchQuery);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            count: biodatas.length,
            data: biodatas
        });
    } catch (error) {
        next(error);
    }
};

export const getBiodataById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const biodata = await Biodata.findById(req.params.id);
        if (!biodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, data: biodata });
    } catch (error) {
        next(error);
    }
};

export const getBiodataByUserId = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
    try {
        const biodata = await Biodata.find({ profileCreatedById: req.payload?.appUserId });
        if (!biodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, data: biodata });
    } catch (error) {
        next(error);
    }
};

export const updateBiodata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedBiodata = await Biodata.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBiodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, data: updatedBiodata });
    } catch (error) {
        next(error);
    }
};

export const deleteBiodata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const deletedBiodata = await Biodata.findByIdAndDelete(req.params.id);
        if (!deletedBiodata) {
            res.status(404).json({ success: false, message: "Biodata not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Biodata deleted successfully" });
    } catch (error) {
        next(error);
    }
};
