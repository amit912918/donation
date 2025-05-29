import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { createNews, deleteNews, getAllNews, getNewsById, updateNews } from "@/controllers/event/news.controller";

const appEventRouterV1 = Router();

// Route for report on job
appEventRouterV1.post('/', verifyAccessToken, createNews);
appEventRouterV1.get('/', verifyAccessToken, getAllNews);
appEventRouterV1.get('/:id', verifyAccessToken, getNewsById);
appEventRouterV1.put('/:id', verifyAccessToken, updateNews);
appEventRouterV1.delete('/:id', verifyAccessToken, deleteNews);

export default appEventRouterV1;
