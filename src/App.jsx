import React, { useState, useEffect } from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import PlaceOrder from './utils/PlaceOrder'

function App() {

  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // In App component:
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <>
      <Router>
        
        <nav className="flex flex-row bg-gray-400 sticky top-0 z-10">
          <Link className="" to="/">Bakery</Link>
          <div className="ms-auto mr-3">
            <Link className="" to="/cart">Cart ({cartItems.length})</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<ProductCatalog onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
