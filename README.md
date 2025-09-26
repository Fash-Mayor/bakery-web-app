# Bakery Web App

A modern, responsive frontend-only bakery e-commerce application built with React. Browse bakery products, add items to your cart, and place orders via email or WhatsApp.

## Features

- **Product Catalog**: Browse cakes, muffins, and ice cream with images, prices, and details.
- **Shopping Cart**: Add/remove items, persist cart in localStorage.
- **Checkout**: Submit orders with customer details and delivery info.
- **Order Notifications**: Send order confirmations via EmailJS or WhatsApp.
- **Responsive Design**: Mobile-friendly with Tailwind CSS.
- **Navigation**: React Router for seamless page transitions.

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Email Integration**: EmailJS
- **Notifications**: React Toastify

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bakery-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env` file):
   ```
   VITE_EMAIL_SERVICE_ID=your_emailjs_service_id
   VITE_EMAIL_TEMPLATE_ID=your_emailjs_template_id
   VITE_PUBLIC_KEY=your_emailjs_public_key
   VITE_WHATSAPP_NUMBER=your_whatsapp_number
   ```

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:5173](http://localhost:5173) in your browser.

3. Browse products, add to cart, and checkout.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Project Structure

```
bakery-web-app/
├── src/
│   ├── components/     # React components (ProductCatalog, ShoppingCart, etc.)
│   ├── data/           # Products data
│   ├── utils/          # Email and WhatsApp services
│   └── ...
├── public/assets/      # Product images
└── ...
```
