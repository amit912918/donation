import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createMarital, deleteMarital, getAllMaritals, getMaritalById, updateMarital } from "@/controllers/dropdown/marital.controllers";
import { createQualification, deleteQualification, getAllQualifications, getQualificationById, updateQualification } from "@/controllers/dropdown/qualification.controllers";

const appQualificaionRouterV1 = Router();

appQualificaionRouterV1.post("/", createQualification);
appQualificaionRouterV1.get("/", getAllQualifications);
appQualificaionRouterV1.get("/:id", getQualificationById);
appQualificaionRouterV1.put("/:id", updateQualification);
appQualificaionRouterV1.delete("/:id", deleteQualification);

export default appQualificaionRouterV1;