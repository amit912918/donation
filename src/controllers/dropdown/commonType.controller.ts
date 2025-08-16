import { RequestType } from "@/helpers/shared/shared.type";
import CommonType from "@/models/dropdown/common.models";
import Marital from "@/models/dropdown/marital.models";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

// CREATE
export const createCommonType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, category } = req.body;
    const common_type = new CommonType({ name, description, category });
    const saved = await common_type.save();
    res.status(200).send({
      success: true,
      error: false,
      message: "Common Type create successfully",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getAllCommonType = async (
  _req: RequestType,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = _req.query;
    const common_type = await CommonType.find( {category: category });
    res.status(200).send({
      success: true,
      error: false,
      message: "Common Type get successfully",
      data: common_type
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE
export const getCommonTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const common_type = await CommonType.findById(req.params.id);
    if (!common_type) throw createError(404, "Common Type status not found");
    res.status(200).send({
      success: true,
      error: false,
      message: "Common Type get successfully",
      data: common_type,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateCommonType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { maritalName, description } = req.body;
    const updated = await CommonType.findByIdAndUpdate(
      req.params.id,
      { maritalName, description },
      { new: true, runValidators: true }
    );
    if (!updated) throw createError(404, "Common Type status not found");
    res.status(200).send({
      success: true,
      error: false,
      message: "Common Type updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteCommonType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await CommonType.findByIdAndDelete(req.params.id);
    if (!deleted) throw createError(404, "Common Type status not found");
    res.status(200).send({
      success: true,
      error: false,
      message: "Common Type status deleted successfully",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};
