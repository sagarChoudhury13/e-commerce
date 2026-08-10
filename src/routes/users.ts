import type { Request, Response } from "express";

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { errorHandler } from "../controller/error-wrapper.ts";
import { createAddress, deleteAddress, listAddress, updateUser } from "../controller/users.ts";

export const userRoutes: Router = Router();

userRoutes.post('/', [authMiddleware], errorHandler(createAddress));

userRoutes.delete('/', [authMiddleware], errorHandler(deleteAddress));

userRoutes.get('/', [authMiddleware], errorHandler(listAddress));

userRoutes.put('/', [authMiddleware], errorHandler(updateUser))


