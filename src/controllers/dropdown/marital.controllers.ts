import Marital from "@/models/dropdown/marital.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createMarital = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { maritalName, description } = req.body;
        const marital = new Marital({ maritalName, description });
        const saved = await marital.save();
        res.status(200).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllMaritals = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const maritals = await Marital.find();
        res.json(maritals);
    } catch (err) {
        next(err);
    }
};

// GET ONE
export const getMaritalById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const marital = await Marital.findById(req.params.id);
        if (!marital) throw createError(404, "Marital status not found");
        res.json(marital);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateMarital = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { maritalName, description } = req.body;
        const updated = await Marital.findByIdAndUpdate(
            req.params.id,
            { maritalName, description },
            { new: true, runValidators: true }
        );
        if (!updated) throw createError(404, "Marital status not found");
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteMarital = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Marital.findByIdAndDelete(req.params.id);
        if (!deleted) throw createError(404, "Marital status not found");
        res.json({ message: "Marital status deleted successfully" });
    } catch (err) {
        next(err);
    }
};
