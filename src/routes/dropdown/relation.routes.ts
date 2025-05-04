import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createRelation, deleteRelation, getAllRelations, getRelationById, updateRelation } from "@/controllers/dropdown/relation.conrollers";

const appRelationRouterV1 = Router();

appRelationRouterV1.post("/", verifyAccessToken, createRelation);
appRelationRouterV1.get("/", verifyAccessToken, getAllRelations);
appRelationRouterV1.get("/:id", verifyAccessToken, getRelationById);
appRelationRouterV1.put("/:id", verifyAccessToken, updateRelation);
appRelationRouterV1.delete("/:id", verifyAccessToken, deleteRelation);

export default appRelationRouterV1;