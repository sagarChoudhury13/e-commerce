import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { errorHandler } from "../controller/error-wrapper.ts";
import { changeUserRole, createAddress, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controller/users.ts";
import adminMiddleware from "../middleware/admin.ts";

const userRoutes: Router = Router();

userRoutes.post('/', [authMiddleware], errorHandler(createAddress));

userRoutes.delete('/', [authMiddleware], errorHandler(deleteAddress));

userRoutes.get('/', [authMiddleware], errorHandler(listAddress));

userRoutes.put('/', [authMiddleware], errorHandler(updateUser))

userRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers))

userRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById))

userRoutes.put('/', [authMiddleware, adminMiddleware], errorHandler(changeUserRole))


export default userRoutes;