import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ProductCatalog, ShoppingCart, Checkout, Categories, CategoryProducts, ProductDetail, Feedback, } from './components';
import { FaHome } from "react-icons/fa";
import { IoCart } from "react-icons/io5";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <>
      <Router>
        <header>
          {/* CONTAINER: becomes row on lg+ */}
          <div className="lg:flex lg:flex-row lg:items-start lg:gap-6">
            {/* PAGE TOP (full width on mobile, 70% on lg+) */}
            <div className="w-full lg:w-[70%] bg-white px-4 py-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Hi there!</h1>
                <p className="text-gray-600 mb-4">What are you looking for today?</p>
                <input
                  type="text"
                  placeholder="Search cake, cookies, anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                />
              </div>
            </div>

            {/* NAV (mobile: fixed bottom row; lg: static horizontal row with equal widths) */}
            <nav className="w-full fixed bottom-0 left-0 z-10 bg-white shadow px-4 py-3 lg:static lg:bg-transparent lg:shadow-none lg:px-0 lg:py-0">
              <div className="max-w-screen-xl mx-auto">
                <div className="flex justify-around items-center lg:flex-row lg:justify-between lg:items-stretch">
                  <Link
                    to="/"
                    className="flex-1 text-center hover:text-orange-600 transition px-2"
                  >
                    <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                      <FaHome className="text-2xl lg:text-xl text-orange-600" />
                      <span className="text-xs lg:text-base">Home</span>
                    </div>
                  </Link>

                  <Link
                    to="/cart"
                    className="flex-1 text-center hover:text-orange-600 transition px-2"
                  >
                    <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                      <IoCart className="text-2xl lg:text-xl text-orange-600" />
                      <span className="text-xs lg:text-base">Cart ({cartItems.length})</span>
                    </div>
                  </Link>

                  <Link
                    to="/feedback"
                    className="flex-1 text-center hover:text-orange-600 transition px-2"
                  >
                    <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                      <span className="text-xs lg:text-base">Feedback</span>
                    </div>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="mb-24 lg:mb-0">
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
            <Route
              path="/category/:category"
              element={<CategoryProducts onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/product/:id"
              element={<ProductDetail onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/checkout"
              element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />}
            />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
