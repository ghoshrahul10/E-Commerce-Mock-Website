import React from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Vibe Commerce</h1>
      </header>
      <main>
        <ProductList />
        <hr />
        <Cart />
      </main>
    </div>
  );
}

export default App;