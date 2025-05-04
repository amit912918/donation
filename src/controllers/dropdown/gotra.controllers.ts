import Gotra from "@/models/dropdown/gotra.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createGotra = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gotraName, description } = req.body;
        const gotra = new Gotra({ gotraName, description });
        const saved = await gotra.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllGotras = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const gotras = await Gotra.find();
        res.json(gotras);
    } catch (err) {
        next(err);
    }
};

// GET ONE
export const getGotraById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gotra = await Gotra.findById(req.params.id);
        if (!gotra) throw createError(404, "Gotra not found");
        res.json(gotra);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateGotra = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { gotraName, description } = req.body;
        const updated = await Gotra.findByIdAndUpdate(
            req.params.id,
            { gotraName, description },
            { new: true, runValidators: true }
        );
        if (!updated) throw createError(404, "Gotra not found");
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteGotra = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Gotra.findByIdAndDelete(req.params.id);
        if (!deleted) throw createError(404, "Gotra not found");
        res.json({ message: "Gotra deleted successfully" });
    } catch (err) {
        next(err);
    }
};
