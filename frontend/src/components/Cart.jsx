import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Define fetchCart once
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

  useEffect(() => {
    fetchCart(); // Fetch on initial load

    // This listener just refetches the cart data
    const handleCartUpdate = () => {
      fetchCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Show checkout form if 'showCheckout' is true
  if (showCheckout) {
    return (
      <CheckoutForm 
        cartItems={cart.items} 
        cartTotal={cart.total}
        // This prop lets the form close itself
        onClose={() => setShowCheckout(false)} 
      />
    );
  }

  // Show empty cart message
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  // Show cart items
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.items.map(item => (
        <div key={item.id} className="cart-item">
          <h4>{item.name}</h4>
          <p>Price: ${item.price.toFixed(2)}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Subtotal: ${item.itemTotal.toFixed(2)}</p>
          <button onClick={() => handleRemoveItem(item.id)}>
            Remove
          </button>
        </div>
      ))}
      <h3>Total: ${cart.total.toFixed(2)}</h3>
      <button onClick={() => setShowCheckout(true)}>
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;