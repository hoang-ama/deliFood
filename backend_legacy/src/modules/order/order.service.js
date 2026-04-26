import Stripe from "stripe";
import orderModel from "./order.model.js";
import userModel from "../../../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";
const deliveryCharge = 50;
const frontendUrl = process.env.FRONTEND_URL;

const createOrder = async ({ userId, tenantId, items, amount, address, restaurantId, payment }) => {
    const newOrder = new orderModel({
        userId,
        tenantId,
        restaurantId: restaurantId || "",
        items,
        amount,
        total: amount,
        address,
        payment: Boolean(payment)
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return newOrder;
};

const buildStripeSession = async ({ items, orderId }) => {
    const lineItems = items.map((item) => ({
        price_data: {
            currency,
            product_data: {
                name: item.name
            },
            unit_amount: item.price * 100
        },
        quantity: item.quantity
    }));

    lineItems.push({
        price_data: {
            currency,
            product_data: {
                name: "Delivery Charge"
            },
            unit_amount: deliveryCharge * 100
        },
        quantity: 1
    });

    return stripe.checkout.sessions.create({
        success_url: `${frontendUrl}/verify?success=true&orderId=${orderId}`,
        cancel_url: `${frontendUrl}/verify?success=false&orderId=${orderId}`,
        line_items: lineItems,
        mode: "payment"
    });
};

const listOrdersByTenant = async (tenantId) => orderModel.find({ tenantId });

const listUserOrdersByTenant = async ({ tenantId, userId }) =>
    orderModel.find({ tenantId, userId });

const updateOrderStatusByTenant = async ({ tenantId, orderId, status }) =>
    orderModel.findOneAndUpdate({ _id: orderId, tenantId }, { status }, { new: true });

const verifyOrderByTenant = async ({ tenantId, orderId, success }) => {
    if (success === "true") {
        return orderModel.findOneAndUpdate(
            { _id: orderId, tenantId },
            { payment: true },
            { new: true }
        );
    }

    return orderModel.findOneAndDelete({ _id: orderId, tenantId });
};

export {
    createOrder,
    buildStripeSession,
    listOrdersByTenant,
    listUserOrdersByTenant,
    updateOrderStatusByTenant,
    verifyOrderByTenant
};
