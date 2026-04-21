# 🍰 Modern Bakery Platform

A full-stack Progressive Web App (PWA) designed to bridge the gap between creative cake design and seamless bakery management. This platform enables customers to architect their own cakes in a simulated space while providing bakers with a robust backend to manage orders and inventory.

---

## 🚀 The "Crown Jewel": Interactive Cake Builder
The heart of the application is a custom-built, canvas-based design engine.

* **Fabric.js Integration**: A high-performance interactive canvas allows users to drag, resize, and rotate cake layers in real-time.
* **Faux-3D Architecture**: Implements depth-layering logic to simulate realistic cake tiers using offset shapes, stroke weights, and shadows.
* **Physics-Based Frosting**: Dynamic generation of frosting drips using randomized geometry to simulate realistic decorative elements.
* **Custom Texture Mapping**: Supports user-uploaded patterns mapped directly onto geometric shapes using `fabric.Pattern`.
* **The WhatsApp Bridge**: Once a design is finalized, the engine exports a high-resolution PNG to Supabase Storage and generates an automated order payload sent directly to the baker via WhatsApp.

---

## 🛠️ The Tech Stack
* **Frontend**: React with Tailwind CSS for a responsive, "mobile-first" experience.
* **Canvas Engine**: Fabric.js for complex object manipulation and image export.
* **Backend & Auth**: Supabase (PostgreSQL) handling relational data, user sessions, and image hosting.
* **State Management**: Optimized React hooks for real-time design updates.
* **Caching**: Custom **SWR (Stale-While-Revalidate)** pattern implemented at the service level for instant page transitions.

---

## 🏗️ Backend Growth & Architecture
The project has evolved from a static frontend to a dynamic, scalable "Engine Room."

### 1. SQL Schema Evolution
Moved from hardcoded data to a dynamic relational PostgreSQL database. The schema is built on a **"Provider" model**, allowing the platform to scale from a single bakery to a multi-vendor marketplace.

### 2. Authentication & Security
Integrated Supabase Auth to handle secure logins for both bakers and customers, enabling role-based views and protected routes.

### 3. API Orchestration
Developed a clean API layer using Supabase client calls to fetch products, handle high-res image uploads, and manage order metadata dynamically.

---

## ⚡ Performance Optimization: SWR Pattern
To ensure a "native app" feel, the platform uses a **Browser-Level SWR Cache**:
* **Instant UI**: Serves "stale" data from memory immediately during internal navigation.
* **Background Revalidation**: Silently fetches fresh data from the backend to update the UI without jarring loading spinners.
* **Execution Velocity**: Drastically reduces unnecessary API calls, keeping the app fast and cost-efficient.

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   ```
2. **Install dependencies:**:
   ```bash
   nom install
   ```
3. **Environment Variables**