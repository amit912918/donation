import { Router } from "express";
import { createBusinessType, deleteBusinessType, getAllBusinessTypes, updateBusinessType } from "@/controllers/dropdown/businessType.controller";

const appBusinessTypeRouterV1 = Router();

// Business Type
appBusinessTypeRouterV1.post("/business-types", createBusinessType);
appBusinessTypeRouterV1.get("/business-types", getAllBusinessTypes);
appBusinessTypeRouterV1.put("/business-types/:id", updateBusinessType);
appBusinessTypeRouterV1.delete("/business-types/:id", deleteBusinessType);

export default appBusinessTypeRouterV1;