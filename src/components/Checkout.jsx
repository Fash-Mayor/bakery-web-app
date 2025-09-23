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
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Checkout</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
          <input
            name="user_name"
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            value={formData.user_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
          <input
            name="user_email"
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            value={formData.user_email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
          <input
            name="user_phone"
            type="tel"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            value={formData.user_phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Delivery Address *</label>
          <textarea
            name="user_address"
            rows="3"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            value={formData.user_address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Special Instructions</label>
          <textarea
            name="specialInstructions"
            rows="2"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.specialInstructions}
            onChange={handleChange}
          />
        </div>

        <h4 className="text-xl font-bold text-right mb-4">
          Total: <span className="text-red-500">${totalAmount.toFixed(2)}</span>
        </h4>

        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold px-6 py-3 rounded shadow hover:bg-orange-600 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Checkout;
