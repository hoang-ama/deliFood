import {
    buildStripeSession,
    createOrder,
    listOrdersByTenant,
    listUserOrdersByTenant,
    updateOrderStatusByTenant,
    verifyOrderByTenant
} from "./order.service.js";

const placeOrder = async (req, res) => {
    try {
        const newOrder = await createOrder({
            userId: req.body.userId,
            tenantId: req.tenantId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            restaurantId: req.body.restaurantId,
            payment: false
        });

        const session = await buildStripeSession({
            items: req.body.items,
            orderId: newOrder._id
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const placeOrderCod = async (req, res) => {
    try {
        await createOrder({
            userId: req.body.userId,
            tenantId: req.tenantId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            restaurantId: req.body.restaurantId,
            payment: true
        });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await listOrdersByTenant(req.tenantId);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await listUserOrdersByTenant({
            tenantId: req.tenantId,
            userId: req.body.userId
        });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const order = await updateOrderStatusByTenant({
            tenantId: req.tenantId,
            orderId: req.body.orderId,
            status: req.body.status
        });

        if (!order) {
            return res.json({ success: false, message: "Order not found for tenant" });
        }

        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        const order = await verifyOrderByTenant({ tenantId: req.tenantId, orderId, success });
        if (!order) {
            return res.json({ success: false, message: "Order not found for tenant" });
        }

        if (success === "true") {
            return res.json({ success: true, message: "Paid" });
        }

        res.json({ success: false, message: "Not Paid" });
    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
