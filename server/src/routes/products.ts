import { Router } from "express";
import { errorHandler } from "../controller/error-wrapper.ts";
import { createProducts, deleteProduct, getProductById, listProducts, searchItem, updateProduct } from "../controller/products.ts";
import { authMiddleware } from "../middleware/auth.ts";
import adminMiddleware from "../middleware/admin.ts";


const productsRoutes:Router = Router();

productsRoutes.post('/', [authMiddleware , adminMiddleware], errorHandler(createProducts));

productsRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct));

productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

productsRoutes.get('/', [authMiddleware], errorHandler(listProducts));

productsRoutes.get('/search',[authMiddleware], errorHandler(searchItem))

productsRoutes.get('/:id',[authMiddleware, adminMiddleware], errorHandler(getProductById))

 

export default productsRoutes;
