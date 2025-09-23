import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h3 className="text-2xl font-semibold mb-4">Your cart is empty.</h3>
        <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded shadow hover:bg-orange-600 transition">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-6 text-center">Your Shopping Cart</h3>
      <div className="flex flex-col gap-4">
        {cartItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg flex items-center p-4">
            <div className="flex-1">
              <h5 className="text-lg font-semibold">{item.name}</h5>
              <p className="text-red-500 font-bold text-lg">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center"
              />
              <span className="text-gray-700 font-medium">x</span>
              <span className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <button
              className="ml-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
              onClick={() => handleRemove(item.id)}
              aria-label="Remove item"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <h4 className="text-xl font-bold">Total: <span className="text-red-500">${total.toFixed(2)}</span></h4>
        <button
          className="bg-orange-500 text-white px-6 py-2 rounded shadow hover:cursor-pointer hover:bg-orange-600 transition"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-12 mt-6">
        <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded shadow hover:bg-orange-600 transition">
          Keep Shopping
        </Link>
      </div>
    </div>
  );
};

export default ShoppingCart;
