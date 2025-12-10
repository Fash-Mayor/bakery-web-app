// utils/emailService.js
import emailjs from "@emailjs/browser";

export const sendOrderEmail = async (orderData) => {
  const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS config missing');
  }

  const templateParams = {
    customer_name: orderData.customerName,
    customer_email: orderData.customerEmail,
    customer_phone: orderData.customerPhone,
    delivery_address: orderData.deliveryAddress,
    delivery_date: orderData.deliveryDate, // <-- add this (match your EmailJS template variable)
    special_instructions: orderData.specialInstructions || '',
    items: orderData.items.map(i => `${i.name} x${i.quantity} (₦${i.price})`).join('\n'),
    total: orderData.totalAmount
  };

  return emailjs.send(serviceId, templateId, templateParams, publicKey);
};

export const sendFeedbackEmail = async (feedback) => {
  const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAIL_FEEDBACK_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS config missing for feedback");
  }

  const templateParams = {
    user_name: feedback.name || 'Anonymous',
    user_email: feedback.email || 'Not provided',
    message: feedback.message,
    rating: feedback.rating || '5',
  };

  return emailjs.send(serviceId, templateId, templateParams, publicKey);
};