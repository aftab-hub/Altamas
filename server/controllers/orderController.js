import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import User from "../models/User.js";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
    try {
        const { userId, items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Place Order Razorpay : /api/order/razorpay
export const placeOrderRazorpay = async (req, res)=>{
    try {
        const { userId, items, address } = req.body;
        const {origin} = req.headers;

        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }

        let productData = [];
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02);

        const order =  await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // Razorpay Gateway Initialize    
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Create Razorpay Order (REQUIRED)
        const razorOrder = await razorpayInstance.orders.create({
            amount: amount * 100, // paise
            currency: "INR",
            receipt: order._id.toString(),
            notes: {
                orderId: order._id.toString(),
                userId,
            }
        });

        return res.json({
            success: true,
            razorpayOrder: razorOrder,
            key: process.env.RAZORPAY_KEY_ID,
            amount,
            orderId: order._id
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Razorpay Webhooks to Verify Payments Action : /razorpay
export const razorpayWebhooks = async (request, response)=>{
    const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const sig = request.headers["x-razorpay-signature"];

    let isValid;

    try {
        isValid = razorpayInstance.webhooks.verify(
            request.body,
            sig,
            process.env.WEBHOOK_SECRET
        );
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (!isValid) {
        return response.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = request.body.event;

    switch (event) {
        case "payment.captured": {
            const orderId = request.body.payload.payment.entity.notes.orderId;
            const userId = request.body.payload.payment.entity.notes.userId;

            await Order.findByIdAndUpdate(orderId, { isPaid: true });
            await User.findByIdAndUpdate(userId, { cartItems: {} });

            break;
        }

        case "payment.failed": {
            const orderId = request.body.payload.payment.entity.notes.orderId;
            await Order.findByIdAndDelete(orderId);
            break;
        }

        default:
            console.log("Unhandled event", event);
    }

    response.json({ received: true });
}

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res)=>{
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
