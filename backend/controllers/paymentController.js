const Razorpay = require("razorpay");

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

let razorpay;
try {
  if (key_id && key_secret) {
    razorpay = new Razorpay({ key_id, key_secret });
    console.log("✅ Razorpay initialized with key:", key_id);
  } else {
    console.warn("⚠️ Razorpay keys missing from .env — running in mock mode");
  }
} catch (err) {
  console.error("⚠️ Razorpay SDK init error:", err.message);
}

const createOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: "Valid amount is required" });
  }

  const amountInPaise = Math.round(Number(amount) * 100);

  try {
    let order;

    if (razorpay) {
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });
    } else {
      // Fallback mock order if keys are missing
      order = {
        id: `order_mock_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
        isMock: true,
      };
    }

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: key_id || "rzp_test_MOCK",
      isMock: !!order.isMock,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error.message);
    res.status(500).json({ success: false, message: "Payment gateway error: " + error.message });
  }
};

module.exports = { createOrder };
