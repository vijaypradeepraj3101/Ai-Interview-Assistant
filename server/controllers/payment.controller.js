import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

const PLAN_CONFIG = {
  starter: {
    id: "starter",
    name: "Starter Pack",
    amount: 50,
    credits: 200,
  },
  pro: {
    id: "pro",
    name: "Pro Pack",
    amount: 100,
    credits: 500,
  },
};

export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId || !PLAN_CONFIG[planId]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const selectedPlan = PLAN_CONFIG[planId];

    const options = {
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `receipt_${planId}_${Date.now()}`,
      notes: {
        planId: selectedPlan.id,
        credits: String(selectedPlan.credits),
      },
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.userId,
      planId: selectedPlan.id,
      amount: selectedPlan.amount,
      credits: selectedPlan.credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      credits: selectedPlan.credits,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to create Razorpay order: ${error.message}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification data" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      const existingUser = await User.findById(payment.userId);
      return res.status(200).json({
        success: true,
        message: "Already processed",
        user: existingUser,
      });
    }

    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    const updatedUser = await User.findByIdAndUpdate(
      payment.userId,
      { $inc: { credits: payment.credits } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to verify Razorpay payment: ${error.message}`,
    });
  }
};