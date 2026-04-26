import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    restaurantId: { type: String, default: "" },
    tenantId: { type: String, required: true, index: true },
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false }
});

orderSchema.pre("validate", function syncAmountAndTotal(next) {
    if (typeof this.total !== "number" && typeof this.amount === "number") {
        this.total = this.amount;
    }

    if (typeof this.amount !== "number" && typeof this.total === "number") {
        this.amount = this.total;
    }

    next();
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
