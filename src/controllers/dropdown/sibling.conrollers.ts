import Sibling from "@/models/dropdown/sibling.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createSibling = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { siblingName, description, occupation } = req.body;
        const sibling = new Sibling({ siblingName, description, occupation });
        const saved = await sibling.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllSiblings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const siblings = await Sibling.find();
        res.json(siblings);
    } catch (err) {
        next(err);
    }
};

// GET ONE
export const getSiblingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sibling = await Sibling.findById(req.params.id);
        if (!sibling) throw createError(404, "Sibling not found");
        res.json(sibling);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateSibling = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { siblingName, description, occupation } = req.body;
        const updated = await Sibling.findByIdAndUpdate(
            req.params.id,
            { siblingName, description, occupation },
            { new: true, runValidators: true }
        );
        if (!updated) throw createError(404, "Sibling not found");
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteSibling = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Sibling.findByIdAndDelete(req.params.id);
        if (!deleted) throw createError(404, "Sibling not found");
        res.json({ message: "Sibling deleted successfully" });
    } catch (err) {
        next(err);
    }
};
