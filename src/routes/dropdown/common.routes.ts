import { Router } from "express";
import { createCommonType, deleteCommonType, getAllCommonType, getCommonTypeById, updateCommonType } from "@/controllers/dropdown/commonType.controller";

const appCommonTypeRouterV1 = Router();

appCommonTypeRouterV1.post("/", createCommonType);
appCommonTypeRouterV1.get("/", getAllCommonType);
appCommonTypeRouterV1.get("/:id", getCommonTypeById);
appCommonTypeRouterV1.put("/:id", updateCommonType);
appCommonTypeRouterV1.delete("/:id", deleteCommonType);

export default appCommonTypeRouterV1;