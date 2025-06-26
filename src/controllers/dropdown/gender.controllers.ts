import Gender from "@/models/dropdown/gender.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createGender = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { genderName, description } = req.body;
        const genderExist = await Gender.find({ genderName });
        if (genderExist) {
            return next(createError(400, "Gender already exist!"))
        }
        const gender = new Gender({ genderName, description });
        const saved = await gender.save();
        res.status(200).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllGenders = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const genders = await Gender.find();
        res.json(genders);
    } catch (err) {
        next(err);
    }
};

// GET ONE
export const getGenderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gender = await Gender.findById(req.params.id);
        if (!gender) throw createError(404, "Gender not found");
        res.json(gender);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateGender = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { genderName, description } = req.body;
        const updated = await Gender.findByIdAndUpdate(
            req.params.id,
            { genderName, description },
            { new: true, runValidators: true }
        );
        if (!updated) throw createError(404, "Gender not found");
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteGender = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Gender.findByIdAndDelete(req.params.id);
        if (!deleted) throw createError(404, "Gender not found");
        res.json({ message: "Gender deleted successfully" });
    } catch (err) {
        next(err);
    }
};
