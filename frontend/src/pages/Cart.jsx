import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useItems } from "../context/ItemContext";

const Cart = () => {
  const { cart, cartCount, totalPrice, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useItems();
  const [loading, setLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const tax = totalPrice * 0.05;
  const delivery = totalPrice > 500 ? 0 : 49;
  const grandTotal = totalPrice + tax + delivery;

  // Function to dynamically load the Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/payments/order", { amount: grandTotal });

      if (!res.data || !res.data.success) {
        throw new Error("Failed to create checkout order");
      }

      const { orderId, amount, currency, key_id, isMock } = res.data;

     
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "Freshora Mart",
        description: "Premium Organic Produce Order",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop",
        order_id: isMock ? undefined : orderId, // Skip order_id for local mock orders to prevent signature mismatches
        handler: function (paymentResponse) {
          // Trigger successful payment overlay, save order, and clear the cart!
          const pId = paymentResponse.razorpay_payment_id || `pay_mock_${Date.now()}`;
          setPaymentId(pId);
          
          const newOrder = {
            id: pId,
            date: new Date().toISOString(),
            items: cart,
            total: grandTotal
          };
          const existingOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
          localStorage.setItem("myOrders", JSON.stringify([...existingOrders, newOrder]));

          setCheckoutSuccess(true);
          clearCart();
        },
        prefill: {
          name: localStorage.getItem("username") || "Guest Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#7a9e6e", // Sage green accent color
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      // 4. Open Razorpay Payment Modal
      if (isMock) {
       
        setTimeout(() => {
          const pId = `pay_mock_${Date.now()}`;
          setPaymentId(pId);
          
          const newOrder = {
            id: pId,
            date: new Date().toISOString(),
            items: cart,
            total: grandTotal
          };
          const existingOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
          localStorage.setItem("myOrders", JSON.stringify([...existingOrders, newOrder]));

          setCheckoutSuccess(true);
          clearCart();
          setLoading(false);
        }, 1000);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Payment checkout error:", error.message);
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="cart-page-success" style={{
        maxWidth: "600px",
        margin: "6rem auto",
        padding: "3.5rem 2.5rem",
        background: "var(--forest-mid)",
        border: "1px solid var(--line-strong)",
        borderRadius: "var(--r-xl)",
        textAlign: "center",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem"
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(122, 158, 110, 0.15)",
          border: "2px solid var(--sage)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--sage-light)",
          fontSize: "2.2rem"
        }}>✓</div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.2rem",
          fontStyle: "italic",
          color: "var(--text-1)",
          margin: 0
        }}>Order Placed!</h2>
        <p style={{ color: "var(--text-2)", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>
          Thank you for choosing Freshora Mart. Your organic order has been verified and is already being hand-harvested by our farmers.
        </p>
        <div style={{
          background: "var(--forest-lift)",
          border: "1px solid var(--line)",
          padding: "1.25rem 1.75rem",
          borderRadius: "var(--r-md)",
          width: "100%",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--gold-pale)",
          textAlign: "left",
          boxSizing: "border-box"
        }}>
          <div style={{ marginBottom: "8px" }}><strong>Payment Method:</strong> Razorpay Sandbox</div>
          <div><strong>Payment ID:</strong> {paymentId}</div>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Link to="/products" className="btn-secondary" style={{ padding: "12px 24px" }}>
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn-primary" style={{ padding: "12px 24px" }}>
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary" style={{ width: "auto", padding: "14px 36px" }}>
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Your Cart</h1>
          <span className="cart-page-count">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
        </div>
        <Link to="/orders" className="btn-secondary" style={{ padding: "8px 16px" }}>View Past Orders</Link>
      </div>

      <div className="cart-page-layout">

        {/* ── ITEMS (left) ── */}
        <div className="cart-items-col">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Qty</span>
            <span>Price</span>
          </div>

          {cart.map((item) => (
            <div key={item._id} className="cart-page-row">
              <div className="cart-page-product">
                <img src={item.image} alt={item.name} className="cart-page-img" />
                <div className="cart-page-info">
                  <h3 className="cart-page-name">{item.name}</h3>
                  <span className="cart-page-category">{item.category}</span>
                  <span className="cart-page-unit-price">₹{item.price} / kg</span>
                </div>
              </div>

              <div className="cart-page-qty">
                <button className="qty-pg-btn" onClick={() => decreaseQuantity(item._id)}>−</button>
                <span className="qty-pg-num">{item.quantity}</span>
                <button className="qty-pg-btn" onClick={() => increaseQuantity(item._id)}>+</button>
              </div>

              <div className="cart-page-subtotal">
                <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)} title="Remove">
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="cart-continue">
            <Link to="/products" className="btn-secondary" style={{ width: "auto", padding: "11px 28px" }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── SUMMARY (right) ── */}
        <div className="cart-summary-col">
          <div className="cart-summary-card">
            <h2 className="cart-summary-title">Order Summary</h2>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{totalPrice.toFixed(0)}</span>
              </div>
              <div className="cart-summary-row">
                <span>GST (5%)</span>
                <span>₹{tax.toFixed(0)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span className={delivery === 0 ? "free-tag" : ""}>
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              {delivery > 0 && (
                <p className="free-delivery-note">Add ₹{(500 - totalPrice).toFixed(0)} more for free delivery</p>
              )}
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-grand-total">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>

            <button 
              className="checkout-btn" 
              onClick={handleCheckout} 
              disabled={loading}
              style={{ marginTop: "1.5rem" }}
            >
              {loading ? "Initializing Secure Payment..." : "Proceed to Checkout →"}
            </button>

            <div className="cart-trust-badges">
              <span> Secure checkout</span>
              <span> Organic guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

