import React, { useState } from 'react';
import axios from 'axios';

// This component needs to know what's in the cart, so we'll pass it as a prop
// NEW (add onClose)
function CheckoutForm({ cartItems, cartTotal, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [receipt, setReceipt] = useState(null); // Will hold our receipt
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Updates the form data as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    setSubmitting(true);
    setError(null);

    try {
      // Call the checkout API, sending the cart data and form data
      const response = await axios.post('http://localhost:5000/api/checkout', {
        cartItems: cartItems,
        total: cartTotal, 
        customer: formData
      });

      // We got a receipt back! Store it in state.
      setReceipt(response.data);
      
      // "Shout" that the cart was updated (it's empty now)
      window.dispatchEvent(new CustomEvent('cartUpdated'));

    } catch (err) {
      console.error("Checkout error:", err);
      setError("Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Render Logic ---

  // 1. If we have a receipt, show it!
  // NEW
if (receipt) {
  return (
    <div className="receipt-modal">
      <h3>Thank you for your order, {formData.name}!</h3>
      <p>A receipt (ID: {receipt.id}) has been sent to {formData.email}.</p>
      <h4>Order Summary:</h4>
      {receipt.items.map(item => (
        <div key={item.id}>
          {item.name} (x{item.quantity}) - ${item.itemTotal.toFixed(2)}
        </div>
      ))}
      <p><strong>Total Paid: ${receipt.total.toFixed(2)}</strong></p>
      <p>Timestamp: {new Date(receipt.timestamp).toLocaleString()}</p>

      {/* --- ADD THIS BUTTON --- */}
      <button onClick={onClose}>
        Back to Shop
      </button>
    </div>
  );
}

  // 2. If no receipt, show the form
  return (
    <div className="checkout-form">
      <h3>Checkout</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default CheckoutForm;