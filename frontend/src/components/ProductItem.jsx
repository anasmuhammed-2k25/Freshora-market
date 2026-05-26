// src/components/ProductItem.jsx
import React from "react";
import { useItems } from "../context/ItemContext";

const ProductItem = ({ product }) => {
  const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, isInCart, getCartQuantity } =
    useItems();

  const inCart = isInCart(product._id);
  const quantity = getCartQuantity(product._id);

  return (
    <div className="product-card">
      {/* ── CATEGORY BADGE ── */}
      <span className={`category-badge ${product.category.toLowerCase()}`}>
        {product.category}
      </span>

      {/* ── PRODUCT IMAGE ── */}
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=" + product.name;
          }}
        />
      </div>

      {/* ── PRODUCT INFO ── */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <span className="price-unit">/kg</span>
        </div>
      </div>

      {/* ── CART CONTROLS ── */}
      <div className="product-actions">
        {!inCart ? (
          <button className="add-btn" onClick={() => addToCart(product)}>
            + Add to Cart
          </button>
        ) : (
          <div className="quantity-controls">
            <button className="qty-control-btn" onClick={() => decreaseQuantity(product._id)} title="Decrease">−</button>
            <span className="qty-display">{quantity}</span>
            <button className="qty-control-btn" onClick={() => increaseQuantity(product._id)} title="Increase">+</button>
            <button
              className="remove-full-btn"
              onClick={() => removeFromCart(product._id)}
              title="Remove from cart"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
