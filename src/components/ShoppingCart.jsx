import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShoppingCart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-4 text-gray-900">
            🛒 Your cart is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Nothing here yet, let's add some delicious baked goods!
          </p>
          <Link
            to="/shop"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
          >
            🛍️ Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-4xl font-bold mb-8 text-center text-gray-900">
          🛒 Your Shopping Cart
        </h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1 mb-4 md:mb-0">
                <h5 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name}
                </h5>
                <p className="text-orange-500 font-bold text-2xl">
                  ₦{item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <span className="text-gray-600">Qty:</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-xl font-semibold text-orange-600">
                  ₦{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
              <button
                className="w-full md:w-auto ml-0 md:ml-4 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 font-semibold transition shadow"
                onClick={() => handleRemove(item.id)}
                aria-label="Remove item"
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h4 className="text-2xl font-bold text-gray-900">
              Total:{" "}
              <span className="text-orange-500">₦{total.toFixed(2)}</span>
            </h4>
            <button
              className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
              onClick={() => navigate("/checkout")}
            >
              ✅ Proceed to Checkout
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-6 mb-9 sm:mb-0">
          <Link
            to="/"
            className="inline-block bg-orange-100 text-orange-600 hover:bg-orange-200 px-6 py-2 rounded-lg font-semibold transition"
          >
            ← Keep Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
