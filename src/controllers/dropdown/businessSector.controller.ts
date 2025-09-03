import { NextFunction, Response } from "express";
import { RequestType } from "@/helpers/shared/shared.type";
import { createError } from "@/helpers/common/backend.functions";
import { BusinessSector } from "@/models/dropdown/business.models";

// 📌 Create Business Sector
export const createBusinessSector = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { name, category, businessTypeId } = req.body;
        if (!name || !category || !businessTypeId) throw createError(400, "Name, Category and BusinessTypeId are required");

        const sector = new BusinessSector({ name, category, businessTypeId });
        await sector.save();

        res.status(201).json({ message: "Business Sector created successfully", data: sector });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Get Sectors by Business Type
export const getSectorsByType = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { category } = req.query;
        const sectors = await BusinessSector.find({ category: category }).sort({ name: 1 });
        res.status(200).send({
            error: false,
            success: true,
            sectors
        });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Update Business Sector
export const updateBusinessSector = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const sector = await BusinessSector.findByIdAndUpdate(id, { name }, { new: true });
        if (!sector) throw createError(404, "Business Sector not found");

        res.status(200).json({ message: "Updated successfully", data: sector });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};

// 📌 Delete Business Sector
export const deleteBusinessSector = async (req: RequestType, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deleted = await BusinessSector.findByIdAndDelete(id);
        if (!deleted) throw createError(404, "Business Sector not found");

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error: any) {
        next(createError(error.status || 500, error.message || "Internal Server Error"));
    }
};
