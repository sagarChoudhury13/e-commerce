import { Router } from "express";
import { signUp, login, me } from "../controller/auth.ts";
import { errorHandler } from "../controller/error-wrapper.ts";
import { authMiddleware } from "../middleware/auth.ts";

const authRoutes: Router = Router();

authRoutes.post('/signup', errorHandler(signUp));
authRoutes.post('/login', errorHandler(login));
authRoutes.get('/me', [authMiddleware], errorHandler(me))

export default authRoutes;