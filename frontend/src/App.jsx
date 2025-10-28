import React from 'react';
import ProductList from './components/ProductList'; // Import the new component

function App() {
  return (
    <div className="App">
      <header>
        <h1>Vibe Commerce</h1>
      </header>
      <main>
        <ProductList /> {/* Add the component here */}
      </main>
    </div>
  );
}

export default App;