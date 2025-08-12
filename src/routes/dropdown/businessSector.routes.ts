import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createBusinessSector, deleteBusinessSector, getSectorsByType, updateBusinessSector } from "@/controllers/dropdown/businessSector.controller";

const appBusinessSectorRouterV1 = Router();

// Business Sector
appBusinessSectorRouterV1.post("/business-sectors", createBusinessSector)
appBusinessSectorRouterV1.get("/business-sectors", getSectorsByType);
appBusinessSectorRouterV1.put("/business-sectors/:id", updateBusinessSector);
appBusinessSectorRouterV1.delete("/business-sectors/:id", deleteBusinessSector);

export default appBusinessSectorRouterV1;