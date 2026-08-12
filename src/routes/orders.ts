import {Router} from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { errorHandler } from '../controller/error-wrapper.ts';
import { cancelOrder, createOrder, getOrderById, listAllOrders } from '../controller/orders.ts';


const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));

orderRoutes.get('/', [authMiddleware], errorHandler(listAllOrders));

orderRoutes.put('/:id', [authMiddleware], errorHandler(cancelOrder));

orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))

export default orderRoutes
