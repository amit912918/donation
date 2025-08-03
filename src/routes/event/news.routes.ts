import { Router } from "express";
import { verifyAccessToken } from "@/middlewares/jwt/jwt.middleware";
import { commentHandler, createNews, deleteNews, getAllNews, getMentorAnalyticsData, getNewsById, getNewsByUser, getNewsForUser, likeNewsHandler, shareHandler, updateNews } from "@/controllers/event/news.controller";

const appEventRouterV1 = Router();

// Route for report on news
appEventRouterV1.post('/', verifyAccessToken, createNews);
appEventRouterV1.get('/', verifyAccessToken, getAllNews);
appEventRouterV1.get('/get-news-for-user', verifyAccessToken, getNewsForUser);
appEventRouterV1.get('/get-news-by-user', verifyAccessToken, getNewsByUser);
appEventRouterV1.get('/get-mentor-analytics-data', verifyAccessToken, getMentorAnalyticsData);

// Route for interaction on news
appEventRouterV1.post('/news/:id/like', verifyAccessToken, likeNewsHandler);
appEventRouterV1.post('/news/:id/comment', verifyAccessToken, commentHandler);
appEventRouterV1.post('/news/:id/share', verifyAccessToken, shareHandler);
appEventRouterV1.get('/:id', verifyAccessToken, getNewsById);
appEventRouterV1.put('/:id', verifyAccessToken, updateNews);
appEventRouterV1.delete('/:id', verifyAccessToken, deleteNews);

export default appEventRouterV1;
