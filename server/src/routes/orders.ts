import {Router} from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import { errorHandler } from '../controller/error-wrapper.ts';
import { cancelOrder, changeStatus, createOrder, getOrderById, listAllOrdersByStatus, listUserOrders, listOrders } from '../controller/orders.ts';
import adminMiddleware from '../middleware/admin.ts';


const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));

// List logged-in user's orders
orderRoutes.get('/', [authMiddleware], errorHandler(listOrders));

// Get details of a specific order
orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById));

// Cancel an order (Distinct path)
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));


// Change order status (Distinct path)
orderRoutes.put('/status/:id', [authMiddleware, adminMiddleware], errorHandler(changeStatus));

// List all orders by status (e.g., /admin/status/DELIVERED)
orderRoutes.get('/admin/status/:status', [authMiddleware, adminMiddleware], errorHandler(listAllOrdersByStatus));

// List all orders for a specific user (e.g., /admin/user/5)
orderRoutes.get('/admin/user/:userId', [authMiddleware, adminMiddleware], errorHandler(listUserOrders));
export default orderRoutes
