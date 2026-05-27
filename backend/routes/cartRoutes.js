const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getCart, addToCart, decreaseQuantity, removeFromCart, clearCart } = require("../controllers/cartController");


router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/decrease", decreaseQuantity);
router.delete("/clear", clearCart);
router.delete("/remove/:id", removeFromCart);

module.exports = router;
