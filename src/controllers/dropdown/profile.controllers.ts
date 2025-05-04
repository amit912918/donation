import ProfileCount from "@/models/dropdown/profilecount.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createProfileCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, count } = req.body;
        const profile = new ProfileCount({ name, description, count });
        const saved = await profile.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllProfileCounts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const profiles = await ProfileCount.find();
        res.json(profiles);
    } catch (err) {
        next(err);
    }
};

// GET ONE
export const getProfileCountById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await ProfileCount.findById(req.params.id);
        if (!profile) throw createError(404, "Profile count entry not found");
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateProfileCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, count } = req.body;
        const updated = await ProfileCount.findByIdAndUpdate(
            req.params.id,
            { name, description, count },
            { new: true, runValidators: true }
        );
        if (!updated) throw createError(404, "Profile count entry not found");
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteProfileCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await ProfileCount.findByIdAndDelete(req.params.id);
        if (!deleted) throw createError(404, "Profile count entry not found");
        res.json({ message: "Profile count entry deleted successfully" });
    } catch (err) {
        next(err);
    }
};
