import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createMarital, deleteMarital, getAllMaritals, getMaritalById, updateMarital } from "@/controllers/dropdown/marital.controllers";

const appMaritalRouterV1 = Router();

appMaritalRouterV1.post("/", verifyAccessToken, createMarital);
appMaritalRouterV1.get("/", verifyAccessToken, getAllMaritals);
appMaritalRouterV1.get("/:id", verifyAccessToken, getMaritalById);
appMaritalRouterV1.put("/:id", verifyAccessToken, updateMarital);
appMaritalRouterV1.delete("/:id", verifyAccessToken, deleteMarital);

export default appMaritalRouterV1;