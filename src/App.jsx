import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ProductCatalog, ShoppingCart, Checkout, ProductDetail, Feedback, Footer, Shop, BakerSignup, BakerProfile, Login, BuildCake, ScrollToTop, Navbar, CompleteProfile } from './components';
import { BakerAuthProvider, useBakerAuth } from './context/BakerAuthContext';
import { signOutUser } from './utils/dataService';
import { toast } from 'react-toastify';

function AppContent() {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { logoutBaker, baker } = useBakerAuth();

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      logoutBaker();
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <>
      <ScrollToTop />
      
      {/* Replaced PageHeader with our new Navbar component */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        onLoginClick={handleLoginClick}
        onSignOutClick={handleSignOut}
      />

      <main className="mb-24 lg:mb-0">
        <Routes>
          <Route
            path="/"
            element={<ProductCatalog onAddToCart={handleAddToCart} searchQuery={searchQuery} />}
          />
          <Route
            path="/cart"
            element={<ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/checkout"
            element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/become-baker" element={<BakerSignup />} />
          <Route path="/baker-profile/:bakerId" element={<BakerProfile />} />
          <Route path="/build-cake" element={<BuildCake />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Routes>
      </main>
      <Footer isLoggedIn={!!baker} onSignInClick={handleLoginClick} />
    </>
  );
}

function App() {
  return (
    <Router>
      <BakerAuthProvider>
        <AppContent />
      </BakerAuthProvider>
    </Router>
  );
}

export default App;