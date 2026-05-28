import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  // ─── STATE ───────────────────────────────────────────
  const [products, setProducts] = useState([]);        
  const [cart, setCart] = useState([]);              
  const [loading, setLoading] = useState(true);       
  const [error, setError] = useState(null);           

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const token = localStorage.getItem("token");

  // Re-fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortOrder]);

  // Fetch Cart when token changes (i.e., user logs in)
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart([]);
    }
    
    // Listen for auth changes globally
    const handleAuthChange = () => {
      const newToken = localStorage.getItem("token");
      if (newToken) {
        fetchCart();
      } else {
        setCart([]);
      }
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [token]);

  // ─── API FETCH CALLS ────────────────────────────────────
  const getAuthHeaders = () => {
    const currentToken = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${currentToken}` } };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (minPrice !== "") params.minPrice = minPrice;
      if (maxPrice !== "") params.maxPrice = maxPrice;
      if (sortOrder !== "") params.sort = sortOrder;

      const response = await axios.get("/api/products", { params });
      setProducts(response.data.data); 
    } catch (err) {
      setError("Failed to load products. Make sure the backend is running.");
      console.error("API Error:", err.message);
    } finally {
      setLoading(false); 
    }
  };

  const fetchCart = async () => {
    try {
      if (!localStorage.getItem("token")) return;
      const res = await axios.get("/api/cart", getAuthHeaders());
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err.message);
    }
  };

  // ─── CART ACTIONS (SYNCED WITH MONGODB) ──────────────────────────
  
  const navigate = useNavigate();

  const handleAuthError = () => {
    navigate("/login");
  };

  const addToCart = async (product) => {
    if (!localStorage.getItem("token")) return handleAuthError();
    try {
      // Optimistic UI Update Option (skipped here for simplicity and safety)
      const res = await axios.post("/api/cart/add", { productId: product._id }, getAuthHeaders());
      if (res.data.success) setCart(res.data.data);
    } catch (err) {
      console.error("Failed to add to cart:", err.message);
    }
  };

  const removeFromCart = async (productId) => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await axios.delete(`/api/cart/remove/${productId}`, getAuthHeaders());
      if (res.data.success) setCart(res.data.data);
    } catch (err) {
      console.error("Failed to remove from cart:", err.message);
    }
  };

  const increaseQuantity = async (productId) => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await axios.post("/api/cart/add", { productId }, getAuthHeaders());
      if (res.data.success) setCart(res.data.data);
    } catch (err) {
      console.error("Failed to increase quantity:", err.message);
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await axios.post("/api/cart/decrease", { productId }, getAuthHeaders());
      if (res.data.success) setCart(res.data.data);
    } catch (err) {
      console.error("Failed to decrease quantity:", err.message);
    }
  };

  const clearCart = async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await axios.delete("/api/cart/clear", getAuthHeaders());
      if (res.data.success) setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
    }
  };

  // ─── UTILS ──────────────────────────────────────────────
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const isInCart = (productId) => cart.some((item) => item._id === productId);

  const getCartQuantity = (productId) => {
    const item = cart.find((i) => i._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <ItemContext.Provider
      value={{
        products,
        loading,
        error,
        cart,
        cartCount,
        totalPrice,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isInCart,
        getCartQuantity,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItems must be used inside ItemProvider");
  }
  return context;
};

export default ItemContext;
