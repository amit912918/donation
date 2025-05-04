import Relation from "@/models/dropdown/relation.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createRelation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { relationName, description } = req.body;
        const relation = new Relation({ relationName, description });
        const saved = await relation.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// GET ALL
export const getAllRelations = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const relations = await Relation.find();
        res.json(relations);
    } catch (err) {
        next(err);
    }
};

// GET ONE
export const getRelationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const relation = await Relation.findById(req.params.id);
        if (!relation) throw createError(404, "Relation not found");
        res.json(relation);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateRelation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { relationName, description } = req.body;
        const updated = await Relation.findByIdAndUpdate(
            req.params.id,
            { relationName, description },
            { new: true, runValidators: true }
        );
        if (!updated) throw createError(404, "Relation not found");
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteRelation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Relation.findByIdAndDelete(req.params.id);
        if (!deleted) throw createError(404, "Relation not found");
        res.json({ message: "Relation deleted successfully" });
    } catch (err) {
        next(err);
    }
};
