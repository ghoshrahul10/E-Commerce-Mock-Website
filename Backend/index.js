const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;
let { mockProducts, cart } = require("./db");
app.use(cors());
app.use(express.json());
app.get("/api/products", (req, res) => {
  res.json(mockProducts);
});
app.get("/api/cart", (req, res) => {
  let total = 0;
  const cartItems = Object.keys(cart)
    .map((id) => {
      const product = mockProducts.find((p) => p.id == id);
      if (!product) {
        delete cart[id];
        return null;
      }

      const quantity = cart[id];
      const itemTotal = product.price * quantity;
      total += itemTotal;

      return {
        ...product,
        quantity,
        itemTotal: parseFloat(itemTotal.toFixed(2)),
      };
    })
    .filter((item) => item !== null);

  res.json({
    items: cartItems,
    total: parseFloat(total.toFixed(2)),
  });
});
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty) {
    return res
      .status(400)
      .json({ error: "Product ID and quantity are required." });
  }

  const productExists = mockProducts.some((p) => p.id == productId);
  if (!productExists) {
    return res.status(404).json({ error: "Product not found." });
  }

  cart[productId] = (cart[productId] || 0) + parseInt(qty, 10);

  res.status(201).json({ message: "Item added to cart", cart });
});

// DELETE /api/cart/:id: Remove item from cart
app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params; // Note: id is a string here

  if (cart[id]) {
    delete cart[id];
    res.json({ message: "Item removed from cart", cart });
  } else {
    // It's common to return 404 if the resource to delete isn't found
    res.status(404).json({ error: "Item not in cart" });
  }
});

// POST /api/checkout: {cartItems, total} → mock receipt
app.post("/api/checkout", (req, res) => {
  const { cartItems, total } = req.body; // Expecting the cart from the frontend

  if (!cartItems || total === undefined) {
    return res
      .status(400)
      .json({ error: "Cart items and total are required." });
  }

  // Create a mock receipt
  const receipt = {
    id: `receipt-${Date.now()}`,
    items: cartItems,
    total: total,
    timestamp: new Date().toISOString(),
  };

  // Clear the cart on successful checkout
  cart = {};

  res.json(receipt);
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
