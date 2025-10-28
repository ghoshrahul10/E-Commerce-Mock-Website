import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState(null); // Will hold { items: [], total: 0 }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function fetches the cart data
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/cart');
        setCart(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    
    // We'll also listen for a custom event to refetch the cart
    // This allows other components to tell this one to update
    const handleCartUpdate = () => {
      fetchCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Cleanup: remove the event listener when component unmounts
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };

  }, []); // The empty array [] means this runs once on mount

  // --- Render Logic ---

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  // --- ADD THIS NEW FUNCTION above the 'return' ---
  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`);
      console.log(`Item ${itemId} removed`);
      // "Shout" that the cart was updated, so we refetch
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return <div>Loading cart...</div>;
  }
  // ... (keep the 'if (error)' and 'if (!cart)' blocks as they are) ...
  if (error) {
    return <div>{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  // --- REPLACE YOUR OLD 'return' BLOCK WITH THIS ---
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.items.map(item => (
        <div key={item.id} className="cart-item">
          <h4>{item.name}</h4>
          <p>Price: ${item.price.toFixed(2)}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Subtotal: ${item.itemTotal.toFixed(2)}</p>
          {/* --- ADD THE onClick HANDLER --- */}
          <button onClick={() => handleRemoveItem(item.id)}>
            Remove
          </button>
        </div>
      ))}
      <h3>Total: ${cart.total.toFixed(2)}</h3>
      <button>Checkout</button>
    </div>
  );
}

export default Cart;