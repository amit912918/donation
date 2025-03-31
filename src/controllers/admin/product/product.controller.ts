import { NextFunction, Request, Response } from "express";
import httpErrors from 'http-errors'
import { Product } from "../../../models/product/product.model";
import { Variant } from "../../../models/product/variant.model";
import sequelize from "../../../helpers/common/init_mysql";
import { categoryValidationSchema, deleteProductSchema, productSchema, updateProductSchema } from "@/helpers/joi/product/product.joi";
import { ProductValidatedData, UpdateProductData } from "@/helpers/interface/product/product.interface";
import { Category } from "@/models/product/category.models";
import { QueryTypes } from "sequelize";

export const uploadProductImage = async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
  try {
    if (!req.file) {
      throw httpErrors.Forbidden("No file uploaded.");
    }

    // File uploaded successfully
    res.status(200).json({
      message: "File uploaded successfully.",
      file: req.file,
    });
  } catch (error) {
      console.log("Add Ds Product Images Error ::>>",error);
      next(error);
  }
};

export const uploadThumbnailImage = async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
  try {
    if (!req.files || !Array.isArray(req.files)) {
      throw httpErrors.Forbidden("No files uploaded.");
    }

    // Files uploaded successfully
    const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
    }));

    res.status(200).json({
      message: "Files uploaded successfully.",
      files: uploadedFiles,
    });
  } catch (error) {
      console.log("Add Ds Product Images Error ::>>",error);
      next(error);
  }
};

// Add Product Function
export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { error, value }: any = productSchema.validate(req.body, { abortEarly: false });

  if (error) {
    throw httpErrors.BadRequest(error.details[0].message);
  }

  const {
    productName,
    productSku,
    description = "",
    details= "",
    images = ["default.png"],
    thumbnails = [],
    cost,
    minSelectedQuantity = 0,
    maxSelectedQuantity = 0,
    availableQuantity,
    totalQuantity,
    inStock = "Yes",
    netWeight = "",
    categoryId,
    rewardCoins = 0,
    status = "Active",
    vendor,
    startDate = "14/01/2025",
    endDate = "26/01/2025",
    variants,
    updateBy = "abc"
  }: ProductValidatedData = value;
  
    // Create the product
    const product = await Product.create(
      {
        productName,
        productSku,
        description,
        details,
        images,
        thumbnails,
        cost,
        minSelectedQuantity,
        maxSelectedQuantity,
        availableQuantity,
        totalQuantity,
        inStock,
        netWeight,
        categoryId,
        rewardCoins,
        status,
        vendor,
        startDate,
        endDate,
        updateBy,
      },
      { transaction: t }
    );

    let allVariant;
    // Process variants, colors, and inventory if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        allVariant = await Variant.create(
          { 
            productId: product.pId,
            variantName: variant.variantName, 
            colorName: variant.colorName, 
            hexCode: variant.hexCode, 
            imageUrl: variant.imageUrl, 
            additionalPrice: variant.additionalPrice
           },
          { transaction: t }
        );

      }
    }

    await t.commit();

    res.status(201).json({
      message: "Product created successfully",
      product: product,
      allVariant: allVariant
    });
  } catch (error: any) {
    await t.rollback();
    console.error("Error adding product:", error);
    next(error)
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        p.* 
      FROM 
        products p
      WHERE 
        p.productName LIKE :search 
      LIMIT :limit OFFSET :offset;
    `;

    // Execute raw query with replacements
    const allProducts = await sequelize.query(query, {
      replacements: { search: searchCondition, limit: pageSize, offset },
      type: QueryTypes.SELECT,
    });

    // Count total products for pagination metadata
    const countQuery = `
      SELECT 
        COUNT(*) as total 
      FROM 
        products p
      WHERE 
        p.productName LIKE :search;
    `;

    const [countResult]: any = await sequelize.query(countQuery, {
      replacements: { search: searchCondition },
      type: QueryTypes.SELECT,
    });

    const totalProducts = countResult?.total || 0;

    // Send response
    res.status(200).json({
      message: "Products retrieved successfully",
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageSize),
      },
      data: allProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { error, value }: any = updateProductSchema.validate(req.body, { abortEarly: false });

    if (error) {
      throw httpErrors.BadRequest(error.details[0].message);
    }

    const {
      productId,
      productName,
      productSku,
      description,
      details,
      images,
      thumbnails,
      cost,
      minSelectedQuantity,
      maxSelectedQuantity,
      availableQuantity,
      totalQuantity,
      inStock,
      netWeight,
      categoryId,
      rewardCoins,
      status,
      vendor,
      startDate,
      endDate,
      updateBy,
      variants,
    }: UpdateProductData = value;

    // Update product
    const updatedProduct = await Product.update(
      {
        productName,
        productSku,
        description,
        details,
        images,
        thumbnails,
        cost,
        minSelectedQuantity,
        maxSelectedQuantity,
        availableQuantity,
        totalQuantity,
        inStock,
        netWeight,
        categoryId,
        rewardCoins,
        status,
        vendor,
        startDate,
        endDate,
        updateBy,
      },
      {
        where: { pId: productId },
        transaction: t,
      }
    );

    // Update variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await Variant.update(
          {
            variantName: variant.variantName,
            colorName: variant.colorName,
            hexCode: variant.hexCode,
            imageUrl: variant.imageUrl,
            additionalPrice: variant.additionalPrice,
          },
          {
            where: { productId },
            transaction: t,
          }
        );
      }
    }

    await t.commit();

    res.status(200).json({ message: "Product updated successfully.", updatedProduct });
  } catch (error: any) {
    await t.rollback();
    console.error("Error updating product:", error);
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { error, value }: any = deleteProductSchema.validate(req.body);

    if (error) {
      throw httpErrors.BadRequest(error.details[0].message);
    }

    const { productId } = value;

    // Delete variants associated with the product
    await Variant.destroy({
      where: { productId },
      transaction: t,
    });

    // Delete the product
    await Product.destroy({
      where: { pId: productId },
      transaction: t,
    });

    await t.commit();

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error: any) {
    await t.rollback();
    console.error("Error deleting product:", error);
    next(error);
  }
};
