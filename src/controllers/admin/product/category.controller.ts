import { NextFunction, Request, Response } from "express";
import httpErrors from 'http-errors'
import sequelize from "../../../helpers/common/init_mysql";
import { categoryValidationSchema, productSchema } from "@/helpers/joi/product/product.joi";
import { Category } from "@/models/product/category.models";
import { QueryTypes } from "sequelize";

// Add Product Function
export const addCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate the input data using Joi
    const { error, value } = categoryValidationSchema.validate(req.body);

    if (error) {
      throw httpErrors.Forbidden(error.details[0].message);
    }

    const { categoryName, status } = value;

    // Check if the category name already exists
    const existingCategory = await Category.findOne({ where: { categoryName } });
    if (existingCategory) {
      throw httpErrors.Conflict("Category name already exists.");
    }

    // Create a new category
    const newCategory = await Category.create({
      categoryName,
      parentId: "1",
      status
    });

    res.status(201).json({ message: "Category created successfully.", data: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    next(error)
  }
};

export const getAllCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract query parameters
    const { search = "", page = 1, limit = 10 } = req.body;

    // Calculate offset for pagination
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const offset = (pageNumber - 1) * pageSize;

    // Define the search condition and raw query
    const searchCondition = `%${search}%`;

    const query = `
      SELECT 
        c.* 
      FROM 
        category c
      WHERE 
        c.categoryName LIKE :search 
      LIMIT :limit OFFSET :offset;
    `;

    // Execute raw query with replacements
    const categories = await sequelize.query(query, {
      replacements: { search: searchCondition, limit: pageSize, offset },
      type: QueryTypes.SELECT,
    });

    // Count total products for pagination metadata
    const countQuery = `
      SELECT 
        COUNT(*) as total 
      FROM 
        category c
      WHERE 
        c.categoryName LIKE :search;
    `;

    const [countResult]: any = await sequelize.query(countQuery, {
      replacements: { search: searchCondition },
      type: QueryTypes.SELECT,
    });

    const totalCategories = countResult?.total || 0;

    // Send response
    res.status(200).json({
      message: "Category retrieved successfully",
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalCategories,
        totalPages: Math.ceil(totalCategories / pageSize),
      },
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error);
  }
};
export const getCategoryDrowDown = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = `
      SELECT 
        c.id,
        c.categoryName 
      FROM 
        category c;
    `;

    // Execute raw query with replacements
    const categories = await sequelize.query(query, {
      replacements: { },
      type: QueryTypes.SELECT,
    });

    // Send response
    res.status(200).json({
      message: "Category retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error);
  }
};