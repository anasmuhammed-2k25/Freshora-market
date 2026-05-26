

import React, { createContext, useContext, useState, useEffect } from "react";
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


  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortOrder]);


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


  const addToCart = (product) => {
    setCart((prevCart) => {
   
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
       
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
      
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };


  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };


  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };


  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); 
    });
  };

  const clearCart = () => {
    setCart([]);
  };


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
        // Filter state
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
