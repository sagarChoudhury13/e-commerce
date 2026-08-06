import {Router} from "express";
import {signUp, login} from "../controller/auth.ts";
const authRoutes: Router = Router();
import { errorHandler } from "../controller/error-wrapper.ts";

authRoutes.post('/signup',errorHandler(signUp));

authRoutes.post('/login', errorHandler(login));

export default authRoutes;