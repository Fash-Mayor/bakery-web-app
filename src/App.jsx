import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ProductCatalog, ShoppingCart,  Checkout,  Categories,  CategoryProducts,  ProductDetail } from './components';
import { FaHome } from "react-icons/fa";
import { IoCart } from "react-icons/io5";

function App() {
  const [cartItems, setCartItems] = useState([]);

  // add to cart
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // In App component: use effect to load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <>
      <Router>
        <header className="sm:mb-12">
          <nav className="flex items-center bg-white shadow w-full fixed bottom-0 z-10 sm:top-0 sm:bottom-auto sm:flex-row justify-around sm:justify-between border-t-2 sm:border-t-0 sm:border-b-2 border-orange-500 px-4 py-2 sm:px-8 sm:py-4">
            <Link
              to="/"
              className="flex flex-col items-center sm:flex-row sm:gap-2"
            >
              <FaHome className="text-2xl sm:text-xl text-orange-600" />
              <span className="text-xs sm:text-base sm:inline">Home</span>
            </Link>
            <Link
              to="/cart"
              className="flex flex-col items-center sm:flex-row sm:gap-2"
            >
              <IoCart className="text-2xl sm:text-xl text-orange-600" />
              <span className="text-xs sm:text-base sm:inline">
                Cart ({cartItems.length})
              </span>
            </Link>
          </nav>

        </header>
        <Routes>
          <Route
            path="/"
            element={<ProductCatalog onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/cart"
            element={
              <>
                <Categories />
                <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />
              </>
            }
          />
          <Route path="/category/:category" element={<CategoryProducts onAddToCart={handleAddToCart} />} />

          <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          {/* <Route path="/cart" element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />} /> */}
          <Route
            path="/checkout"
            element={
              <Checkout cartItems={cartItems} setCartItems={setCartItems} />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
