const Cart = require("../models/Cart");

// Helper to format the cart response (populating products)
const formatCartResponse = async (cart) => {
  await cart.populate("items.product");
  // Some products might have been deleted, filter them out safely
  const validItems = cart.items.filter(item => item.product !== null);
  return validItems.map(item => ({
    _id: item.product._id,
    name: item.product.name,
    price: item.product.price,
    description: item.product.description,
    category: item.product.category,
    image: item.product.image,
    quantity: item.quantity
  }));
};

// Get current user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    const formattedItems = await formatCartResponse(cart);
    res.json({ success: true, data: formattedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to cart or increment quantity
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    const formattedItems = await formatCartResponse(cart);
    res.json({ success: true, data: formattedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Decrease quantity
const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
    
    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
    }

    const formattedItems = await formatCartResponse(cart);
    res.json({ success: true, data: formattedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item entirely from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // productId
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== id);
    await cart.save();

    const formattedItems = await formatCartResponse(cart);
    res.json({ success: true, data: formattedItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart
};
