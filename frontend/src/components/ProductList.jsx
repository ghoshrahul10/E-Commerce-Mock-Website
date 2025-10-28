import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- NEW FUNCTION ---
  // This function will be called when a button is clicked
  const handleAddToCart = async (productId) => {
    try {
      // Send a POST request to our backend
      await axios.post('http://localhost:5000/api/cart', {
        productId: productId,
        qty: 1 // We'll just add 1 at a time
      });
      // You could add a success message here, e.g., alert('Item added!')
      console.log(`Product ${productId} added to cart`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      // You could show an error to the user here
    }
  };
  
  // --- RENDER LOGIC ---

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            {/* --- UPDATED BUTTON --- */}
            {/* Add the onClick handler here */}
            <button onClick={() => handleAddToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;