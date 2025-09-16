
// utils/whatsappService.js
export const sendWhatsAppMessage = (orderData) => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER; // e.g. "2349168947722"

  const message = `
New Order 🚀
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}
Phone: ${orderData.customerPhone}
Address: ${orderData.deliveryAddress}
Instructions: ${orderData.specialInstructions || "None"}

Items:
${orderData.items.map((item) => `- ${item.name} x${item.quantity} ($${item.price})`).join("\n")}

Total: $${orderData.totalAmount.toFixed(2)}
  `;

  // WhatsApp Web API link
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

