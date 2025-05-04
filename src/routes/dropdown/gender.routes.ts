import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createGender, deleteGender, getAllGenders, getGenderById, updateGender } from "@/controllers/dropdown/gender.controllers";

const appGenderRouterV1 = Router();

appGenderRouterV1.post("/", verifyAccessToken, createGender);
appGenderRouterV1.get("/", verifyAccessToken, getAllGenders);
appGenderRouterV1.get("/:id", verifyAccessToken, getGenderById);
appGenderRouterV1.put("/:id", verifyAccessToken, updateGender);
appGenderRouterV1.delete("/:id", verifyAccessToken, deleteGender);

export default appGenderRouterV1;