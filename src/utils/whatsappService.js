
// utils/whatsappService.js
export const sendWhatsAppMessage = (orderData, options = {}) => {
  const phoneNumber = options.phoneNumber || import.meta.env.VITE_WHATSAPP_NUMBER; // e.g. "2349168947722"

  const items = Array.isArray(orderData?.items) ? orderData.items : [];
  const itemsText = items.length
    ? items.map((item) => `- ${item.name} x${item.quantity} ($${item.price})`).join("\n")
    : "Custom cake build";

  const bakerName = orderData?.bakerName || options.bakerName || orderData?.bakerId || "";
  const cakeImageUrl =
    orderData?.cakeImageUrl || options.imageUrl || options.cakeImageUrl || orderData?.imageUrl || "";

  const message =
    options.customMessage ||
    `
New Order 🚀
Bakery/Baker: ${bakerName || "Not specified"}
Name: ${orderData?.customerName || "N/A"}
Email: ${orderData?.customerEmail || "N/A"}
Phone: ${orderData?.customerPhone || "N/A"}
Delivery Address: ${orderData?.deliveryAddress || "N/A"}
Delivery Date: ${orderData?.deliveryDate || "N/A"}
Instructions: ${orderData?.specialInstructions || orderData?.customerMessage || "None"}
${
    cakeImageUrl ? `\nCake Image: ${cakeImageUrl}` : ""
  }

Items:
${itemsText}

Total: $${typeof orderData?.totalAmount === "number" ? orderData.totalAmount.toFixed(2) : "0.00"}
  `;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

