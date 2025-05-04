import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createSibling, deleteSibling, getAllSiblings, getSiblingById, updateSibling } from "@/controllers/dropdown/sibling.conrollers";

const appSiblingRouterV1 = Router();

appSiblingRouterV1.post("/", verifyAccessToken, createSibling);
appSiblingRouterV1.get("/", verifyAccessToken, getAllSiblings);
appSiblingRouterV1.get("/:id", verifyAccessToken, getSiblingById);
appSiblingRouterV1.put("/:id", verifyAccessToken, updateSibling);
appSiblingRouterV1.delete("/:id", verifyAccessToken, deleteSibling);

export default appSiblingRouterV1;