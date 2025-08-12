import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createPosition, deletePosition, getPositionsBySector, updatePosition } from "@/controllers/dropdown/position.controller";

const appPositionRouterV1 = Router();

// Position
appPositionRouterV1.post("/positions", createPosition);
appPositionRouterV1.get("/positions", getPositionsBySector);
appPositionRouterV1.put("/positions/:id", updatePosition);
appPositionRouterV1.delete("/positions/:id", deletePosition);

export default appPositionRouterV1;