import Joi from "joi";

// Joi validation schema
export const productSchema = Joi.object({
  productName: Joi.string().required(),
  productSku: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  details: Joi.string().optional().allow(""),
  images: Joi.array().items(Joi.string()).optional(),
  thumbnails: Joi.array().items(Joi.string()).optional(),
  cost: Joi.number().required(),
  minSelectedQuantity: Joi.number().default(0),
  maxSelectedQuantity: Joi.number().default(0),
  availableQuantity: Joi.number().required(),
  totalQuantity: Joi.number().required(),
  inStock: Joi.string().valid("Yes", "No").required(),
  netWeight: Joi.string().optional().allow(""),
  categoryId: Joi.number().required(),
  rewardCoins: Joi.number().default(0),
  status: Joi.string().valid("Active", "Inactive").default("Active"),
  vendor: Joi.string().valid("Ens").required(),
  startDate: Joi.string().optional().allow(""),
  endDate: Joi.string().optional().allow(""),
  variants: Joi.array().items(
    Joi.object({
      variantName: Joi.string().required(),
      colorName: Joi.string().optional().allow(""),
      hexCode: Joi.string().required(),
      imageUrl: Joi.string().required(),
      additionalPrice: Joi.number().default(0),
    })
  ),
  updateBy: Joi.string().optional().allow(""),
});

// Joi validation schema for category
export const categoryValidationSchema = Joi.object({
    categoryName: Joi.string().min(3).max(50).required(),
    status: Joi.string().valid("Active", "Inactive").default("Active"),
});

export const updateProductSchema = Joi.object({
  productId: Joi.number().required(),
  productName: Joi.string().optional(),
  productSku: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  details: Joi.string().optional().allow(""),
  images: Joi.array().items(Joi.string()).optional(),
  thumbnails: Joi.array().items(Joi.string()).optional(),
  cost: Joi.number().optional(),
  minSelectedQuantity: Joi.number().optional(),
  maxSelectedQuantity: Joi.number().optional(),
  availableQuantity: Joi.number().optional(),
  totalQuantity: Joi.number().optional(),
  inStock: Joi.string().valid("Yes", "No").optional(),
  netWeight: Joi.string().optional().allow(""),
  categoryId: Joi.number().optional(),
  rewardCoins: Joi.number().optional(),
  status: Joi.string().valid("Active", "Inactive").optional(),
  vendor: Joi.string().valid("Ens").required(),
  startDate: Joi.string().optional(),
  endDate: Joi.string().optional(),
  updateBy: Joi.string().required(),
  variants: Joi.array().items(
    Joi.object({
      variantName: Joi.string().optional(),
      colorName: Joi.string().optional(),
      hexCode: Joi.string().optional(),
      imageUrl: Joi.string().optional(),
      additionalPrice: Joi.number().optional(),
    })
  ).optional(),
});

export const deleteProductSchema = Joi.object({
  productId: Joi.number().required(),
});
