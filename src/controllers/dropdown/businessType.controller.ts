import { NextFunction, Response } from "express";
import { RequestType } from "@/helpers/shared/shared.type";
import { createError } from "@/helpers/common/backend.functions";
import { BusinessType } from "../../models/dropdown/business.models"

// 📌 Create Business Type
export const createBusinessType = async (req: RequestType, res: Response, next: NextFunction) => {
    try { 
        const { name, category } = req.body;
        if (!name || !category) throw createError(400, "Business Type name and category is required");

        const exists = await BusinessType.findOne({ name, category });
        if (exists) throw createError(409, "Business Type already exists");

        const type = new BusinessType({ name, category });
        await type.save();

        res.status(201).json({ message: "Business Type created successfully", data: type });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get all Business Types
export const getAllBusinessTypes = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { category } = req.query;
        const types = await BusinessType.find({ category }).sort({ name: 1 });
        res.status(200).json(types);
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Update Business Type
export const updateBusinessType = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const type = await BusinessType.findByIdAndUpdate(id, { name }, { new: true });
        if (!type) throw createError(404, "Business Type not found");

        res.status(200).json({ message: "Updated successfully", data: type });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Delete Business Type
export const deleteBusinessType = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleted = await BusinessType.findByIdAndDelete(id);
        if (!deleted) throw createError(404, "Business Type not found");

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};
