import { Login, registerUser, sendOtp, verifyOtp } from "@/controllers/user/auth/auth.controller";
import { Router } from "express";

const appUserAuthRouterV1 = Router();

appUserAuthRouterV1.post('/login', Login);
appUserAuthRouterV1.post('/register-user', registerUser);
appUserAuthRouterV1.post('/send-otp', sendOtp);
appUserAuthRouterV1.post('/verify-otp', verifyOtp);

export default appUserAuthRouterV1;