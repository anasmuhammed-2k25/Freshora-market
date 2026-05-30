import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const currentUsername = localStorage.getItem("username");
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    const userOrders = savedOrders.filter(order => order.username === currentUsername);
    setOrders(userOrders.reverse());
  }, []);

  return (
    <div className="cart-page" style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div className="cart-page-header" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Your Orders</h1>
        <Link to="/cart" className="btn-secondary" style={{ padding: "8px 16px" }}>← Back to Cart</Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="cart-page-empty" style={{ background: "var(--forest-mid)", padding: "4rem 2rem", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <div className="cart-empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders with us.</p>
          <Link to="/products" className="btn-primary" style={{ width: "auto", padding: "12px 24px" }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {orders.map((order) => (
            <div key={order.id} style={{ 
              background: "var(--forest-mid)", 
              border: "1px solid var(--line)", 
              borderRadius: "12px", 
              padding: "1.5rem",
              boxShadow: "var(--shadow-card)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: "var(--font-display)", color: "var(--text-1)" }}>Order #{order.id.slice(-8)}</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "600", color: "var(--gold)" }}>₹{order.total}</div>
                  <span style={{ fontSize: "0.8rem", color: "var(--sage)", background: "rgba(16, 185, 129, 0.1)", padding: "2px 8px", borderRadius: "4px" }}>Processing</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--text-2)" }}>{item.quantity}x {item.name}</span>
                    <span style={{ color: "var(--text-3)" }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
