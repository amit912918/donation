import { adminCategoryRouterV1 } from "@/routes/admin/product/category.route";
import { adminProductRouterV1 } from "../../../routes/admin/product/product.route";
import appUserAuthRouterV1 from "@/routes/user/auth/auth.route";
import { Router } from "express";

const v1 = Router();

// Admin Endpoint Api's
// v1.use('/product', adminProductRouterV1);
// v1.use('/category', adminCategoryRouterV1);

// User Endpoints Api's
v1.use('/auth', appUserAuthRouterV1);

export { v1 };