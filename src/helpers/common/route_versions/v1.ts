import { adminCategoryRouterV1 } from "@/routes/admin/product/category.route";
import { adminProductRouterV1 } from "../../../routes/admin/product/product.route";
import appUserAuthRouterV1 from "@/routes/user/auth/auth.route";
import { Router } from "express";
import appHomeRouterV1 from "@/routes/home/home.routes";
import appMissionRouterV1 from "@/routes/mission/mission.routes";

const v1 = Router();

// Admin Endpoint Api's
// v1.use('/product', adminProductRouterV1);
// v1.use('/category', adminCategoryRouterV1);

// User Endpoints Api's
v1.use('/auth', appUserAuthRouterV1);
v1.use('/home', appHomeRouterV1);
v1.use('/mission', appMissionRouterV1);

export { v1 };