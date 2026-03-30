import { Link, useLocation } from "react-router-dom";
import { useBakerAuth } from "../context/BakerAuthContext";
import { FaHome, FaUser } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { IoCart, IoConstruct } from "react-icons/io5";
import { MdFeedback, MdLogout } from "react-icons/md";

const Navbar = ({ searchQuery, setSearchQuery, cartItems, onLoginClick, onSignOutClick }) => {
  const location = useLocation();
  const { baker } = useBakerAuth();

  return (
    <header>
      <div className="lg:flex lg:flex-row lg:items-start lg:gap-6">
        {/* PAGE TOP only on home page and only for non-bakers */}
        {location.pathname === '/' && !baker && (
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

        {/* NAV */}
        <nav className="w-full fixed bottom-0 left-0 z-10 bg-white shadow-2xl lg:shadow-sm px-4 py-3 lg:static lg:bg-transparent lg:px-0 lg:py-0">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex justify-around items-center lg:flex-row lg:justify-between lg:items-stretch gap-2 lg:gap-0">
              
              {/* Consumer Only Links: Hidden if baker is logged in */}
              {!baker && (
                <>
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
                </>
              )}

              {/* Shared Links: Always visible */}
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
                to="/feedback"
                className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
              >
                <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                  <MdFeedback className="text-2xl lg:text-xl text-orange-600" />
                  <span className="text-xs lg:text-base font-medium">Feedback</span>
                </div>
              </Link>

              {/* Baker Only Links */}
              {baker ? (
                <>
                  <Link
                    to={`/baker-profile/${baker.id}`}
                    className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
                  >
                    <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                      <FaUser className="text-2xl lg:text-xl text-orange-600" />
                      <span className="text-xs lg:text-base font-medium">Profile</span>
                    </div>
                  </Link>

                  <button
                    onClick={onSignOutClick}
                    className="flex-1 text-center hover:text-red-600 transition px-2 py-2 rounded-lg hover:bg-red-50 lg:hover:bg-transparent"
                  >
                    <div className="inline-flex flex-col items-center lg:flex-row lg:justify-center lg:gap-2">
                      <MdLogout className="text-2xl lg:text-xl text-red-600" />
                      <span className="text-xs lg:text-base font-medium">Sign Out</span>
                    </div>
                  </button>
                </>
              ) : (
                /* Visible on all screens when not logged in */
                <button
                  onClick={onLoginClick}
                  className="flex-1 text-center hover:text-orange-600 transition px-2 py-2 rounded-lg hover:bg-orange-50 lg:hover:bg-transparent"
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

export default Navbar;