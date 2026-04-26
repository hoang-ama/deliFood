import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
    listOrders,
    placeOrder,
    updateStatus,
    userOrders,
    verifyOrder,
    placeOrderCod
} from '../src/modules/order/order.controller.js';
import { authorizeRoles, tenantMiddleware } from '../src/modules/order/order.middleware.js';

const orderRouter = express.Router();

orderRouter.use(tenantMiddleware);

orderRouter.get("/list", authMiddleware, authorizeRoles(["owner", "staff"]), listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", authMiddleware, authorizeRoles(["owner", "staff"]), updateStatus);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/placecod", authMiddleware, placeOrderCod);

export default orderRouter;