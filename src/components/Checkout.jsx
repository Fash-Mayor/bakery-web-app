import React, { useState } from "react";
import { sendOrderEmail } from "../utils/emailService";
import { sendWhatsAppMessage } from "../utils/whatsappService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Checkout = ({ cartItems, setCartItems }) => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    user_address: "",
    specialInstructions: "",
    deliveryDate: "", // <-- added
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Order review modal state
  const [showReview, setShowReview] = useState(false);
  const [orderPreview, setOrderPreview] = useState(null);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open review modal instead of immediately sending
  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // simple validation: require delivery date
    if (!formData.deliveryDate) {
      toast.error("Please select a delivery date.");
      return;
    }

    const orderData = {
      customerName: formData.user_name,
      customerEmail: formData.user_email,
      customerPhone: formData.user_phone,
      deliveryAddress: formData.user_address,
      deliveryDate: formData.deliveryDate, // <-- include date
      specialInstructions: formData.specialInstructions,
      items: cartItems,
      totalAmount,
    };

    setOrderPreview(orderData);
    setShowReview(true);
  };

  // Called when user confirms on review modal
  const handleConfirmOrder = async () => {
    if (!orderPreview) return;
    setIsSubmitting(true);
    try {
      const emailResult = await sendOrderEmail(orderPreview);
      if (emailResult.status === 200) {
        sendWhatsAppMessage(orderPreview);
        toast.success(
          "Order placed successfully! Please confirm via WhatsApp.",
        );
        setCartItems([]);
        setFormData({
          user_name: "",
          user_email: "",
          user_phone: "",
          user_address: "",
          specialInstructions: "",
          deliveryDate: "",
        });
        localStorage.removeItem("cart");
        setShowReview(false);
      } else {
        toast.error("Failed to send order email.");
      }
    } catch (error) {
      toast.error("An error occurred while placing your order.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // min date for date input

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">
          📋 Checkout
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name *
            </label>
            <input
              name="user_name"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
              value={formData.user_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email Address *
            </label>
            <input
              name="user_email"
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
              value={formData.user_email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Phone Number * (WhatsApp)
            </label>
            <input
              name="user_phone"
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
              value={formData.user_phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Delivery Address * (within Lagos and Ogun)
            </label>
            <textarea
              name="user_address"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
              required
              value={formData.user_address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              rows="2"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
              value={formData.specialInstructions}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Delivery Date *
            </label>
            <input
              name="deliveryDate"
              type="date"
              min={today}
              required
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition bg-white"
            />
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-6">
            <h4 className="text-2xl font-bold text-right">
              Total:{" "}
              <span className="text-orange-500">₦{totalAmount.toFixed(2)}</span>
            </h4>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "⏳ Placing Order..." : "✅ Place Order"}
          </button>
        </form>
      </div>

      {/* Order Review Modal */}
      {showReview && orderPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowReview(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 z-10">
            <h3 className="text-3xl font-bold mb-6 text-gray-900">
              📋 Review Your Order
            </h3>

            <div className="space-y-6 max-h-72 overflow-auto pb-2">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4">
                <h4 className="font-bold mb-3 text-gray-900">
                  👤 Customer Details
                </h4>
                <p className="text-gray-800 font-medium">
                  {orderPreview.customerName}
                </p>
                <p className="text-gray-600 text-sm">
                  {orderPreview.customerEmail}
                </p>
                <p className="text-gray-600 text-sm">
                  📞 {orderPreview.customerPhone}
                </p>
                <p className="text-gray-600 text-sm mt-2 italic">
                  📍 {orderPreview.deliveryAddress}
                </p>
                <p className="text-gray-700 font-medium mt-2">
                  📅 Delivery:{" "}
                  {new Date(orderPreview.deliveryDate).toLocaleDateString()}
                </p>
                {orderPreview.specialInstructions && (
                  <p className="text-gray-600 text-sm mt-2">
                    ✏️ {orderPreview.specialInstructions}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-bold mb-3 text-gray-900">🛒 Items</h4>
                <ul className="divide-y divide-gray-200">
                  {orderPreview.items.map((item) => (
                    <li
                      key={item.id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-orange-600">
                          ₦{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-xl font-bold text-gray-900">
                  Total Amount
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  ₦{orderPreview.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold transition"
                onClick={() => setShowReview(false)}
                type="button"
              >
                ← Back
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 font-semibold transition shadow-lg disabled:opacity-50"
                onClick={handleConfirmOrder}
                type="button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "⏳ Placing..." : "✅ Confirm & Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Checkout;
