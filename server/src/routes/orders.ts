import {Router} from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { errorHandler } from '../controller/error-wrapper.ts';
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrdersByStatus, listOrders, listUserOrders } from '../controller/orders.ts';
import adminMiddleware from '../middleware/admin.ts';


const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));

orderRoutes.get('/', [authMiddleware], errorHandler(listOrders));

orderRoutes.put('/:id', [authMiddleware], errorHandler(cancelOrder));

orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))

orderRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(listAllOrdersByStatus))

orderRoutes.put('/:id', [authMiddleware, adminMiddleware], errorHandler(changeStatus));

orderRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders))
export default orderRoutes
