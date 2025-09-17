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
      <div className="">
        <h3>Your cart is empty.</h3>
        <Link to="/" className="">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Your Shopping Cart</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  style={{width: '60px'}}
                />
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button className="" onClick={() => handleRemove(item.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Total: ${total.toFixed(2)}</h4>
      <button className="" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
    </div>
  );
};

export default ShoppingCart;
