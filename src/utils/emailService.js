
// utils/emailService.js
import emailjs from "@emailjs/browser";

export const sendOrderEmail = async (orderData) => {
  const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS serviceId, templateId, or publicKey is missing");
  }

  // Map your order details to match EmailJS template variables
  const templateParams = {
    customer_name: orderData.customerName,
    customer_email: orderData.customerEmail,
    customer_phone: orderData.customerPhone,
    delivery_address: orderData.deliveryAddress,
    special_instructions: orderData.specialInstructions || "None",

    // Build readable order summary
    order_items: orderData.items
      .map((item) => `${item.name} x${item.quantity} ($${item.price})`)
      .join(", "),

    total: `$${orderData.totalAmount.toFixed(2)}`
  };

  return emailjs.send(serviceId, templateId, templateParams, publicKey);
};