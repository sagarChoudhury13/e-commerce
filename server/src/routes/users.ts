import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { errorHandler } from "../controller/error-wrapper.ts";
import { changeUserRole, createAddress, deleteAddress, getUserById, listAddress, listUsers, updateDefaultAddress } from "../controller/users.ts";
import adminMiddleware from "../middleware/admin.ts";

const userRoutes: Router = Router();

// --- ADDRESS MANAGEMENT ---
// Note: If this router is mounted at app.use('/api/user', userRoutes), 
// these become /api/user/address

userRoutes.post('/address', [authMiddleware], errorHandler(createAddress));
userRoutes.get('/address', [authMiddleware], errorHandler(listAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));

// --- USER MANAGEMENT ---
// Updates default shipping/billing
userRoutes.put('/', [authMiddleware], errorHandler(updateDefaultAddress)); 

// --- ADMIN ROUTES ---
// Use distinct paths so they don't collide with the routes above
userRoutes.get('/all', [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserById));
userRoutes.put('/role/:id', [authMiddleware, adminMiddleware], errorHandler(changeUserRole));

export default userRoutes;