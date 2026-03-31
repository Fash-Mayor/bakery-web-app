import { FaArrowUp, FaGithub, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiDailydotdev } from "react-icons/si";
import { FaLocationDot, FaPhoneVolume  } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = ({ isLoggedIn, onSignInClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-800 text-white py-8 mb-14 lg:mb-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Tagline */}
          <div>
            <h3 className="text-xl font-bold mb-2">Bakery Mart</h3>
            <p className="text-gray-300">Find the best baked goods and bakers</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-orange-400 transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer and baker Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer / Baker Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-orange-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-400 transition">
                  Help Center
                </Link>
              </li>
              {!isLoggedIn && (
                <li>
                  <button
                    onClick={onSignInClick}
                    className="hover:text-orange-400 transition cursor-pointer"
                  >
                    Sign In / Create a Stall
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-300 mb-2">
              <FaLocationDot size={21} className="inline" /> Vercel
            </p>
            <p className="text-gray-300 mb-2">
              <FaPhoneVolume size={21} className="inline" /> (234) 810-0863-195
            </p>
            <p className="text-gray-300 mb-2">
              <FaEnvelope size={21} className="inline" /> info@bakerymart.com
            </p>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h4 className="text-lg font-semibold mb-4">Delivery Information</h4>
          <p className="text-gray-300">
            Delivery is dependent entirely on the business owner and has nothing to do with us.
          </p>
        </div>

        {/* Social Media and Payment */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://github.com/Fash-Mayor"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition"
            >
              <FaGithub   size={24} />
            </a>
            <a
              href="https://x.com/_FashMayor"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition"
            >
              <FaXTwitter size={24} />
            </a>
            <a
              href="https://app.daily.dev/fash_mayor"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition"
            >
              <SiDailydotdev size={24} />
            </a>
          </div>
        </div>

        {/* Copyright and Back to Top */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} Bakery Mart. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition flex items-center space-x-2"
          >
            <FaArrowUp />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
