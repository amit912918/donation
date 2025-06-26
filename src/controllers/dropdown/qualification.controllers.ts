import Qualification from "@/models/dropdown/qualification.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createQualification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { qualificationName, description } = req.body;
        const qualification = new Qualification({ qualificationName, description });
        const saved = await qualification.save();
        res.status(200).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllQualifications = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const qualifications = await Qualification.find();
        res.json(qualifications);
    } catch (err) {
        next(err);
    }
};

// GET ONE
export const getQualificationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const qualification = await Qualification.findById(req.params.id);
        if (!qualification) throw createError(404, "Qualification not found");
        res.json(qualification);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateQualification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { qualificationName, description } = req.body;
        const updated = await Qualification.findByIdAndUpdate(
            req.params.id,
            { qualificationName, description },
            { new: true, runValidators: true }
        );
        if (!updated) throw createError(404, "Qualification not found");
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteQualification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Qualification.findByIdAndDelete(req.params.id);
        if (!deleted) throw createError(404, "Qualification not found");
        res.json({ message: "Qualification deleted successfully" });
    } catch (err) {
        next(err);
    }
};
