import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { ProductCatalog, ShoppingCart, Checkout, ProductDetail, Feedback, Footer, Shop, BakerSignup, BakerProfile, Login, BuildCake, ScrollToTop } from './components';
import { BakerAuthProvider, useBakerAuth } from './context/BakerAuthContext';
import { signOutUser } from './utils/dataService';
import { toast } from 'react-toastify';
import { FaHome } from "react-icons/fa";
import { IoCart, IoConstruct  } from "react-icons/io5";
import { FaShop } from "react-icons/fa6";
import { MdFeedback, MdLogout } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { CiShop } from "react-icons/ci";

// Move PageHeader out of App to keep component identity stable
const PageHeader = ({ searchQuery, setSearchQuery, cartItems, onLoginClick, onSignOutClick }) => {
  const location = useLocation();
  const { baker } = useBakerAuth();

  return (
    <header>
      <div className="lg:flex lg:flex-row lg:items-start lg:gap-6">
        {/* PAGE TOP only on home page */}
        {location.pathname === '/' && (
          <div className="w-full lg:w-[70%] bg-white px-4 py-6 shadow-sm">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Hi there! 👋</h1>
              <p className="text-gray-600 mb-4">What are you craving today?</p>
              <input
                type="text"
                placeholder="Search cake, cookies, anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 transition"
              />
            </div>
          </div>
        )}

        {/* NAV (mobile: fixed bottom row; lg: static horizontal row with equal widths) */}
        <nav className="w-full fixed bottom-0 left-0 z-10 bg-white shadow-2xl lg:shadow-sm px-4 py-3 lg:static lg:bg-transparent lg:px-0 lg:py-0">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-around items-center lg:flex-row lg:justify-between lg:items-stretch gap-2 lg:gap-0">
              <Link
                to="/"
                className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
              >
                <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                  <FaHome className="text-2xl lg:text-xl text-orange-600" />
                  <span className="text-xs lg:text-base font-medium">Home</span>
                </div>
              </Link>

              <Link
                to="/shop"
                className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
              >
                <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                  <FaShop className="text-2xl lg:text-xl text-orange-600" />
                  <span className="text-xs lg:text-base font-medium">Shop</span>
                </div>
              </Link>

              <Link
                to="/cart"
                className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
              >
                <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2 relative">
                  <IoCart className="text-2xl lg:text-xl text-orange-600" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                  <span className="text-xs lg:text-base font-medium">Cart</span>
                </div>
              </Link>

              <Link
                to="/build-cake"
                className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
              >
                <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                  <IoConstruct className="text-2xl lg:text-xl text-orange-600" />
                  <span className="text-xs lg:text-base font-medium">Build Cake</span>
                </div>
              </Link>

              <Link
                to="/feedback"
                className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
              >
                <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                  <MdFeedback className="text-2xl lg:text-xl text-orange-600" />
                  <span className="text-xs lg:text-base font-medium">Feedback</span>
                </div>
              </Link>

              {baker ? (
                <>
                  <Link
                    to={`/baker-profile/${baker.id}`}
                    className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent hidden lg:flex"
                  >
                    <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                      <FaUser className="text-2xl lg:text-xl text-orange-600" />
                      <span className="text-xs lg:text-base font-medium">Profile</span>
                    </div>
                  </Link>

                  <button
                    onClick={onSignOutClick}
                    className="flex-1 text-center hover:text-red-600 transition px-2 py-2 rounded-lg hover:bg-red-50 lg:hover:bg-transparent hidden lg:flex"
                  >
                    <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                      <MdLogout className="text-2xl lg:text-xl text-red-600" />
                      <span className="text-xs lg:text-base font-medium">Sign Out</span>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent hidden lg:flex"
                >
                  <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                    <span className="text-xs lg:text-base font-semibold">Create a Stall</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

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
      <PageHeader
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
            element={
              <>
                <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />
              </>
            }
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
