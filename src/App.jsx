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
          {/* CONTAINER: becomes row on sm+ */}
          <div className="sm:flex sm:flex-row sm:items-start sm:gap-6">
            {/* PAGE TOP (full width on mobile, 70% on sm+) */}
            <div className="w-full sm:w-[70%] bg-white px-4 py-6 border-b-2 border-orange-100">
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
                {/* on sm+ the nav links should appear under the search bar visually:
                    keep the Categories/links area here if you want them directly under search
                    or leave nav separate below. */}
              </div>
            </div>

            {/* NAV (full width fixed bottom on mobile, 30% column on sm+) */}
            <nav className="w-full fixed bottom-0 left-0 z-10 bg-white shadow px-4 py-3 sm:static sm:w-[30%] sm:shadow-none sm:bg-transparent sm:px-6 sm:py-0">
              <div className="max-w-4xl mx-auto sm:mx-0 sm:pl-4">
                <div className="flex justify-around sm:flex-col sm:space-y-4 sm:justify-start">
                  <Link
                    to="/"
                    className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-2 hover:text-orange-600 transition"
                  >
                    <FaHome className="text-2xl sm:text-xl text-orange-600" />
                    <span className="text-xs sm:text-base ml-0 sm:ml-2">Home</span>
                  </Link>

                  <Link
                    to="/cart"
                    className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-2 hover:text-orange-600 transition"
                  >
                    <IoCart className="text-2xl sm:text-xl text-orange-600" />
                    <span className="text-xs sm:text-base ml-0 sm:ml-2">Cart ({cartItems.length})</span>
                  </Link>

                  <Link
                    to="/feedback"
                    className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-2 hover:text-orange-600 transition"
                  >
                    <span className="text-xs sm:text-base ml-0 sm:ml-2">Feedback</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="mb-24 sm:mb-0">
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
