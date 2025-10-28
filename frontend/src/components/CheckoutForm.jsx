import React, { useState } from 'react';
import axios from 'axios';
function CheckoutForm({ cartItems, cartTotal, onCheckoutSuccess, onCancel }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setSubmitting(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/checkout', {
        cartItems: cartItems,
        total: cartTotal,
        customer: formData
      });
      onCheckoutSuccess(response.data);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Checkout failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
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
        {/* Add a cancel button */}
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
        {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CheckoutForm;