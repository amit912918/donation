import * as categoryController from "../../../controllers/admin/product/category.controller";
import { Router } from "express";

export const adminCategoryRouterV1 = Router();
adminCategoryRouterV1.post('/add-category', categoryController.addCategory)
adminCategoryRouterV1.post('/get-all-category', categoryController.getAllCategory)
adminCategoryRouterV1.post('/get-category-dropdown', categoryController.getCategoryDrowDown)

// export = { adminProductRouterV1 }