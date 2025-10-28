import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckoutForm from './CheckoutForm';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null); 
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
    fetchCart(); 

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
  const handleCheckoutSuccess = (receiptData) => {
    setReceipt(receiptData);    
    setShowCheckout(false);   
    fetchCart();              
  };
  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (receipt) {
    return (
      <div className="receipt-modal">
        <h3>Thank you for your order!</h3>
        <p>A receipt (ID: {receipt.id}) has been sent.</p>
        <h4>Order Summary:</h4>
        {receipt.items.map(item => (
          <div key={item.id}>
            {item.name} (x{item.quantity}) - ${item.itemTotal.toFixed(2)}
          </div>
        ))}
        <p><strong>Total Paid: ${receipt.total.toFixed(2)}</strong></p>
        {}
        <button onClick={() => setReceipt(null)}>
          Back to Shop
        </button>
      </div>
    );
  }
  if (showCheckout) {
    return (
      <CheckoutForm 
        cartItems={cart.items} 
        cartTotal={cart.total}
        onCheckoutSuccess={handleCheckoutSuccess}
        onCancel={() => setShowCheckout(false)}
      />
    );
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }
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