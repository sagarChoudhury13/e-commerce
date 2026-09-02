import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { errorHandler } from "../controller/error-wrapper.ts";
import { addItemToCart, changeQuantity, deleteCart, getCart } from "../controller/cart.ts";

const cartRoutes: Router = Router();


cartRoutes.post('/', [authMiddleware], errorHandler(addItemToCart));

cartRoutes.delete('/:id',[authMiddleware], errorHandler(deleteCart));

cartRoutes.put('/:id', [authMiddleware], errorHandler(changeQuantity));

cartRoutes.get('/', [authMiddleware], errorHandler(getCart));

export default cartRoutes;