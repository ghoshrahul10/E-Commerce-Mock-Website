import React from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart'; // 1. Import the Cart component

function App() {
  return (
    <div className="App">
      <header>
        <h1>Vibe Commerce</h1>
      </header>
      <main>
        <ProductList />
        <hr /> {/* Add a horizontal line to separate them */}
        <Cart /> {/* 2. Add the Cart component here */}
      </main>
    </div>
  );
}

export default App;