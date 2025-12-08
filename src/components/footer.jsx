import React from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaTiktok, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-800 text-white py-8 mb-14 lg:mb-0">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand and Tagline */}
                    <div>
                        <h3 className="text-xl font-bold mb-2">Sweet Delights Bakery</h3>
                        <p className="text-gray-300">Freshly baked goods with love</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-orange-400 transition">Home</Link></li>
                            <li><Link to="/shop" className="hover:text-orange-400 transition">Shop</Link></li>
                            <li><Link to="/about" className="hover:text-orange-400 transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-400 transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Customer Support</h4>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="hover:text-orange-400 transition">FAQ</Link></li>
                            <li><Link to="/returns" className="hover:text-orange-400 transition">Returns Policy</Link></li>
                            <li><Link to="/help" className="hover:text-orange-400 transition">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <p className="text-gray-300 mb-2">123 Bakery Street, Sweet City, SC 12345</p>
                        <p className="text-gray-300 mb-2">Phone: (555) 123-4567</p>
                        <p className="text-gray-300 mb-2">Email: info@sweetdelights.com</p>
                        <p className="text-gray-300">Hours: Mon-Sat 8AM-8PM, Sun 9AM-6PM</p>
                    </div>
                </div>

                {/* Delivery Information */}
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <h4 className="text-lg font-semibold mb-4">Delivery Information</h4>
                    <p className="text-gray-300">We deliver within a 10-mile radius. Delivery fee: $5. Free pickup available at our location.</p>
                </div>

                {/* Social Media and Payment */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition">
                            <FaFacebookF size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition">
                            <FaTiktok size={24} />
                        </a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">We accept:</span>
                        <div className="flex space-x-2">
                            <span className="bg-white text-black px-2 py-1 rounded text-xs font-bold">VISA</span>
                            <span className="bg-white text-black px-2 py-1 rounded text-xs font-bold">MC</span>
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">PayPal</span>
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">Cash</span>
                        </div>
                    </div>
                </div>

                {/* Copyright and Back to Top */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-300">&copy; {new Date().getFullYear()} Sweet Delights Bakery. All rights reserved.</p>
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
