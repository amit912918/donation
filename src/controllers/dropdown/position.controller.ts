import { NextFunction, Response } from "express";
import { RequestType } from "@/helpers/shared/shared.type";
import { createError } from "@/helpers/common/backend.functions";
import { Position } from "@/models/dropdown/business.models";

// 📌 Create Position
export const createPosition = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) throw createError(400, "Name and Category are required");

        const position = new Position({ name, category });
        await position.save();

        res.status(201).json({ message: "Position created successfully", data: position });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get Positions by Sector
export const getPositionsBySector = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { category } = req.query;
        const positions = await Position.find({ category: category }).sort({ name: 1 });
        res.status(200).json(positions);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Update Position
export const updatePosition = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const position = await Position.findByIdAndUpdate(id, { name }, { new: true });
        if (!position) throw createError(404, "Position not found");

        res.status(200).json({ message: "Updated successfully", data: position });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Delete Position
export const deletePosition = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleted = await Position.findByIdAndDelete(id);
        if (!deleted) throw createError(404, "Position not found");

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};
