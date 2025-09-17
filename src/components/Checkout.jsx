
import React, { useState } from 'react';
import { sendOrderEmail } from '../utils/emailService';
import { sendWhatsAppMessage } from '../utils/whatsappService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = ({ cartItems, setCartItems }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    user_address: '',
    specialInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerName: formData.user_name,
      customerEmail: formData.user_email,
      customerPhone: formData.user_phone,
      deliveryAddress: formData.user_address,
      specialInstructions: formData.specialInstructions,
      items: cartItems,
      totalAmount,
    };

    try {
      const emailResult = await sendOrderEmail(orderData);

      if (emailResult.status === 200) {
        sendWhatsAppMessage(orderData);
        toast.success('Order placed successfully! Please confirm via WhatsApp.');
        setCartItems([]);
        setFormData({
          user_name: '',
          user_email: '',
          user_phone: '',
          user_address: '',
          specialInstructions: ''
        });
        localStorage.removeItem('cart');
      } else {
        toast.error('Failed to send order email.');
      }
    } catch (error) {
      toast.error('An error occurred while placing your order.');
      console.log(error)

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name *</label>
          <input
            name="user_name"
            type="text"
            className="form-control"
            required
            value={formData.user_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address *</label>
          <input
            name="user_email"
            type="email"
            className="form-control"
            required
            value={formData.user_email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number *</label>
          <input
            name="user_phone"
            type="tel"
            className="form-control"
            required
            value={formData.user_phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Delivery Address *</label>
          <textarea
            name="user_address"
            rows="3"
            className="form-control"
            required
            value={formData.user_address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Special Instructions</label>
          <textarea
            name="specialInstructions"
            rows="2"
            className="form-control"
            value={formData.specialInstructions}
            onChange={handleChange}
          />
        </div>

        <h4>Total: ${totalAmount.toFixed(2)}</h4>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Checkout;
