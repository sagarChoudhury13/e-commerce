import { Router } from "express";
import { errorHandler } from "../controller/error-wrapper.ts";
import { createProduct, deleteProduct, getProductById, listProducts, searchItem, updateProduct } from "../controller/products.ts";
import { authMiddleware } from "../middleware/auth.ts";
import adminMiddleware from "../middleware/admin.ts";
import {upload} from "../middleware/upload.ts"


const productsRoutes:Router = Router();

productsRoutes.post('/', [authMiddleware , adminMiddleware], upload.single("image"), errorHandler(createProduct));

productsRoutes.put('/:id', [authMiddleware, adminMiddleware],upload.single("image"), errorHandler(updateProduct));

productsRoutes.delete('/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct));

productsRoutes.get('/', errorHandler(listProducts));

productsRoutes.get('/search',[authMiddleware], errorHandler(searchItem))

productsRoutes.get('/:id',[authMiddleware, adminMiddleware], errorHandler(getProductById))

 

export default productsRoutes;
