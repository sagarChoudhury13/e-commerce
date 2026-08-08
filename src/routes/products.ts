import { Router } from "express";
import { errorHandler } from "../controller/error-wrapper.ts";
import { createProducts } from "../controller/products.ts";
import { authMiddleware } from "../middleware/auth.ts";
import adminMiddleware from "../middleware/admin.ts";


const productsRoutes:Router = Router();

productsRoutes.post('/', [authMiddleware],[adminMiddleware], errorHandler(createProducts));

export default productsRoutes;
