import { Router } from "express";
import { errorHandler } from "../controller/error-wrapper.ts";
import { createProducts, deleteProduct, getProductById, listProducts, updateProduct } from "../controller/products.ts";
import { authMiddleware } from "../middleware/auth.ts";
import adminMiddleware from "../middleware/admin.ts";


const productsRoutes:Router = Router();

productsRoutes.post('/', [authMiddleware , adminMiddleware], errorHandler(createProducts));

productsRoutes.get('/:id', [authMiddleware], errorHandler(getProductById));

productsRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));

productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

productsRoutes.get('/', [authMiddleware], errorHandler(listProducts));

 

export default productsRoutes;
