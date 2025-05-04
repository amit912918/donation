import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createGotra, deleteGotra, getAllGotras, getGotraById, updateGotra } from "@/controllers/dropdown/gotra.controllers";

const appGotraRouterV1 = Router();

appGotraRouterV1.post("/", verifyAccessToken, createGotra);
appGotraRouterV1.get("/", verifyAccessToken, getAllGotras);
appGotraRouterV1.get("/:id", verifyAccessToken, getGotraById);
appGotraRouterV1.put("/:id", verifyAccessToken, updateGotra);
appGotraRouterV1.delete("/:id", verifyAccessToken, deleteGotra);

export default appGotraRouterV1;